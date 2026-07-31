"use client";

import { useEffect, useState } from "react";
import { playSound, stopModem } from "@/system/sounds";

const HOME = "https://zzxzzk115.github.io/";

const BOOKMARKS = [
  { label: "Academic Home", url: "https://zzxzzk115.github.io/" },
  { label: "Lazy-100", url: "https://zzxzzk115.github.io/Lazy-100/" },
  { label: "VRI Docs", url: "https://zzxzzk115.github.io/VRI/" },
];

function normalize(url: string): string {
  const t = url.trim();
  if (!t) return HOME;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

const DIAL_KEY = "win98-dialed-up";
const DIAL_STEPS = [
  "Dialing 0113 555 0198...",
  "Verifying username and password...",
  "Registering your computer on the network...",
  "Connected at 56,000 bps!",
];

function DialUp({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    playSound("modem");
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= DIAL_STEPS.length - 1) {
          clearInterval(id);
          setTimeout(onDone, 700);
          return s;
        }
        return s + 1;
      });
    }, 900);
    return () => {
      clearInterval(id);
      stopModem();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dialup">
      <div className="window dialup-dialog">
        <div className="title-bar">
          <div className="title-bar-text">Dial-up Networking</div>
        </div>
        <div className="window-body dialup-body">
          <p>Connecting to Leeds Campus ISP…</p>
          <p className="dialup-step">{DIAL_STEPS[step]}</p>
          <div className="boot-bar dialup-bar">
            <div className="boot-bar-fill" />
          </div>
          <div className="toolbar-row toolbar-row-right">
            <button onClick={onDone}>Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IExploreApp() {
  const [dialing, setDialing] = useState(
    () =>
      typeof window !== "undefined" &&
      !sessionStorage.getItem(DIAL_KEY)
  );
  const [history, setHistory] = useState<string[]>([HOME]);
  const [pos, setPos] = useState(0);
  const [address, setAddress] = useState(HOME);
  // Bump to force-reload the iframe on Refresh.
  const [reloadKey, setReloadKey] = useState(0);

  const current = history[pos];

  const navigate = (url: string) => {
    const target = normalize(url);
    setHistory((h) => [...h.slice(0, pos + 1), target]);
    setPos((p) => p + 1);
    setAddress(target);
  };

  const go = (dir: 1 | -1) => {
    const next = pos + dir;
    if (next < 0 || next >= history.length) return;
    setPos(next);
    setAddress(history[next]);
  };

  if (dialing) {
    return (
      <div className="app-body app-body-fill ie-app">
        <DialUp
          onDone={() => {
            sessionStorage.setItem(DIAL_KEY, "1");
            stopModem();
            setDialing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="app-body app-body-fill ie-app">
      <div className="ie-toolbar">
        <button onClick={() => go(-1)} disabled={pos === 0} title="Back">
          ◀
        </button>
        <button
          onClick={() => go(1)}
          disabled={pos >= history.length - 1}
          title="Forward"
        >
          ▶
        </button>
        <button onClick={() => setReloadKey((k) => k + 1)} title="Refresh">
          ⟳
        </button>
        <input
          className="ie-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(address);
          }}
          spellCheck={false}
        />
        <button onClick={() => navigate(address)}>Go</button>
      </div>
      <div className="ie-toolbar ie-bookmarks">
        <span className="ie-links-label">Links:</span>
        {BOOKMARKS.map((b) => (
          <button key={b.url} onClick={() => navigate(b.url)}>
            {b.label}
          </button>
        ))}
      </div>
      <iframe
        key={`${current}-${reloadKey}`}
        className="fill-frame"
        src={current}
        title="Internet Explorer"
      />
      <p className="hint-text ie-hint">
        Some sites refuse to be framed (X-Frame-Options) and will stay blank —
        the Links above are known to work.
      </p>
    </div>
  );
}
