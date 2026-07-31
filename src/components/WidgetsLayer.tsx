"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useWidgets, WIDGET_DEFS, type WidgetId } from "@/system/Widgets";
import { ClockWidget } from "./widgets/ClockWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { SysmonWidget } from "./widgets/SysmonWidget";

const WIDGET_COMPONENTS: Record<WidgetId, React.ComponentType> = {
  clock: ClockWidget,
  calendar: CalendarWidget,
  sysmon: SysmonWidget,
};

function WidgetCard({ id, title }: { id: WidgetId; title: string }) {
  const { widgets, move } = useWidgets();
  const state = widgets[id];
  const drag = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const Body = WIDGET_COMPONENTS[id];

  const onPointerDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: state.x,
      baseY: state.y,
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
      style={{ left: state.x, top: state.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
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
