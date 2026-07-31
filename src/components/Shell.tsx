"use client";

import { useEffect, useState } from "react";
import { WindowManagerProvider } from "@/system/WindowManager";
import { SettingsProvider } from "@/system/Settings";
import { WidgetsProvider } from "@/system/Widgets";
import { ContentProvider } from "@/system/ContentContext";
import type { SiteContent } from "@/lib/content-types";
import { Desktop } from "./Desktop";
import { PocketShell } from "./PocketShell";
import { playSound } from "@/system/sounds";

type Power = "booting" | "on" | "off" | "bsod";

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
    const onBsod = () => {
      setPower("bsod");
      playSound("error");
    };
    window.addEventListener("win98-bsod", onBsod);
    // The startup chord needs a user gesture (autoplay policy): play it on
    // the first interaction shortly after boot.
    const bootAt = Date.now();
    const onFirstGesture = () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      if (Date.now() - bootAt < 30_000) playSound("startup");
    };
    window.addEventListener("pointerdown", onFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("win98-bsod", onBsod);
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
        <WidgetsProvider>
          <WindowManagerProvider>
            {isPocket ? (
              <PocketShell />
            ) : (
              <Desktop
                onShutdown={() => {
                  playSound("shutdown");
                  setPower("off");
                }}
              />
            )}
            {power === "bsod" ? (
              // Overlay, not a tree swap — open windows survive the crash.
              <div
                className="bsod-screen"
                onClick={() => setPower("on")}
                onKeyDown={() => setPower("on")}
                tabIndex={0}
                ref={(el) => el?.focus()}
              >
                <p className="bsod-title">
                  <span>Windows</span>
                </p>
                <p>
                  A fatal exception 0E has occurred at 0028:C0011E36 in VXD
                  EXPLORER(01) + 00010E36. The current application will be
                  terminated.
                </p>
                <p>
                  * Killing system processes is not covered by the warranty you
                  never had.
                </p>
                <p>* Press any key to return to your desktop unharmed.</p>
                <p className="bsod-continue">Press any key to continue _</p>
              </div>
            ) : null}
          </WindowManagerProvider>
        </WidgetsProvider>
      </SettingsProvider>
    </ContentProvider>
  );
}
