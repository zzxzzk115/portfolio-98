"use client";

// One context-menu host for the whole desktop: any component calls
// showMenu(x, y, items) and the single menu instance renders on top.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ContextMenu, type MenuItem } from "@/components/ContextMenu";

interface MenuApi {
  showMenu: (x: number, y: number, items: MenuItem[]) => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuApi | null>(null);

export function useMenu(): MenuApi {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu outside provider");
  return ctx;
}

export function MenuHost({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    items: MenuItem[];
  } | null>(null);

  const showMenu = useCallback(
    (x: number, y: number, items: MenuItem[]) => setMenu({ x, y, items }),
    []
  );
  const closeMenu = useCallback(() => setMenu(null), []);

  const api = useMemo(() => ({ showMenu, closeMenu }), [showMenu, closeMenu]);

  return (
    <MenuContext.Provider value={api}>
      {children}
      {menu ? (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={closeMenu}
        />
      ) : null}
    </MenuContext.Provider>
  );
}
