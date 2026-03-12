import { NextRequest, NextResponse } from "next/server";
import {
  getAvailableSlotsByMonth,
  getAvailableSlotsByDate,
} from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const date = searchParams.get("date");

    if (date) {
      const slots = await getAvailableSlotsByDate(date);
      return NextResponse.json({ slots });
    }

    if (month) {
      const slots = await getAvailableSlotsByMonth(month);
      return NextResponse.json({ slots });
    }

    return NextResponse.json(
      { error: "Provide ?month=YYYY-MM or ?date=YYYY-MM-DD" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to fetch slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
