import { Calendar } from "@/components/Calendar";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <h1 className="text-lg font-bold tracking-tight">SlotBook</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Book a Session
          </h2>
          <p className="text-secondary text-[15px]">
            Select a date to see available 30-minute slots.
          </p>
        </div>

        <Calendar />
      </main>
    </div>
  );
}
