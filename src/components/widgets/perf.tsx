"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowManager } from "@/system/WindowManager";

const SAMPLES = 60;

// Playful fake CPU: a random walk that rises with the number of open windows.
export function usePerfData() {
  const wm = useWindowManager();
  const windowCount = wm.windows.length;
  const countRef = useRef(windowCount);
  countRef.current = windowCount;

  const [history, setHistory] = useState<number[]>(() =>
    Array(SAMPLES).fill(5)
  );
  const walk = useRef(5);

  useEffect(() => {
    const id = setInterval(() => {
      const base = 5 + countRef.current * 7;
      walk.current = Math.max(
        0,
        Math.min(100, walk.current + (Math.random() - 0.5) * 14)
      );
      const value = Math.max(
        2,
        Math.min(98, Math.round(base * 0.7 + walk.current * 0.5))
      );
      setHistory((h) => [...h.slice(1), value]);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const cpu = history[history.length - 1];
  const mem = 32 + windowCount * 6; // "MB"
  return { history, cpu, mem, windowCount };
}

export function PerfGraph({
  history,
  height = 60,
}: {
  history: number[];
  height?: number;
}) {
  const w = 100; // viewBox units; stretches to container width
  const points = history
    .map(
      (v, i) =>
        `${(i / (history.length - 1)) * w},${height - (v / 100) * height}`
    )
    .join(" ");
  const grid: number[] = [];
  for (let i = 1; i < 4; i++) grid.push((height / 4) * i);

  return (
    <svg
      className="perf-graph"
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      style={{ height }}
    >
      <rect x={0} y={0} width={w} height={height} fill="#000" />
      {grid.map((y) => (
        <line key={y} x1={0} y1={y} x2={w} y2={y} stroke="#005500" strokeWidth={0.5} />
      ))}
      {[20, 40, 60, 80].map((x) => (
        <line key={x} x1={x} y1={0} x2={x} y2={height} stroke="#005500" strokeWidth={0.5} />
      ))}
      <polyline
        points={points}
        fill="none"
        stroke="#00ff00"
        strokeWidth={1.2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
