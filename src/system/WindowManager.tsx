"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppDescriptor, WindowState } from "./types";
import { playSound } from "./sounds";

interface WindowManagerApi {
  windows: WindowState[];
  focusedId: string | null;
  open: (app: AppDescriptor) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, width: number, height: number) => void;
  taskbarClick: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerApi | null>(null);

export function useWindowManager(): WindowManagerApi {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager outside provider");
  return ctx;
}

let nextZ = 10;

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const spawnCount = useRef(0);

  const focus = useCallback((id: string) => {
    setFocusedId(id);
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, z: ++nextZ, minimized: false } : w))
    );
  }, []);

  const open = useCallback(
    (app: AppDescriptor) => {
      let existing: WindowState | undefined;
      setWindows((ws) => {
        existing = ws.find((w) => w.app.id === app.id);
        if (existing) return ws;
        const n = spawnCount.current++;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const width = Math.min(app.defaultSize?.width ?? 560, vw - 24);
        const height = Math.min(app.defaultSize?.height ?? 420, vh - 80);
        // 30px taskbar excluded from the vertical centering area.
        const x = app.centered
          ? Math.max(8, Math.round((vw - width) / 2))
          : Math.max(8, 60 + ((n * 32) % Math.max(60, vw - width - 80)));
        const y = app.centered
          ? Math.max(8, Math.round((vh - 30 - height) / 2))
          : Math.max(8, 40 + ((n * 28) % Math.max(60, vh - height - 120)));
        const win: WindowState = {
          id: app.id,
          app,
          x,
          y,
          width,
          height,
          z: ++nextZ,
          minimized: false,
          maximized: vw < 700,
        };
        return [...ws, win];
      });
      // Whether newly created or pre-existing, bring it to front.
      focus(app.id);
      playSound("click");
    },
    [focus]
  );

  const close = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setFocusedId((f) => (f === id ? null : f));
    playSound("click");
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
    setFocusedId((f) => (f === id ? null : f));
  }, []);

  const toggleMaximize = useCallback(
    (id: string) => {
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
      );
      focus(id);
    },
    [focus]
  );

  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: string, width: number, height: number) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, width, height } : w))
    );
  }, []);

  const taskbarClick = useCallback(
    (id: string) => {
      const w = windows.find((x) => x.id === id);
      if (!w) return;
      if (w.minimized || focusedId !== id) focus(id);
      else minimize(id);
    },
    [windows, focusedId, focus, minimize]
  );

  const api = useMemo(
    () => ({
      windows,
      focusedId,
      open,
      close,
      focus,
      minimize,
      toggleMaximize,
      move,
      resize,
      taskbarClick,
    }),
    [
      windows,
      focusedId,
      open,
      close,
      focus,
      minimize,
      toggleMaximize,
      move,
      resize,
      taskbarClick,
    ]
  );

  return (
    <WindowManagerContext.Provider value={api}>
      {children}
    </WindowManagerContext.Provider>
  );
}
