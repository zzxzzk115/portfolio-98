"use client";

import { useEffect, useRef, useState } from "react";
import { ShaderCanvas } from "@/lib/glview";
import { STARFIELD_FRAG, TUNNEL_FRAG } from "@/lib/shaders";
import { useSettings } from "@/system/Settings";
import { useContent } from "@/system/ContentContext";

// Mystify Your Mind: bouncing polylines with fading trails.
function Mystify() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Shape {
      pts: { x: number; y: number; vx: number; vy: number }[];
      hue: number;
      trail: { x: number; y: number }[][];
    }
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const shapes: Shape[] = Array.from({ length: 2 }, (_, s) => ({
      pts: Array.from({ length: 4 }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(2, 5) * (Math.random() < 0.5 ? -1 : 1),
        vy: rand(2, 5) * (Math.random() < 0.5 ? -1 : 1),
      })),
      hue: s === 0 ? 180 : 300,
      trail: [],
    }));

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      shapes.forEach((shape) => {
        shape.pts.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x <= 0 || p.x >= canvas.width) p.vx = -p.vx;
          if (p.y <= 0 || p.y >= canvas.height) p.vy = -p.vy;
        });
        shape.trail.push(shape.pts.map((p) => ({ x: p.x, y: p.y })));
        if (shape.trail.length > 14) shape.trail.shift();
        shape.hue = (shape.hue + 0.4) % 360;
        shape.trail.forEach((poly, i) => {
          ctx.strokeStyle = `hsla(${shape.hue}, 100%, 60%, ${
            (i + 1) / shape.trail.length
          })`;
          ctx.beginPath();
          poly.forEach((p, j) =>
            j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
          );
          ctx.closePath();
          ctx.stroke();
        });
      });
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="ss-canvas" />;
}

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
      {screensaverMode === "mystify" ? <Mystify /> : null}
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
