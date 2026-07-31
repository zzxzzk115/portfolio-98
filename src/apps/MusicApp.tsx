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
  getAnalyzerData?: (
    type: "time" | "frequency",
    id?: string | number
  ) => Float32Array;
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
      const api: StrudelApi = {
        evaluate: mod.evaluate,
        hush: mod.hush,
        getAnalyzerData: mod.getAnalyzerData,
      };
      strudelApiSync = api;
      return api;
    })();
  }
  return strudelInit;
}

// Winamp-style spectrum bars fed by strudel's built-in analyser (patterns
// get `.analyze()` appended on play). Falls back to idle bars when silent.
function Spectrum({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    let raf = 0;
    const BARS = 20;
    const levels = new Array(BARS).fill(0);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const w = canvas.width;
      const h = canvas.height;
      ctx2d.fillStyle = "#0a1a0a";
      ctx2d.fillRect(0, 0, w, h);
      let data: Float32Array | null = null;
      if (playing) {
        try {
          // getAnalyzerData is synchronous once init resolved
          data = strudelApiSync?.getAnalyzerData?.("frequency", "p98") ?? null;
        } catch {
          data = null;
        }
      }
      const barW = w / BARS;
      for (let i = 0; i < BARS; i++) {
        let target = 0;
        if (data && data.length) {
          // dB values (-150..0) → 0..1, sample log-ish across the low half
          const idx = Math.floor((i / BARS) * data.length * 0.5);
          const db = data[idx];
          if (isFinite(db)) target = Math.max(0, (db + 100) / 70);
        }
        levels[i] = Math.max(target, levels[i] * 0.82);
        const bh = Math.min(1, levels[i]) * (h - 2);
        ctx2d.fillStyle = "#39ff5a";
        ctx2d.fillRect(i * barW + 1, h - bh, barW - 2, bh);
        ctx2d.fillStyle = "#0f5a1f";
        ctx2d.fillRect(i * barW + 1, 0, barW - 2, h - bh);
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return <canvas ref={canvasRef} width={300} height={40} className="music-spectrum" />;
}

// Synchronous handle for the analyser once init completes.
let strudelApiSync: StrudelApi | null = null;

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
      try {
        // Feed the spectrum: tap the pattern through strudel's analyser.
        await strudel.evaluate(`${t.code}\n  .analyze("p98")`);
      } catch {
        // Pattern shape didn't allow chaining — play it plain.
        await strudel.evaluate(t.code);
      }
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
        <Spectrum playing={state === "playing"} />
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
