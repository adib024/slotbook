import { google } from "googleapis";

function getAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

function getCalendar() {
  return google.calendar({ version: "v3", auth: getAuthClient() });
}

const CALENDAR_ID = () => process.env.GOOGLE_CALENDAR_ID!;

export interface SlotEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}

function isAvailableSlot(event: {
  summary?: string | null;
  start?: { dateTime?: string | null };
  end?: { dateTime?: string | null };
}): boolean {
  const title = (event.summary || "").toLowerCase();
  if (!title.includes("open") && !title.includes("available")) return false;

  const start = event.start?.dateTime;
  const end = event.end?.dateTime;
  if (!start || !end) return false;

  const durationMs = new Date(end).getTime() - new Date(start).getTime();
  const thirtyMinutes = 30 * 60 * 1000;
  return durationMs === thirtyMinutes;
}

export async function getAvailableSlotsByMonth(
  month: string
): Promise<SlotEvent[]> {
  const calendar = getCalendar();
  const [year, mon] = month.split("-").map(Number);
  const timeMin = new Date(year, mon - 1, 1).toISOString();
  const timeMax = new Date(year, mon, 0, 23, 59, 59).toISOString();

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID(),
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
  });

  return (response.data.items || [])
    .filter(isAvailableSlot)
    .map((event) => ({
      id: event.id!,
      summary: event.summary!,
      start: event.start!.dateTime!,
      end: event.end!.dateTime!,
    }));
}

export async function getAvailableSlotsByDate(
  date: string
): Promise<SlotEvent[]> {
  const calendar = getCalendar();
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID(),
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  return (response.data.items || [])
    .filter(isAvailableSlot)
    .map((event) => ({
      id: event.id!,
      summary: event.summary!,
      start: event.start!.dateTime!,
      end: event.end!.dateTime!,
    }));
}

export async function bookSlot(
  eventId: string,
  consumer: {
    name: string;
    email: string;
    phone: string;
    note?: string;
  }
): Promise<{ meetLink: string; start: string; end: string }> {
  const calendar = getCalendar();

  // First, verify the slot is still available (race condition protection)
  const existing = await calendar.events.get({
    calendarId: CALENDAR_ID(),
    eventId,
  });

  const title = (existing.data.summary || "").toLowerCase();
  if (!title.includes("open") && !title.includes("available")) {
    throw new Error("SLOT_ALREADY_BOOKED");
  }

  const updated = await calendar.events.patch({
    calendarId: CALENDAR_ID(),
    eventId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Booked - ${consumer.name}`,
      description: [
        `Name: ${consumer.name}`,
        `Email: ${consumer.email}`,
        `Phone: ${consumer.phone}`,
        consumer.note ? `Note: ${consumer.note}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      attendees: [{ email: consumer.email }],
      conferenceData: {
        createRequest: {
          requestId: `slotbook-${eventId}-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const meetLink =
    updated.data.hangoutLink ||
    updated.data.conferenceData?.entryPoints?.[0]?.uri ||
    "";

  return {
    meetLink,
    start: updated.data.start?.dateTime || existing.data.start?.dateTime || "",
    end: updated.data.end?.dateTime || existing.data.end?.dateTime || "",
  };
}

export async function getAllBookings(): Promise<
  {
    id: string;
    summary: string;
    start: string;
    end: string;
    description: string;
    meetLink: string;
  }[]
> {
  const calendar = getCalendar();
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID(),
    timeMin: threeMonthsAgo.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 500,
  });

  return (response.data.items || [])
    .filter((e) => (e.summary || "").toLowerCase().startsWith("booked -"))
    .map((event) => ({
      id: event.id!,
      summary: event.summary!,
      start: event.start?.dateTime || "",
      end: event.end?.dateTime || "",
      description: event.description || "",
      meetLink: event.hangoutLink || "",
    }));
}
