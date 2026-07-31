"use client";

import { useEffect, useRef, useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useSettings } from "@/system/Settings";
import { useMenu } from "@/system/MenuHost";
import { PixelIcon } from "@/system/pixel-icons";
import type { AppDescriptor } from "@/system/types";
import { Win98Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { WidgetsLayer } from "./WidgetsLayer";
import { useWidgets, WIDGET_DEFS } from "@/system/Widgets";
import { ShaderCanvas } from "@/lib/glview";
import { Screensaver, useIdleScreensaver } from "./Screensaver";
import { Clippy } from "./Clippy";

function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return h;
}

// Properties dialog for desktop icons (apps).
export function appPropertiesDescriptor(app: AppDescriptor): AppDescriptor {
  return {
    id: `props-app-${app.id}`,
    title: `${app.title} Properties`,
    icon: app.icon,
    component: function AppProps() {
      return (
        <div className="app-body props-dialog">
          <div className="props-head">
            <PixelIcon name={app.icon} size={32} />
            <b>{app.title}</b>
          </div>
          <hr className="props-rule" />
          <table className="props-table">
            <tbody>
              <tr>
                <td>Type:</td>
                <td>Application</td>
              </tr>
              <tr>
                <td>Location:</td>
                <td>C:\Desktop</td>
              </tr>
              <tr>
                <td>Size:</td>
                <td>{128 + (hashOf(app.id) % 3000)} KB</td>
              </tr>
              <tr>
                <td>Target:</td>
                <td>C:\Program Files\{app.id}.exe</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
    defaultSize: { width: 320, height: 260 },
  };
}

export function Desktop({ onShutdown }: { onShutdown: () => void }) {
  const wm = useWindowManager();
  const { wallpaper, crt } = useSettings();
  const saver = useIdleScreensaver();
  const { showMenu } = useMenu();
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
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

  const showDesktopMenu = (x: number, y: number) => {
    showMenu(x, y, [
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
    ]);
  };

  return (
    <div
      className="desktop"
      style={{ background: wallpaper.css }}
      onContextMenu={(e) => {
        // Windows keep the browser's native context menu inside their body;
        // icons/taskbar/widgets handle their own menus.
        if ((e.target as HTMLElement).closest(".win98-window")) return;
        e.preventDefault();
        setStartOpen(false);
        showDesktopMenu(e.clientX, e.clientY);
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
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedIcon(app.id);
              showMenu(e.clientX, e.clientY, [
                { label: "Open", onClick: () => wm.open(app), separatorAfter: true },
                {
                  label: "Properties",
                  onClick: () => wm.open(appPropertiesDescriptor(app)),
                },
              ]);
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

      <Clippy />

      {crt ? <div className="crt-overlay" /> : null}
      {saver.active ? <Screensaver onExit={saver.exit} /> : null}

      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((s) => !s)}
      />
    </div>
  );
}
