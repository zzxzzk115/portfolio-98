"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useSettings } from "@/system/Settings";
import { PixelIcon } from "@/system/pixel-icons";
import { profile } from "@/data/profile";
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
  const [startOpen, setStartOpen] = useState(false);

  // The PDA shows one app at a time: the topmost open window.
  const top = wm.windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.z - a.z)[0];

  const launcherApps = APPS.filter((a) => a.pocket);

  return (
    <div className="pocket" style={{ background: wallpaper.css }}>
      <div className="pocket-topbar">
        <button
          className="pocket-start"
          onClick={() => setStartOpen((s) => !s)}
        >
          <PixelIcon name="flag" size={16} />
          <b>{top ? top.app.title : profile.pocketName}</b>
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
        <div className="pocket-app window-body" onClick={() => setStartOpen(false)}>
          <top.app.component windowId={top.id} />
        </div>
      ) : (
        <div className="pocket-home" onClick={() => setStartOpen(false)}>
          <div className="pocket-today window">
            <div className="pocket-today-header">
              <img
                src={asset(profile.avatar)}
                alt={profile.name}
                className="pocket-avatar"
              />
              <div>
                <b>{profile.name}</b>
                <div className="pocket-today-sub">{profile.title}</div>
                <div className="pocket-today-sub">{profile.affiliation}</div>
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
