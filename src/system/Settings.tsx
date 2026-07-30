"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface Wallpaper {
  id: string;
  name: string;
  // CSS background shorthand value. Image wallpapers (e.g. future paper
  // figures dropped into /public/wallpapers) can use url(...) here.
  css: string;
}

export const WALLPAPERS: Wallpaper[] = [
  { id: "teal", name: "Classic Teal", css: "#008080" },
  {
    id: "clouds",
    name: "Clouds",
    css: "linear-gradient(rgb(60,110,180), rgb(140,190,235) 55%, rgb(220,240,250))",
  },
  {
    id: "midnight",
    name: "Midnight",
    css: "linear-gradient(#000428, #004e92)",
  },
  {
    id: "grid",
    name: "Setup Grid",
    css: "repeating-linear-gradient(0deg, #0000aa 0 2px, transparent 2px 24px), repeating-linear-gradient(90deg, #0000aa 0 2px, transparent 2px 24px), #000060",
  },
  {
    id: "plum",
    name: "Plum",
    css: "#605080",
  },
  {
    id: "desert",
    name: "Desert",
    css: "linear-gradient(#c0885a, #d9a566)",
  },
];

interface SettingsApi {
  wallpaper: Wallpaper;
  setWallpaperId: (id: string) => void;
}

const SettingsContext = createContext<SettingsApi | null>(null);

export function useSettings(): SettingsApi {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings outside provider");
  return ctx;
}

const STORAGE_KEY = "win98-wallpaper";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [wallpaperId, setWallpaperIdState] = useState("teal");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && WALLPAPERS.some((w) => w.id === saved)) {
      setWallpaperIdState(saved);
    }
  }, []);

  const api = useMemo(() => {
    const wallpaper =
      WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
    return {
      wallpaper,
      setWallpaperId: (id: string) => {
        setWallpaperIdState(id);
        localStorage.setItem(STORAGE_KEY, id);
      },
    };
  }, [wallpaperId]);

  return (
    <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>
  );
}
