"use client";

import { useEffect, useRef, useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useSettings } from "@/system/Settings";
import { PixelIcon } from "@/system/pixel-icons";
import { Win98Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { ContextMenu } from "./ContextMenu";

export function Desktop({ onShutdown }: { onShutdown: () => void }) {
  const wm = useWindowManager();
  const { wallpaper } = useSettings();
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const autoOpened = useRef(false);

  // Greet visitors with About Me already open.
  useEffect(() => {
    if (autoOpened.current) return;
    autoOpened.current = true;
    const about = APPS.find((a) => a.id === "about");
    if (about) wm.open(about);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desktopApps = APPS.filter((a) => a.desktop);

  // The sacred desktop-refresh ritual: blink the icons.
  const refreshDesktop = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 150);
  };

  return (
    <div
      className="desktop"
      style={{ background: wallpaper.css }}
      onContextMenu={(e) => {
        // Windows keep the browser's native context menu.
        if ((e.target as HTMLElement).closest(".win98-window")) return;
        e.preventDefault();
        setStartOpen(false);
        setMenuPos({ x: e.clientX, y: e.clientY });
      }}
    >
      <div
        className={"desktop-icons" + (refreshing ? " desktop-refreshing" : "")}
        onClick={() => {
          setSelectedIcon(null);
          setStartOpen(false);
          setMenuPos(null);
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
              setMenuPos(null);
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

      {menuPos ? (
        <ContextMenu
          x={menuPos.x}
          y={menuPos.y}
          onClose={() => setMenuPos(null)}
          items={[
            { label: "Refresh", onClick: refreshDesktop },
            {
              label: "Arrange Icons",
              onClick: refreshDesktop,
              separatorAfter: true,
            },
            { label: "New", disabled: true },
            { label: "Paste", disabled: true, separatorAfter: true },
            {
              label: "Properties",
              onClick: () => {
                const display = APPS.find((a) => a.id === "display");
                if (display) wm.open(display);
              },
            },
          ]}
        />
      ) : null}

      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => {
          setMenuPos(null);
          setStartOpen((s) => !s);
        }}
      />
    </div>
  );
}
