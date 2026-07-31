"use client";

// Slimmed: the Games folder view now lives in Explorer (C:\Games); this
// module keeps the embedded Lazy-100 player window.

import type { AppDescriptor } from "@/system/types";

export const lazy100Player: AppDescriptor = {
  id: "lazy100-player",
  title: "Lazy-100",
  icon: "joystick",
  component: function Lazy100Player() {
    return (
      <div className="app-body app-body-fill app-body-dark">
        <iframe
          className="fill-frame"
          src="https://zzxzzk115.github.io/Lazy-100/"
          title="Lazy-100 Fantasy Console"
          allow="fullscreen; gamepad; autoplay"
        />
      </div>
    );
  },
  defaultSize: { width: 700, height: 560 },
};
