"use client";

import { useState } from "react";
import { WALLPAPERS, useSettings } from "@/system/Settings";

export function DisplayApp() {
  const { wallpaper, setWallpaperId } = useSettings();
  const [previewId, setPreviewId] = useState(wallpaper.id);

  const preview = WALLPAPERS.find((w) => w.id === previewId) ?? wallpaper;

  return (
    <div className="app-body">
      <div className="display-monitor">
        <div className="display-monitor-bezel">
          <div
            className="display-monitor-screen"
            style={{ background: preview.css }}
          />
        </div>
        <div className="display-monitor-stand" />
      </div>
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
                (previewId === w.id ? " wallpaper-listbox-item-selected" : "")
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
        Tip: future wallpapers (paper figures! renders!) just get added to the
        WALLPAPERS list in src/system/Settings.tsx.
      </p>
    </div>
  );
}
