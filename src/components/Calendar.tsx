"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlotPicker } from "./SlotPicker";
import { BookingModal } from "./BookingModal";

interface SlotEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}

export function Calendar() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [monthSlots, setMonthSlots] = useState<SlotEvent[]>([]);
  const [dateSlots, setDateSlots] = useState<SlotEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDate, setLoadingDate] = useState(false);

  const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

  const fetchMonthSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/slots?month=${monthStr}`);
      const data = await res.json();
      setMonthSlots(data.slots || []);
    } catch {
      setMonthSlots([]);
    }
    setLoading(false);
  }, [monthStr]);

  useEffect(() => {
    fetchMonthSlots();
    setSelectedDate(null);
    setDateSlots([]);
  }, [fetchMonthSlots]);

  const fetchDateSlots = async (dateStr: string) => {
    setLoadingDate(true);
    try {
      const res = await fetch(`/api/slots?date=${dateStr}`);
      const data = await res.json();
      setDateSlots(data.slots || []);
    } catch {
      setDateSlots([]);
    }
    setLoadingDate(false);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    fetchDateSlots(dateStr);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calendar grid calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Which dates have available slots
  const datesWithSlots = new Set(
    monthSlots.map((slot) => {
      const d = new Date(slot.start);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })
  );

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
    "en-US",
    { month: "long" }
  );

  const handleBookingSuccess = () => {
    setSelectedSlot(null);
    if (selectedDate) {
      fetchDateSlots(selectedDate);
    }
    fetchMonthSlots();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <h2 className="text-lg font-semibold tracking-tight">
          {monthName} {currentYear}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells for days before the 1st */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasSlots = datesWithSlots.has(dateStr);
          const isPast =
            new Date(currentYear, currentMonth, day) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={day}
              onClick={() => !isPast && handleDateClick(day)}
              disabled={isPast}
              className={`
                relative h-12 flex flex-col items-center justify-center rounded-full mx-auto w-12
                transition-all duration-150
                ${isPast ? "text-gray-300 cursor-default" : "cursor-pointer hover:bg-gray-100"}
                ${isSelected ? "bg-primary text-white hover:bg-primary" : ""}
                ${isToday && !isSelected ? "ring-1 ring-primary" : ""}
              `}
            >
              <span className="text-sm font-medium">{day}</span>
              {hasSlots && !isSelected && !isPast && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
              {hasSlots && isSelected && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-8 text-center text-sm text-muted">
          Loading slots...
        </div>
      )}

      {/* Slot picker */}
      {selectedDate && !loading && (
        <SlotPicker
          date={selectedDate}
          slots={dateSlots}
          loading={loadingDate}
          onSelectSlot={setSelectedSlot}
        />
      )}

      {/* Booking modal */}
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
