"use client";

import { useEffect, useRef, useState } from "react";
import { ShaderCanvas } from "@/lib/glview";
import { STARFIELD_FRAG, TUNNEL_FRAG } from "@/lib/shaders";
import { useSettings } from "@/system/Settings";
import { useContent } from "@/system/ContentContext";

function FlyingLogo() {
  const { site } = useContent();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = 100;
    let y = 100;
    let vx = 2.2;
    let vy = 1.7;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;
      x += vx;
      y += vy;
      if (x <= 0 || x >= maxX) {
        vx = -vx;
        x = Math.max(0, Math.min(x, maxX));
        el.style.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
      }
      if (y <= 0 || y >= maxY) {
        vy = -vy;
        y = Math.max(0, Math.min(y, maxY));
        el.style.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
      }
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="ss-logo" ref={ref}>
      {site.osName}
    </div>
  );
}

export function Screensaver({ onExit }: { onExit: () => void }) {
  const { screensaverMode } = useSettings();

  // Any input dismisses. Listen on capture so nothing swallows it.
  useEffect(() => {
    const exit = () => onExit();
    const opts = { capture: true } as const;
    window.addEventListener("pointerdown", exit, opts);
    window.addEventListener("pointermove", exit, opts);
    window.addEventListener("keydown", exit, opts);
    window.addEventListener("wheel", exit, opts);
    return () => {
      window.removeEventListener("pointerdown", exit, opts);
      window.removeEventListener("pointermove", exit, opts);
      window.removeEventListener("keydown", exit, opts);
      window.removeEventListener("wheel", exit, opts);
    };
  }, [onExit]);

  return (
    <div className="screensaver">
      {screensaverMode === "starfield" ? (
        <ShaderCanvas frag={STARFIELD_FRAG} className="ss-canvas" />
      ) : null}
      {screensaverMode === "tunnel" ? (
        <ShaderCanvas frag={TUNNEL_FRAG} className="ss-canvas" />
      ) : null}
      {screensaverMode === "logo" ? <FlyingLogo /> : null}
    </div>
  );
}

// Idle detection hook — returns whether the saver should show.
export function useIdleScreensaver(): { active: boolean; exit: () => void } {
  const { screensaverMode, screensaverDelay } = useSettings();
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);
  activeRef.current = active;

  useEffect(() => {
    if (screensaverMode === "none") return;
    const arm = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => setActive(true),
        screensaverDelay * 1000
      );
    };
    const onInput = () => {
      // While active, the Screensaver's own listeners handle dismissal;
      // rearm happens after exit.
      if (!activeRef.current) arm();
    };
    arm();
    window.addEventListener("pointermove", onInput);
    window.addEventListener("pointerdown", onInput);
    window.addEventListener("keydown", onInput);
    window.addEventListener("wheel", onInput);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("pointermove", onInput);
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("keydown", onInput);
      window.removeEventListener("wheel", onInput);
    };
  }, [screensaverMode, screensaverDelay, active]);

  return { active, exit: () => setActive(false) };
}
