"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/system/ContentContext";
import type { MusicTrack } from "@/lib/content-types";

// Strudel is loaded lazily on first play (the audio engine is ~800KB) and
// initialized exactly once per page — a second initStrudel would spawn a
// second scheduler.
interface StrudelApi {
  evaluate: (code: string) => Promise<unknown>;
  hush: () => void;
}

let strudelInit: Promise<StrudelApi> | null = null;

function getStrudel(): Promise<StrudelApi> {
  if (!strudelInit) {
    strudelInit = (async () => {
      const mod = await import("@strudel/web");
      await mod.initStrudel({
        prebake: async () => {
          // Drum machine samples (bd/sd/hh...) — loaded from the network;
          // synth sounds still work if this fails offline.
          try {
            await mod.samples("github:tidalcycles/dirt-samples");
          } catch {
            // offline: synth-only
          }
        },
      });
      return { evaluate: mod.evaluate, hush: mod.hush };
    })();
  }
  return strudelInit;
}

type PlayState = "stopped" | "loading" | "playing" | "error";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function MusicApp() {
  const { music } = useContent();
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<PlayState>("stopped");
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const playingRef = useRef(false);

  const track: MusicTrack | undefined = music[index];

  useEffect(() => {
    if (state !== "playing") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  // Stop the music when the window closes.
  useEffect(() => {
    return () => {
      if (playingRef.current) {
        getStrudel().then((s) => s.hush());
      }
    };
  }, []);

  const play = async (i: number = index) => {
    const t = music[i];
    if (!t) return;
    setIndex(i);
    setState("loading");
    setErrorMsg("");
    try {
      const strudel = await getStrudel();
      strudel.hush();
      await strudel.evaluate(t.code);
      playingRef.current = true;
      setElapsed(0);
      setState("playing");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const stop = async () => {
    if (playingRef.current) {
      const strudel = await getStrudel();
      strudel.hush();
      playingRef.current = false;
    }
    setState("stopped");
  };

  const step = (dir: 1 | -1) => {
    if (music.length === 0) return;
    const next = (index + dir + music.length) % music.length;
    if (state === "playing" || state === "loading") play(next);
    else setIndex(next);
  };

  const statusText =
    state === "playing"
      ? "▶ PLAYING"
      : state === "loading"
        ? "⏳ TUNING..."
        : state === "error"
          ? "✖ ERROR"
          : "■ STOPPED";

  return (
    <div className="app-body app-body-fill music-player">
      <div className="music-lcd">
        <div className="music-lcd-title">
          <span className={state === "playing" ? "music-marquee" : ""}>
            {track ? `${track.title} — ${track.artist}` : "no tracks"}
          </span>
        </div>
        <div className="music-lcd-row">
          <span>{statusText}</span>
          <span>{formatTime(elapsed)}</span>
        </div>
        {state === "error" ? (
          <div className="music-lcd-error">{errorMsg}</div>
        ) : null}
      </div>

      <div className="music-controls">
        <button onClick={() => step(-1)} title="Previous">
          ⏮
        </button>
        <button
          onClick={() => play()}
          disabled={state === "loading"}
          title="Play"
        >
          ▶
        </button>
        <button onClick={stop} title="Stop">
          ⏹
        </button>
        <button onClick={() => step(1)} title="Next">
          ⏭
        </button>
      </div>

      <div className="wallpaper-listbox music-playlist" role="listbox">
        {music.map((t, i) => (
          <div
            key={t.id}
            role="option"
            aria-selected={i === index}
            className={
              "wallpaper-listbox-item" +
              (i === index ? " wallpaper-listbox-item-selected" : "")
            }
            onClick={() => setIndex(i)}
            onDoubleClick={() => play(i)}
          >
            <span className="music-tracknum">{i + 1}.</span>
            {t.title}
            <span className="music-artist">{t.artist}</span>
          </div>
        ))}
      </div>

      <pre className="music-code">{track?.code ?? ""}</pre>

      <p className="hint-text music-hint">
        Live-coded with{" "}
        <a href="https://strudel.cc" target="_blank" rel="noreferrer">
          Strudel
        </a>
        . First play loads the audio engine; drum samples need the network.
        Double-click a track to play it.
      </p>
    </div>
  );
}
