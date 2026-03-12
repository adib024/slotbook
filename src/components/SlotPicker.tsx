"use client";

interface SlotEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function formatDateHeading(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function SlotPicker({
  date,
  slots,
  loading,
  onSelectSlot,
}: {
  date: string;
  slots: SlotEvent[];
  loading: boolean;
  onSelectSlot: (slot: SlotEvent) => void;
}) {
  if (loading) {
    return (
      <div className="mt-8 text-center text-sm text-muted">
        Loading available times...
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-sm font-medium text-secondary mb-4">
        {formatDateHeading(date)}
      </h3>

      {slots.length === 0 ? (
        <p className="text-sm text-muted">No available slots on this date.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              className="
                px-4 py-2.5 text-sm font-medium rounded-full
                border border-primary text-primary bg-white
                hover:bg-primary hover:text-white
                transition-all duration-150
                hover:shadow-sm
              "
            >
              {formatTime(slot.start)} - {formatTime(slot.end)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
