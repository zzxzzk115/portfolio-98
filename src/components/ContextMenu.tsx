"use client";

import { useEffect } from "react";

export interface MenuItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  separatorAfter?: boolean;
}

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep the menu inside the viewport (taskbar excluded).
  const menuW = 180;
  const menuH = items.length * 24 + 8;
  const left = Math.min(x, window.innerWidth - menuW - 4);
  const top = Math.min(y, window.innerHeight - 30 - menuH - 4);

  return (
    <div className="context-menu window" style={{ left, top }}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="start-menu-item context-menu-item"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onClick?.();
              onClose();
            }}
          >
            {item.label}
          </button>
          {item.separatorAfter ? (
            <div className="start-menu-separator" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
