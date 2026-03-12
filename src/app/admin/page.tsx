"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Booking {
  id: string;
  summary: string;
  start: string;
  end: string;
  description: string;
  meetLink: string;
}

function parseDescription(desc: string) {
  const lines = desc.split("\n");
  const data: Record<string, string> = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(": ");
    if (key && rest.length) {
      data[key.trim().toLowerCase()] = rest.join(": ").trim();
    }
  }
  return data;
}

function formatDateTime(isoString: string): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch {
        setError("Failed to load bookings");
      }
      setLoading(false);
    }
    fetchBookings();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">SlotBook</h1>
            <p className="text-xs text-muted">Admin Dashboard</p>
          </div>
          <a
            href="/"
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            View public page
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold tracking-tight mb-6">
          Confirmed Bookings
        </h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-6">
            {error}
          </p>
        )}

        {bookings.length === 0 ? (
          <p className="text-sm text-muted">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const details = parseDescription(booking.description);
              return (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-[15px]">
                        {details.name || booking.summary.replace("Booked - ", "")}
                      </p>
                      <p className="text-sm text-secondary">
                        {details.email || ""}
                      </p>
                      {details.phone && (
                        <p className="text-sm text-muted">{details.phone}</p>
                      )}
                      {details.note && (
                        <p className="text-sm text-muted mt-1">
                          Note: {details.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                      <p className="text-sm font-medium">
                        {formatDateTime(booking.start)}
                      </p>
                      {booking.meetLink && (
                        <a
                          href={booking.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-secondary hover:text-primary transition-colors underline"
                        >
                          Google Meet
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
