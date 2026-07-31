"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useWidgets, WIDGET_DEFS, type WidgetId } from "@/system/Widgets";
import { useMenu } from "@/system/MenuHost";
import { ClockWidget } from "./widgets/ClockWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { SysmonWidget } from "./widgets/SysmonWidget";

const WIDGET_COMPONENTS: Record<WidgetId, React.ComponentType> = {
  clock: ClockWidget,
  calendar: CalendarWidget,
  sysmon: SysmonWidget,
};

function useViewport() {
  const [size, setSize] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function WidgetCard({ id, title }: { id: WidgetId; title: string }) {
  const { widgets, move, toggle } = useWidgets();
  const { showMenu } = useMenu();
  const state = widgets[id];
  const { w: vw, h: vh } = useViewport();
  const drag = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const Body = WIDGET_COMPONENTS[id];

  // Render-time clamp only — the stored position survives viewport dips.
  const shownX = Math.max(-60, Math.min(state.x, vw - 80));
  const shownY = Math.max(0, Math.min(state.y, vh - 110));

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: shownX,
      baseY: shownY,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const x = Math.max(
      -60,
      Math.min(d.baseX + e.clientX - d.startX, window.innerWidth - 60)
    );
    const y = Math.max(
      0,
      Math.min(d.baseY + e.clientY - d.startY, window.innerHeight - 80)
    );
    move(id, x, y);
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div
      className="widget-card"
      style={{ left: shownX, top: shownY }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu(e.clientX, e.clientY, [
          { label: `Hide ${title}`, onClick: () => toggle(id) },
        ]);
      }}
      title={title}
    >
      <Body />
    </div>
  );
}

export function WidgetsLayer() {
  const { widgets } = useWidgets();
  return (
    <div className="widgets-layer">
      {WIDGET_DEFS.filter((w) => widgets[w.id].enabled).map((w) => (
        <WidgetCard key={w.id} id={w.id} title={w.title} />
      ))}
    </div>
  );
}
