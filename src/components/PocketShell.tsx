"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useSettings } from "@/system/Settings";
import { useContent } from "@/system/ContentContext";
import { PixelIcon } from "@/system/pixel-icons";
import { asset } from "@/system/types";

function PocketClock() {
  const [time, setTime] = useState("");
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
  return <span className="pocket-clock">{time}</span>;
}

export function PocketShell() {
  const wm = useWindowManager();
  const { wallpaper } = useSettings();
  const { site } = useContent();
  const [startOpen, setStartOpen] = useState(false);

  // The PDA shows one app at a time: the topmost open window.
  const top = wm.windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.z - a.z)[0];

  const launcherApps = APPS.filter((a) => a.pocket);

  return (
    <div className="pocket" style={{ background: wallpaper.css }}>
      <div className="pocket-topbar">
        <button className="pocket-start" onClick={() => setStartOpen((s) => !s)}>
          <PixelIcon name="flag" size={16} />
          <b>{top ? top.app.title : site.pocketName}</b>
        </button>
        <PocketClock />
        {top ? (
          <button
            className="pocket-ok"
            aria-label="Close app"
            onClick={() => wm.close(top.id)}
          >
            ok
          </button>
        ) : null}
      </div>

      {startOpen ? (
        <div className="pocket-start-menu window">
          {wm.windows.length > 0 ? (
            <>
              <div className="pocket-menu-heading">Running</div>
              {wm.windows.map((w) => (
                <div
                  key={w.id}
                  className={
                    "start-menu-item pocket-running-item" +
                    (top?.id === w.id ? " pocket-running-item-active" : "")
                  }
                  onClick={() => {
                    wm.focus(w.id);
                    setStartOpen(false);
                  }}
                >
                  <PixelIcon name={w.app.icon} size={20} />
                  <span>{w.app.title}</span>
                  <button
                    className="pocket-running-close"
                    aria-label={`Close ${w.app.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      wm.close(w.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="start-menu-separator" />
            </>
          ) : null}
          {launcherApps.map((app) => (
            <button
              key={app.id}
              className="start-menu-item"
              onClick={() => {
                wm.open(app);
                setStartOpen(false);
              }}
            >
              <PixelIcon name={app.icon} size={20} />
              <span>{app.title}</span>
            </button>
          ))}
        </div>
      ) : null}

      {top ? (
        <div
          className="pocket-app window-body"
          onClick={() => setStartOpen(false)}
        >
          <top.app.component windowId={top.id} />
        </div>
      ) : (
        <div className="pocket-home" onClick={() => setStartOpen(false)}>
          <div className="pocket-today window">
            <div className="pocket-today-header">
              <img
                src={asset(site.avatar)}
                alt={site.name}
                className="pocket-avatar"
              />
              <div>
                <b>{site.name}</b>
                <div className="pocket-today-sub">{site.title}</div>
                <div className="pocket-today-sub">{site.affiliation}</div>
              </div>
            </div>
          </div>
          <div className="pocket-grid">
            {launcherApps.map((app) => (
              <button
                key={app.id}
                className="desktop-icon pocket-grid-icon"
                onClick={() => wm.open(app)}
              >
                <PixelIcon name={app.icon} size={32} />
                <span className="desktop-icon-label">{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
