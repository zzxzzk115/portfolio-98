"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { WindowState } from "@/system/types";
import { useWindowManager } from "@/system/WindowManager";
import { PixelIcon } from "@/system/pixel-icons";

export function Win98Window({ win }: { win: WindowState }) {
  const wm = useWindowManager();
  const rootRef = useRef<HTMLDivElement>(null);
  const fitDone = useRef(false);

  // autoFit: grow the window once after mount so content fits without
  // scrolling, clamped to the viewport (taskbar excluded).
  useEffect(() => {
    if (!win.app.autoFit || fitDone.current) return;

    const fit = () => {
      const root = rootRef.current;
      if (!root || fitDone.current) return;
      const scroller =
        root.querySelector<HTMLElement>(".app-body") ??
        root.querySelector<HTMLElement>(".win98-window-body");
      if (!scroller) return;
      const extraH = scroller.scrollHeight - scroller.clientHeight;
      const extraW = scroller.scrollWidth - scroller.clientWidth;
      if (extraH <= 0 && extraW <= 0) {
        fitDone.current = true;
        return;
      }
      const rect = root.getBoundingClientRect();
      const maxH = window.innerHeight - 30 - 16; // taskbar + margin
      const maxW = window.innerWidth - 16;
      const newH = Math.min(rect.height + extraH + 6, maxH);
      const newW = Math.min(rect.width + extraW, maxW);
      wm.resize(win.id, newW, newH);
      // Keep the grown window fully on screen.
      wm.move(
        win.id,
        Math.max(8, Math.min(rect.left, window.innerWidth - newW - 8)),
        Math.max(8, Math.min(rect.top, window.innerHeight - 30 - newH - 8))
      );
      fitDone.current = true;
    };

    // Measure after first paint, then re-measure once webfonts settle.
    const raf = requestAnimationFrame(fit);
    document.fonts?.ready.then(() => {
      fitDone.current = false;
      fit();
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dragState = useRef<{
    mode: "move" | "resize";
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    baseW: number;
    baseH: number;
  } | null>(null);

  const active = wm.focusedId === win.id;

  const onTitlePointerDown = (e: ReactPointerEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      mode: "move",
      startX: e.clientX,
      startY: e.clientY,
      baseX: win.x,
      baseY: win.y,
      baseW: win.width,
      baseH: win.height,
    };
  };

  const onResizePointerDown = (e: ReactPointerEvent) => {
    if (win.maximized) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      mode: "resize",
      startX: e.clientX,
      startY: e.clientY,
      baseX: win.x,
      baseY: win.y,
      baseW: win.width,
      baseH: win.height,
    };
    e.stopPropagation();
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (d.mode === "move") {
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 80;
      wm.move(
        win.id,
        Math.min(Math.max(d.baseX + dx, -win.width + 120), maxX),
        Math.min(Math.max(d.baseY + dy, 0), maxY)
      );
    } else {
      wm.resize(
        win.id,
        Math.max(280, d.baseW + dx),
        Math.max(160, d.baseH + dy)
      );
    }
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const Body = win.app.component;

  const style = win.maximized
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: win.z }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.z,
      };

  return (
    <div
      ref={rootRef}
      className={
        "window win98-window" +
        (win.maximized ? " win98-window-maximized" : "") +
        (win.minimized ? " win98-window-minimized" : "")
      }
      style={style}
      onPointerDown={() => wm.focus(win.id)}
    >
      <div
        className={"title-bar" + (active ? "" : " inactive")}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => wm.toggleMaximize(win.id)}
      >
        <div className="title-bar-icon">
          <PixelIcon name={win.app.icon} size={16} />
        </div>
        <div className="title-bar-text">{win.app.title}</div>
        <div className="title-bar-controls">
          <button
            aria-label="Minimize"
            onClick={() => wm.minimize(win.id)}
          ></button>
          <button
            aria-label={win.maximized ? "Restore" : "Maximize"}
            onClick={() => wm.toggleMaximize(win.id)}
          ></button>
          <button aria-label="Close" onClick={() => wm.close(win.id)}></button>
        </div>
      </div>
      <div className="window-body win98-window-body">
        <Body windowId={win.id} />
      </div>
      {!win.maximized ? (
        <div
          className="win98-resize-handle"
          onPointerDown={onResizePointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      ) : null}
    </div>
  );
}
