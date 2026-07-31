"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/system/WindowManager";
import { useMenu } from "@/system/MenuHost";
import { useWidgets } from "@/system/Widgets";
import { APPS } from "@/system/registry";
import { PixelIcon } from "@/system/pixel-icons";
import { soundEnabled, setSoundEnabled, playSound } from "@/system/sounds";

function Clock() {
  const { showMenu } = useMenu();
  const { widgets, toggle } = useWidgets();
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
  return (
    <div
      className="taskbar-clock"
      title={new Date().toDateString()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu(e.clientX, e.clientY - 60, [
          {
            label: "Adjust Date/Time",
            checked: widgets.calendar.enabled,
            onClick: () => toggle("calendar"),
          },
        ]);
      }}
    >
      {time}
    </div>
  );
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
}: {
  startOpen: boolean;
  onToggleStart: () => void;
}) {
  const wm = useWindowManager();
  const { showMenu } = useMenu();

  return (
    <div
      className="taskbar"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu(e.clientX, e.clientY - 40, [
          {
            label: "Task Manager",
            onClick: () => {
              const taskmgr = APPS.find((a) => a.id === "taskmgr");
              if (taskmgr) wm.open(taskmgr);
            },
          },
        ]);
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
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              showMenu(e.clientX, e.clientY - 90, [
                {
                  label: "Restore",
                  disabled: !w.minimized && wm.focusedId === w.id,
                  onClick: () => wm.focus(w.id),
                },
                {
                  label: "Minimize",
                  disabled: w.minimized,
                  onClick: () => wm.minimize(w.id),
                  separatorAfter: true,
                },
                { label: "Close", onClick: () => wm.close(w.id) },
              ]);
            }}
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
