"use client";

import { useEffect, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
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

export function CalendarWidget({ compact = false }: { compact?: boolean }) {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
    // Roll over at midnight without needing a reload.
    const id = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!today) return null;

  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  return (
    <div className={"cal-widget" + (compact ? " cal-widget-compact" : "")}>
      <div className="cal-header">
        {MONTHS[month]} {year}
      </div>
      <div className="cal-grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal-weekday">
            {d}
          </span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={
              "cal-day" + (d === today.getDate() ? " cal-day-today" : "")
            }
          >
            {d ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
