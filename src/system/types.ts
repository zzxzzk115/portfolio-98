import type { ComponentType } from "react";

export interface AppDescriptor {
  id: string;
  title: string;
  icon: string; // key into ICONS
  component: ComponentType<{ windowId: string }>;
  defaultSize?: { width: number; height: number };
  // Grow the window after mount so the content fits without scrolling
  // (clamped to the viewport).
  autoFit?: boolean;
  // Open centered in the viewport instead of at the cascade position.
  centered?: boolean;
  // Apps marked as such start maximized on small desktop viewports.
  desktop?: boolean; // show on desktop icon grid
  startMenu?: boolean; // show in start menu
  pocket?: boolean; // show in PDA launcher
}

export interface WindowState {
  id: string;
  app: AppDescriptor;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
