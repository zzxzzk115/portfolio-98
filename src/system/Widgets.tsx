"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WidgetId = "clock" | "calendar" | "sysmon";

export const WIDGET_DEFS: { id: WidgetId; title: string; width: number }[] = [
  { id: "clock", title: "Clock", width: 140 },
  { id: "calendar", title: "Calendar", width: 180 },
  { id: "sysmon", title: "System Monitor", width: 180 },
];

interface WidgetState {
  enabled: boolean;
  x: number;
  y: number;
}

type WidgetsState = Record<WidgetId, WidgetState>;

interface WidgetsApi {
  widgets: WidgetsState;
  toggle: (id: WidgetId) => void;
  move: (id: WidgetId, x: number, y: number) => void;
}

const WidgetsContext = createContext<WidgetsApi | null>(null);

export function useWidgets(): WidgetsApi {
  const ctx = useContext(WidgetsContext);
  if (!ctx) throw new Error("useWidgets outside provider");
  return ctx;
}

const STORAGE_KEY = "win98-widgets";

function defaultState(): WidgetsState {
  // Stacked column along the right edge; refined after mount when the
  // viewport width is known.
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  return {
    clock: { enabled: true, x: vw - 156, y: 16 },
    calendar: { enabled: true, x: vw - 196, y: 190 },
    sysmon: { enabled: true, x: vw - 196, y: 390 },
  };
}

export function WidgetsProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<WidgetsState>(defaultState);

  useEffect(() => {
    // Stored positions are never mutated on resize — clamping happens at
    // render time in WidgetsLayer, so shrinking the viewport (e.g. desktop →
    // pocket → desktop) doesn't permanently drag widgets out of place.
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WidgetsState>;
        setWidgets((base) => ({ ...base, ...parsed }));
      }
    } catch {
      // corrupted storage: keep defaults
    }
  }, []);

  const api = useMemo<WidgetsApi>(() => {
    const persist = (next: WidgetsState) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    };
    return {
      widgets,
      toggle: (id) =>
        setWidgets((w) =>
          persist({ ...w, [id]: { ...w[id], enabled: !w[id].enabled } })
        ),
      move: (id, x, y) =>
        setWidgets((w) => persist({ ...w, [id]: { ...w[id], x, y } })),
    };
  }, [widgets]);

  return (
    <WidgetsContext.Provider value={api}>{children}</WidgetsContext.Provider>
  );
}
