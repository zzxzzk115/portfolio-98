"use client";

import { useState } from "react";

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

export function IExploreApp() {
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
