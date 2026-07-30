"use client";

import { projects } from "@/data/profile";
import { PixelIcon } from "@/system/pixel-icons";
import { useWindowManager } from "@/system/WindowManager";
import { projectAppDescriptor } from "./ProjectsApp";
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

const GAME_SLUGS = ["cells-of-division", "gold-miner-rebirth", "catmario-gb"];

export function GamesApp() {
  const wm = useWindowManager();

  return (
    <div className="app-body">
      <p className="hint-text">
        Games I&apos;ve made. Lazy-100 runs right here in a window — the others
        link out to Steam / itch.io.
      </p>
      <div className="icon-grid">
        <button
          className="icon-grid-item"
          onDoubleClick={() => wm.open(lazy100Player)}
          onClick={() => wm.open(lazy100Player)}
        >
          <PixelIcon name="joystick" size={32} />
          <span>Lazy-100 (play now!)</span>
        </button>
        {GAME_SLUGS.map((slug) => {
          const p = projects.find((x) => x.slug === slug);
          if (!p) return null;
          return (
            <button
              key={slug}
              className="icon-grid-item"
              onClick={() => wm.open(projectAppDescriptor(p))}
            >
              <PixelIcon name="gameboy" size={32} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
