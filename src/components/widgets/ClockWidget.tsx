"use client";

import { useEffect, useState } from "react";

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div style={{ width: 120, height: 120 }} />;

  const sec = now.getSeconds();
  const min = now.getMinutes() + sec / 60;
  const hour = (now.getHours() % 12) + min / 60;

  const hand = (angleDeg: number, length: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x2: 60 + Math.cos(a) * length, y2: 60 + Math.sin(a) * length };
  };

  const h = hand(hour * 30, 28);
  const m = hand(min * 6, 40);
  const s = hand(sec * 6, 46);

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    return {
      x1: 60 + Math.cos(a) * 48,
      y1: 60 + Math.sin(a) * 48,
      x2: 60 + Math.cos(a) * 53,
      y2: 60 + Math.sin(a) * 53,
    };
  });

  return (
    <svg width={120} height={120} viewBox="0 0 120 120" aria-label="Clock">
      <circle cx={60} cy={60} r={56} fill="#d4d0c8" stroke="#808080" />
      <circle cx={60} cy={60} r={54} fill="#efefef" stroke="#fff" />
      {ticks.map((t, i) => (
        <line key={i} {...t} stroke="#000" strokeWidth={i % 3 === 0 ? 3 : 1} />
      ))}
      <line x1={60} y1={60} x2={h.x2} y2={h.y2} stroke="#000" strokeWidth={4} />
      <line x1={60} y1={60} x2={m.x2} y2={m.y2} stroke="#000" strokeWidth={2.5} />
      <line x1={60} y1={60} x2={s.x2} y2={s.y2} stroke="#aa0000" strokeWidth={1} />
      <circle cx={60} cy={60} r={3} fill="#000" />
    </svg>
  );
}
