"use client";

import { useEffect, useState } from "react";
import { WindowManagerProvider } from "@/system/WindowManager";
import { SettingsProvider } from "@/system/Settings";
import { ContentProvider } from "@/system/ContentContext";
import type { SiteContent } from "@/lib/content-types";
import { Desktop } from "./Desktop";
import { PocketShell } from "./PocketShell";

type Power = "booting" | "on" | "off";

export function Shell({ content }: { content: SiteContent }) {
  const [power, setPower] = useState<Power>("booting");
  const [isPocket, setIsPocket] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(
      "(max-width: 640px), (pointer: coarse) and (max-width: 900px)"
    );
    const update = () => setIsPocket(mq.matches);
    update();
    mq.addEventListener("change", update);
    // matchMedia change events can be missed while the tab is hidden;
    // re-evaluate on resize as a fallback.
    window.addEventListener("resize", update);
    const bootTimer = setTimeout(() => setPower("on"), 900);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      clearTimeout(bootTimer);
    };
  }, []);

  if (power === "off") {
    return (
      <div className="power-screen" onClick={() => location.reload()}>
        <p className="power-safe">
          It&apos;s now safe to turn off
          <br />
          your computer.
        </p>
        <p className="power-hint">(click anywhere to reboot)</p>
      </div>
    );
  }

  if (power === "booting" || isPocket === null) {
    return (
      <div className="power-screen boot-screen">
        <div className="boot-logo">
          <span className="boot-logo-name">{content.site.osName}</span>
          <div className="boot-bar">
            <div className="boot-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ContentProvider content={content}>
      <SettingsProvider>
        <WindowManagerProvider>
          {isPocket ? (
            <PocketShell />
          ) : (
            <Desktop onShutdown={() => setPower("off")} />
          )}
        </WindowManagerProvider>
      </SettingsProvider>
    </ContentProvider>
  );
}
