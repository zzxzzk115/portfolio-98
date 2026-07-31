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
import { WidgetsLayer } from "./WidgetsLayer";
import { useWidgets, WIDGET_DEFS } from "@/system/Widgets";
import { ShaderCanvas } from "@/lib/glview";
import { Screensaver, useIdleScreensaver } from "./Screensaver";
import { Clippy } from "./Clippy";

export function Desktop({ onShutdown }: { onShutdown: () => void }) {
  const wm = useWindowManager();
  const { wallpaper, crt } = useSettings();
  const saver = useIdleScreensaver();
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [taskbarMenuPos, setTaskbarMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const autoOpened = useRef(false);
  const { widgets, toggle } = useWidgets();

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
        setTaskbarMenuPos(null);
        setMenuPos({ x: e.clientX, y: e.clientY });
      }}
    >
      {wallpaper.frag ? (
        <ShaderCanvas
          frag={wallpaper.frag}
          className="wallpaper-canvas"
          paused={saver.active}
        />
      ) : null}
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

      <WidgetsLayer />

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
              separatorAfter: true,
            },
            ...WIDGET_DEFS.map((w) => ({
              label: w.title,
              checked: widgets[w.id].enabled,
              onClick: () => toggle(w.id),
            })),
          ]}
        />
      ) : null}

      {taskbarMenuPos ? (
        <ContextMenu
          x={taskbarMenuPos.x}
          y={taskbarMenuPos.y}
          onClose={() => setTaskbarMenuPos(null)}
          items={[
            {
              label: "Task Manager",
              onClick: () => {
                const taskmgr = APPS.find((a) => a.id === "taskmgr");
                if (taskmgr) wm.open(taskmgr);
              },
            },
          ]}
        />
      ) : null}

      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => {
          setMenuPos(null);
          setTaskbarMenuPos(null);
          setStartOpen((s) => !s);
        }}
        onContextMenu={(x, y) => {
          setMenuPos(null);
          setStartOpen(false);
          setTaskbarMenuPos({ x, y: y - 40 });
        }}
      />

      <Clippy />

      {crt ? <div className="crt-overlay" /> : null}
      {saver.active ? <Screensaver onExit={saver.exit} /> : null}
    </div>
  );
}
