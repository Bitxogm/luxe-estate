"use client";

import { useActionState, useState } from "react";
import { scheduleVisit } from "@/server/actions/visit.action";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "15:00",
  "15:30",
  "16:00",
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toISODate(d: Date) {
  return d.toISOString().split("T")[0];
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay(); // 0=Sun
  startDow = startDow === 0 ? 6 : startDow - 1; // Mon=0

  const prevLastDay = new Date(year, month, 0).getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { date: Date; currentMonth: boolean }[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, prevLastDay - i), currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), currentMonth: true });
  }
  const remaining = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), currentMonth: false });
  }

  return days;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Props {
  propertyId: string;
  propertySlug: string;
}

const initialState = { errors: {} as Record<string, string> };

export default function ScheduleVisitForm({ propertyId, propertySlug }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [state, action, isPending] = useActionState(scheduleVisit, initialState);

  const calDays = getCalendarDays(viewDate.getFullYear(), viewDate.getMonth());

  function prevMonth() {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) setViewDate(d);
  }

  function nextMonth() {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  }

  const canGoBack =
    viewDate.getFullYear() > today.getFullYear() || viewDate.getMonth() > today.getMonth();

  return (
    <form action={action} className="flex h-full flex-col justify-between">
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="propertySlug" value={propertySlug} />
      <input type="hidden" name="date" value={selectedDate ?? ""} />
      <input type="hidden" name="time" value={selectedTime ?? ""} />

      <div>
        <h1 className="mb-2 font-sf text-3xl font-bold text-nordic dark:text-clear-day">
          Schedule a Viewing
        </h1>
        <p className="mb-8 text-sm text-slate-500 dark:text-clear-day/60">
          Choose a date and time to tour the property in person.
        </p>

        {/* Calendar */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-nordic dark:text-clear-day">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoBack}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-mosque disabled:opacity-30 dark:hover:bg-white/10 dark:hover:text-hint-green"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-full p-1 text-nordic transition-colors hover:bg-slate-100 hover:text-mosque dark:text-clear-day dark:hover:bg-white/10 dark:hover:text-hint-green"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center">
            {DAY_LABELS.map((d) => (
              <div key={d} className="py-2 text-xs font-medium text-slate-400">
                {d}
              </div>
            ))}
            {calDays.map(({ date, currentMonth }, i) => {
              const iso = toISODate(date);
              const isPast = date < today;
              const isSelected = iso === selectedDate;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast || !currentMonth}
                  onClick={() => setSelectedDate(iso)}
                  className={`relative rounded-lg py-2 text-sm transition-colors ${
                    !currentMonth || isPast
                      ? "cursor-not-allowed text-slate-300 dark:text-slate-600"
                      : isSelected
                        ? "scale-105 bg-mosque font-semibold text-white shadow-lg shadow-mosque/30 dark:bg-hint-green dark:text-nordic"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          {state.errors.date && <p className="mt-2 text-xs text-red-500">{state.errors.date}</p>}
        </div>

        {/* Time slots */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-nordic dark:text-clear-day">
            Available Times
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {TIME_SLOTS.map((slot) => {
              const isSelected = slot === selectedTime;
              const [h, m] = slot.split(":").map(Number);
              const label = `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                    isSelected
                      ? "border-mosque bg-mosque/10 font-medium text-mosque shadow-sm dark:border-hint-green dark:bg-hint-green/10 dark:text-hint-green"
                      : "border-slate-200 text-slate-500 hover:border-mosque hover:text-mosque dark:border-white/10 dark:text-slate-400 dark:hover:border-hint-green dark:hover:text-hint-green"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {state.errors.time && <p className="mt-2 text-xs text-red-500">{state.errors.time}</p>}
        </div>

        {/* Message */}
        <div className="mb-8">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold uppercase tracking-wider text-nordic dark:text-clear-day"
          >
            Message for the agent{" "}
            <span className="font-normal normal-case text-slate-400">(Optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Any specific questions or requests?"
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-nordic placeholder-slate-400 outline-none transition-shadow focus:border-mosque focus:ring-1 focus:ring-mosque dark:border-white/10 dark:bg-white/5 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:border-hint-green dark:focus:ring-hint-green"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6 dark:border-white/10">
        <a
          href="./"
          className="px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-nordic dark:text-clear-day/60 dark:hover:text-clear-day"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isPending || !selectedDate || !selectedTime}
          className="flex items-center gap-2 rounded-lg bg-mosque px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-mosque/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:bg-hint-green dark:text-nordic"
        >
          {isPending ? "Confirming…" : "Confirm Visit"}
        </button>
      </div>
    </form>
  );
}
