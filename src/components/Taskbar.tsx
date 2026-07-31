"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/system/WindowManager";
import { PixelIcon } from "@/system/pixel-icons";
import { soundEnabled, setSoundEnabled, playSound } from "@/system/sounds";

function Clock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return <div className="taskbar-clock">{time}</div>;
}

function SpeakerToggle() {
  const [on, setOn] = useState(true);
  useEffect(() => setOn(soundEnabled()), []);
  return (
    <button
      className="tray-speaker"
      title={on ? "Mute sounds" : "Unmute sounds"}
      onClick={() => {
        const next = !on;
        setOn(next);
        setSoundEnabled(next);
        if (next) playSound("click");
      }}
    >
      <PixelIcon name={on ? "speaker" : "mute"} size={14} />
    </button>
  );
}

export function Taskbar({
  startOpen,
  onToggleStart,
  onContextMenu,
}: {
  startOpen: boolean;
  onToggleStart: () => void;
  onContextMenu?: (x: number, y: number) => void;
}) {
  const wm = useWindowManager();

  return (
    <div
      className="taskbar"
      onContextMenu={(e) => {
        if (!onContextMenu) return;
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e.clientX, e.clientY);
      }}
    >
      <button
        className={"start-button" + (startOpen ? " start-button-active" : "")}
        onClick={onToggleStart}
      >
        <PixelIcon name="flag" size={20} />
        <b>Start</b>
      </button>
      <div className="taskbar-divider" />
      <div className="taskbar-windows">
        {wm.windows.map((w) => (
          <button
            key={w.id}
            className={
              "taskbar-window-button" +
              (wm.focusedId === w.id && !w.minimized
                ? " taskbar-window-button-active"
                : "")
            }
            onClick={() => wm.taskbarClick(w.id)}
          >
            <PixelIcon name={w.app.icon} size={16} />
            <span>{w.app.title}</span>
          </button>
        ))}
      </div>
      <div className="taskbar-tray">
        <SpeakerToggle />
        <Clock />
      </div>
    </div>
  );
}
