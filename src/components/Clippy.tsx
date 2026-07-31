"use client";

import { useEffect, useState } from "react";
import { PixelIcon } from "@/system/pixel-icons";

const TIPS = [
  "It looks like you're visiting a homepage. Would you like help pretending it's 1998?",
  "Try right-clicking the desktop. The Refresh button does nothing, beautifully.",
  "The ★ wallpapers in Display Properties are real-time GLSL shaders.",
  "End explorer.exe in the Task Manager. Something nostalgic will happen.",
  "The Music Player performs live code — there are no audio files on this machine.",
  "The penguins in OQ2000 are my friends. Double-click one for awkward small talk.",
  "Stay idle for a while and a screensaver takes over. Just like the good old days.",
  "This assistant is not powered by AI. It is powered by nostalgia.",
];

const DISMISS_KEY = "win98-clippy-dismissed";

export function Clippy() {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    // The summon listener must survive dismissal — Help and CLIPPY.EXE
    // bring the assistant back.
    const onSummon = () => {
      sessionStorage.removeItem(DISMISS_KEY);
      setVisible(true);
    };
    window.addEventListener("win98-summon-clippy", onSummon);
    const id = sessionStorage.getItem(DISMISS_KEY)
      ? null
      : setTimeout(() => setVisible(true), 8000);
    return () => {
      if (id) clearTimeout(id);
      window.removeEventListener("win98-summon-clippy", onSummon);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="clippy">
      <div className="clippy-bubble window">
        <button
          className="clippy-close"
          aria-label="Dismiss assistant"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
        >
          <PixelIcon name="close" size={10} />
        </button>
        <p>{TIPS[tip]}</p>
        <button
          className="clippy-next"
          onClick={() => setTip((t) => (t + 1) % TIPS.length)}
        >
          Next tip
        </button>
      </div>
      <div
        className="clippy-body"
        onClick={() => setTip((t) => (t + 1) % TIPS.length)}
        title="Agent 98"
      >
        <PixelIcon name="clippy" size={48} />
      </div>
    </div>
  );
}
