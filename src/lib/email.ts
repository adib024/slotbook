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

function getGmail() {
  return google.gmail({ version: "v1", auth: getAuthClient() });
}

function buildRawEmail({
  to,
  from,
  subject,
  html,
}: {
  to: string;
  from: string;
  subject: string;
  html: string;
}): string {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    html,
  ].join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function formatDayDate(isoString: string): string {
  const date = new Date(isoString);
  const day = date.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  return `${day}, ${dateStr}`;
}

export async function sendConsumerConfirmation(details: {
  name: string;
  email: string;
  start: string;
  end: string;
  meetLink: string;
}) {
  const firstName = details.name.split(" ")[0];
  const dayDate = formatDayDate(details.start);
  const startTime = formatTime(details.start);
  const endTime = formatTime(details.end);
  const fullDate = formatDate(details.start);
  const adminEmail = process.env.ADMIN_EMAIL!;

  const subject = `Your booking is confirmed - ${dayDate} at ${startTime}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#fafafa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;padding:48px 40px;border:1px solid #eee;">
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Hi ${firstName},</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Your booking has been confirmed. Here are your session details:</p>
    <div style="background:#fafafa;border-radius:6px;padding:24px;margin:0 0 24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;font-size:14px;width:90px;">Date</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${fullDate}</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Time</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${startTime} - ${endTime} (IST)</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Duration</td><td style="padding:6px 0;font-size:14px;font-weight:600;">30 minutes</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Meet Link</td><td style="padding:6px 0;font-size:14px;"><a href="${details.meetLink}" style="color:#111;font-weight:600;">${details.meetLink}</a></td></tr>
      </table>
    </div>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">Click the Meet link above at your scheduled time to join the session.</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">If you need to reschedule or have any questions, simply reply to this email.</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 4px;">See you then.</p>
    <p style="font-size:16px;line-height:1.6;margin:24px 0 0;font-weight:600;">${adminEmail}</p>
  </div>
</body>
</html>`;

  const gmail = getGmail();
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: buildRawEmail({
        to: details.email,
        from: `SlotBook <${adminEmail}>`,
        subject,
        html,
      }),
    },
  });
}

export async function sendAdminNotification(details: {
  name: string;
  email: string;
  phone: string;
  note?: string;
  start: string;
  end: string;
  meetLink: string;
}) {
  const dayDate = formatDayDate(details.start);
  const startTime = formatTime(details.start);
  const endTime = formatTime(details.end);
  const fullDate = formatDate(details.start);
  const adminEmail = process.env.ADMIN_EMAIL!;

  const subject = `New booking: ${details.name} - ${dayDate} at ${startTime}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#fafafa;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:8px;padding:48px 40px;border:1px solid #eee;">
    <p style="font-size:18px;font-weight:600;margin:0 0 24px;">New Booking Received</p>
    <div style="background:#fafafa;border-radius:6px;padding:24px;margin:0 0 24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;font-size:14px;width:90px;">Name</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${details.name}</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Email</td><td style="padding:6px 0;font-size:14px;">${details.email}</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Phone</td><td style="padding:6px 0;font-size:14px;">${details.phone}</td></tr>
        ${details.note ? `<tr><td style="padding:6px 0;color:#666;font-size:14px;">Note</td><td style="padding:6px 0;font-size:14px;">${details.note}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Date</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${fullDate}</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Time</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${startTime} - ${endTime} (IST)</td></tr>
        <tr><td style="padding:6px 0;color:#666;font-size:14px;">Meet</td><td style="padding:6px 0;font-size:14px;"><a href="${details.meetLink}" style="color:#111;font-weight:600;">${details.meetLink}</a></td></tr>
      </table>
    </div>
  </div>
</body>
</html>`;

  const gmail = getGmail();
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: buildRawEmail({
        to: adminEmail,
        from: `SlotBook <${adminEmail}>`,
        subject,
        html,
      }),
    },
  });
}
