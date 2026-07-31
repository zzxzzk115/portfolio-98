"use client";

import { useState } from "react";
import {
  WALLPAPERS,
  useSettings,
  type ScreensaverMode,
} from "@/system/Settings";
import { ShaderCanvas } from "@/lib/glview";
import { STARFIELD_FRAG, TUNNEL_FRAG } from "@/lib/shaders";
import { soundEnabled, setSoundEnabled } from "@/system/sounds";

type Tab = "background" | "screensaver" | "effects";

const SS_MODES: { id: ScreensaverMode; name: string }[] = [
  { id: "none", name: "(None)" },
  { id: "starfield", name: "Starfield Simulation" },
  { id: "mystify", name: "Mystify Your Mind" },
  { id: "tunnel", name: "Shader Tunnel" },
  { id: "logo", name: "Flying Logo" },
];

function MonitorPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="display-monitor">
      <div className="display-monitor-bezel">
        <div className="display-monitor-screen">{children}</div>
      </div>
      <div className="display-monitor-stand" />
    </div>
  );
}

export function DisplayApp() {
  const settings = useSettings();
  const { wallpaper, setWallpaperId } = settings;
  const [tab, setTab] = useState<Tab>("background");
  const [previewId, setPreviewId] = useState(wallpaper.id);
  const [sound, setSound] = useState(soundEnabled);

  const preview = WALLPAPERS.find((w) => w.id === previewId) ?? wallpaper;

  return (
    <div className="app-body app-body-fill display-app">
      <menu role="tablist">
        {(
          [
            ["background", "Background"],
            ["screensaver", "Screen Saver"],
            ["effects", "Effects"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <li
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            <a href="#" onClick={(e) => e.preventDefault()}>
              {label}
            </a>
          </li>
        ))}
      </menu>

      <div className="taskmgr-page window display-page" role="tabpanel">
        {tab === "background" ? (
          <>
            <MonitorPreview>
              {preview.frag ? (
                <ShaderCanvas frag={preview.frag} className="fill-canvas" />
              ) : (
                <div
                  className="fill-canvas"
                  style={{ background: preview.css }}
                />
              )}
            </MonitorPreview>
            <fieldset>
              <legend>Wallpaper</legend>
              <div className="wallpaper-listbox" role="listbox">
                {WALLPAPERS.map((w) => (
                  <div
                    key={w.id}
                    role="option"
                    aria-selected={previewId === w.id}
                    className={
                      "wallpaper-listbox-item" +
                      (previewId === w.id
                        ? " wallpaper-listbox-item-selected"
                        : "")
                    }
                    onClick={() => setPreviewId(w.id)}
                    onDoubleClick={() => {
                      setPreviewId(w.id);
                      setWallpaperId(w.id);
                    }}
                  >
                    <span
                      className="wallpaper-swatch"
                      style={{ background: w.css }}
                    />
                    {w.name}
                  </div>
                ))}
              </div>
            </fieldset>
            <div className="toolbar-row toolbar-row-right">
              <button
                onClick={() => setWallpaperId(previewId)}
                disabled={previewId === wallpaper.id}
              >
                Apply
              </button>
              <button onClick={() => setPreviewId(wallpaper.id)}>Reset</button>
            </div>
            <p className="hint-text">
              ★ wallpapers are real-time GLSL shaders.
            </p>
          </>
        ) : null}

        {tab === "screensaver" ? (
          <>
            <MonitorPreview>
              {settings.screensaverMode === "starfield" ? (
                <ShaderCanvas frag={STARFIELD_FRAG} className="fill-canvas" />
              ) : settings.screensaverMode === "tunnel" ? (
                <ShaderCanvas frag={TUNNEL_FRAG} className="fill-canvas" />
              ) : (
                <div className="fill-canvas" style={{ background: "#000" }}>
                  {settings.screensaverMode === "logo" ? (
                    <span className="ss-preview-logo">Portfolio-98</span>
                  ) : null}
                </div>
              )}
            </MonitorPreview>
            <fieldset>
              <legend>Screen Saver</legend>
              <div className="wallpaper-listbox" role="listbox">
                {SS_MODES.map((m) => (
                  <div
                    key={m.id}
                    role="option"
                    aria-selected={settings.screensaverMode === m.id}
                    className={
                      "wallpaper-listbox-item" +
                      (settings.screensaverMode === m.id
                        ? " wallpaper-listbox-item-selected"
                        : "")
                    }
                    onClick={() => settings.setScreensaverMode(m.id)}
                  >
                    {m.name}
                  </div>
                ))}
              </div>
              <div className="field-row ss-delay-row">
                <label>Wait:</label>
                <input
                  type="number"
                  min={10}
                  max={600}
                  value={settings.screensaverDelay}
                  onChange={(e) =>
                    settings.setScreensaverDelay(
                      Math.max(10, Number(e.target.value) || 90)
                    )
                  }
                  className="ss-delay-input"
                />
                <span>seconds of idle</span>
              </div>
            </fieldset>
          </>
        ) : null}

        {tab === "effects" ? (
          <>
            <fieldset>
              <legend>Visual effects</legend>
              <div className="field-row">
                <input
                  type="checkbox"
                  id="crt-check"
                  checked={settings.crt}
                  onChange={(e) => settings.setCrt(e.target.checked)}
                />
                <label htmlFor="crt-check">
                  CRT monitor mode (scanlines + vignette)
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Sounds</legend>
              <div className="field-row">
                <input
                  type="checkbox"
                  id="sound-check"
                  checked={sound}
                  onChange={(e) => {
                    setSound(e.target.checked);
                    setSoundEnabled(e.target.checked);
                  }}
                />
                <label htmlFor="sound-check">
                  System sounds (startup chord, clicks, modem…)
                </label>
              </div>
            </fieldset>
            <p className="hint-text">
              Both settings are remembered on this device.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
