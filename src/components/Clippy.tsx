"use client";

import { useEffect, useState } from "react";
import { PixelIcon } from "@/system/pixel-icons";

const TIPS = [
  "It looks like you're visiting a homepage. Would you like help pretending it's 1998?",
  "双击桌面图标可以打开 App。你肯定还记得双击。",
  "Try right-clicking the desktop. The Refresh button does nothing, beautifully.",
  "The ★ wallpapers are hand-written GLSL shaders. 图形学博士的排面。",
  "在 Task Manager 里结束 explorer.exe,会发生一些怀旧的事情。",
  "Open MS-DOS Prompt and type DIR. Old habits compile fast.",
  "音乐播放器里的曲子是 Strudel 代码现场演奏的,不是音频文件。",
  "OQ2000 里住着我的友链。双击企鹅可以尬聊。",
  "Idle for a while and the screensaver kicks in. I wrote it a raymarcher.",
  "This assistant is not powered by AI. It is powered by nostalgia.",
];

const DISMISS_KEY = "win98-clippy-dismissed";

export function Clippy() {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const id = setTimeout(() => setVisible(true), 8000);
    const onSummon = () => {
      sessionStorage.removeItem(DISMISS_KEY);
      setVisible(true);
    };
    window.addEventListener("win98-summon-clippy", onSummon);
    return () => {
      clearTimeout(id);
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
          ×
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
