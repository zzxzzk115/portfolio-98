"use client";

import { useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useSettings } from "@/system/Settings";
import { PixelIcon } from "@/system/pixel-icons";
import { Win98Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";

export function Desktop({ onShutdown }: { onShutdown: () => void }) {
  const wm = useWindowManager();
  const { wallpaper } = useSettings();
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const desktopApps = APPS.filter((a) => a.desktop);

  return (
    <div className="desktop" style={{ background: wallpaper.css }}>
      <div
        className="desktop-icons"
        onClick={() => {
          setSelectedIcon(null);
          setStartOpen(false);
        }}
      >
        {desktopApps.map((app) => (
          <button
            key={app.id}
            className={
              "desktop-icon" +
              (selectedIcon === app.id ? " desktop-icon-selected" : "")
            }
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIcon(app.id);
            }}
            onDoubleClick={() => {
              wm.open(app);
              setSelectedIcon(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") wm.open(app);
            }}
          >
            <PixelIcon name={app.icon} size={32} />
            <span className="desktop-icon-label">{app.title}</span>
          </button>
        ))}
      </div>

      {wm.windows.map((w) => (
        <Win98Window key={w.id} win={w} />
      ))}

      {startOpen ? (
        <StartMenu
          onClose={() => setStartOpen(false)}
          onShutdown={() => {
            setStartOpen(false);
            onShutdown();
          }}
        />
      ) : null}

      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((s) => !s)}
      />
    </div>
  );
}
