import { NextRequest, NextResponse } from "next/server";
import { bookSlot, getAllBookings } from "@/lib/google-calendar";
import { sendConsumerConfirmation, sendAdminNotification } from "@/lib/email";
import { verifySession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name, email, phone, note } = body;

    if (!eventId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, name, email, phone" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const result = await bookSlot(eventId, { name, email, phone, note });

    // Send emails in parallel
    await Promise.allSettled([
      sendConsumerConfirmation({
        name,
        email,
        start: result.start,
        end: result.end,
        meetLink: result.meetLink,
      }),
      sendAdminNotification({
        name,
        email,
        phone,
        note,
        start: result.start,
        end: result.end,
        meetLink: result.meetLink,
      }),
    ]);

    return NextResponse.json({
      success: true,
      meetLink: result.meetLink,
      start: result.start,
      end: result.end,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_ALREADY_BOOKED") {
      return NextResponse.json(
        { error: "This slot has already been booked. Please select another." },
        { status: 409 }
      );
    }
    console.error("Booking failed:", error);
    return NextResponse.json(
      { error: "Failed to complete booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isAdmin = await verifySession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
