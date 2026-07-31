"use client";

import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useContent } from "@/system/ContentContext";
import { PixelIcon } from "@/system/pixel-icons";

export function StartMenu({
  onClose,
  onShutdown,
}: {
  onClose: () => void;
  onShutdown: () => void;
}) {
  const wm = useWindowManager();
  const { site } = useContent();

  const items = APPS.filter((a) => a.startMenu);

  return (
    <div className="start-menu window">
      <div className="start-menu-banner">
        <span>{site.osName}</span>
      </div>
      <div className="start-menu-items">
        {items.map((app) => (
          <button
            key={app.id}
            className="start-menu-item"
            onClick={() => {
              wm.open(app);
              onClose();
            }}
          >
            <PixelIcon name={app.icon} size={24} />
            <span>{app.title}</span>
          </button>
        ))}
        <div className="start-menu-separator" />
        <a
          className="start-menu-item start-menu-link"
          href={site.socials.academicSite}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
        >
          <PixelIcon name="globe" size={24} />
          <span>Academic Site</span>
        </a>
        <div className="start-menu-separator" />
        <button className="start-menu-item" onClick={onShutdown}>
          <PixelIcon name="computer" size={24} />
          <span>Shut Down...</span>
        </button>
      </div>
    </div>
  );
}
