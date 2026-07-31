"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PLASMA_FRAG, DRIFT_FRAG, RIPPLE_FRAG } from "@/lib/shaders";

export interface Wallpaper {
  id: string;
  name: string;
  // CSS background shorthand — also the fallback when WebGL is unavailable.
  css: string;
  // When set, the wallpaper renders as a fullscreen fragment shader.
  frag?: string;
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
  { id: "plum", name: "Plum", css: "#605080" },
  { id: "desert", name: "Desert", css: "linear-gradient(#c0885a, #d9a566)" },
  // Animated (GLSL) — hand-written shaders, as is proper for a graphics PhD.
  { id: "plasma", name: "★ Plasma (GLSL)", css: "#204060", frag: PLASMA_FRAG },
  { id: "drift", name: "★ Drift (GLSL)", css: "#003338", frag: DRIFT_FRAG },
  { id: "ripple", name: "★ Ripple (GLSL)", css: "#052540", frag: RIPPLE_FRAG },
];

export type ScreensaverMode =
  | "none"
  | "starfield"
  | "mystify"
  | "tunnel"
  | "logo";

interface SettingsApi {
  wallpaper: Wallpaper;
  setWallpaperId: (id: string) => void;
  crt: boolean;
  setCrt: (on: boolean) => void;
  screensaverMode: ScreensaverMode;
  setScreensaverMode: (m: ScreensaverMode) => void;
  screensaverDelay: number; // seconds
  setScreensaverDelay: (s: number) => void;
}

const SettingsContext = createContext<SettingsApi | null>(null);

export function useSettings(): SettingsApi {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings outside provider");
  return ctx;
}

const WP_KEY = "win98-wallpaper";
const CRT_KEY = "win98-crt";
const SS_MODE_KEY = "win98-ss-mode";
const SS_DELAY_KEY = "win98-ss-delay";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [wallpaperId, setWallpaperIdState] = useState("teal");
  const [crt, setCrtState] = useState(false);
  const [screensaverMode, setSsModeState] =
    useState<ScreensaverMode>("starfield");
  const [screensaverDelay, setSsDelayState] = useState(90);

  useEffect(() => {
    const wp = localStorage.getItem(WP_KEY);
    if (wp && WALLPAPERS.some((w) => w.id === wp)) setWallpaperIdState(wp);
    setCrtState(localStorage.getItem(CRT_KEY) === "on");
    const mode = localStorage.getItem(SS_MODE_KEY) as ScreensaverMode | null;
    if (
      mode &&
      ["none", "starfield", "mystify", "tunnel", "logo"].includes(mode)
    ) {
      setSsModeState(mode);
    }
    const delay = Number(localStorage.getItem(SS_DELAY_KEY));
    if (delay >= 10) setSsDelayState(delay);
  }, []);

  const api = useMemo<SettingsApi>(() => {
    const wallpaper =
      WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0];
    return {
      wallpaper,
      setWallpaperId: (id) => {
        setWallpaperIdState(id);
        localStorage.setItem(WP_KEY, id);
      },
      crt,
      setCrt: (on) => {
        setCrtState(on);
        localStorage.setItem(CRT_KEY, on ? "on" : "off");
      },
      screensaverMode,
      setScreensaverMode: (m) => {
        setSsModeState(m);
        localStorage.setItem(SS_MODE_KEY, m);
      },
      screensaverDelay,
      setScreensaverDelay: (s) => {
        setSsDelayState(s);
        localStorage.setItem(SS_DELAY_KEY, String(s));
      },
    };
  }, [wallpaperId, crt, screensaverMode, screensaverDelay]);

  return (
    <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>
  );
}
