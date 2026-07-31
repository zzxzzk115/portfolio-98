"use client";

import { useEffect, useRef, useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useContent } from "@/system/ContentContext";

interface Line {
  text: string;
}

export function DosApp({ windowId }: { windowId: string }) {
  const wm = useWindowManager();
  const { site } = useContent();
  const [lines, setLines] = useState<Line[]>([
    { text: `${site.osName} [Version 4.10.1998]` },
    { text: "(C) Kexuan Zhang. Type HELP for available commands." },
    { text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const print = (...texts: string[]) =>
    setLines((l) => [...l, ...texts.map((text) => ({ text }))]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    print(`C:\\> ${cmd}`);
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHistPos(-1);

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");

    switch (head.toLowerCase()) {
      case "help":
        print(
          "  HELP            this text",
          "  DIR             list installed programs",
          "  START <name>    launch a program (e.g. START music)",
          "  VER             show version",
          "  WHOAMI          about the owner of this machine",
          "  ECHO <text>     echo text",
          "  CLS             clear screen",
          "  EXIT            close this window",
          ""
        );
        break;
      case "dir": {
        print(" Directory of C:\\PROGRAMS", "");
        APPS.forEach((a) =>
          print(
            `  ${a.id.toUpperCase().padEnd(14)}<APP>    ${a.title}`
          )
        );
        print("", `        ${APPS.length} program(s)`, "");
        break;
      }
      case "start": {
        const app = APPS.find(
          (a) => a.id === arg.toLowerCase() || a.title.toLowerCase() === arg.toLowerCase()
        );
        if (app) {
          wm.open(app);
          print(`Starting ${app.title}...`, "");
        } else {
          print(`Bad command or file name: ${arg}`, "Try DIR for a list.", "");
        }
        break;
      }
      case "ver":
        print(`${site.osName} [Version 4.10.1998]`, "");
        break;
      case "whoami":
        print(
          `${site.name} (${site.handle}) — ${site.title}, ${site.affiliation}.`,
          "Builds renderers, engines, and questionable retro websites.",
          ""
        );
        break;
      case "echo":
        print(arg || "ECHO is on.", "");
        break;
      case "cls":
        setLines([]);
        break;
      case "exit":
        wm.close(windowId);
        break;
      case "format":
        if (arg.toLowerCase().startsWith("c:")) {
          print("WARNING: ALL DATA ON DRIVE C: WILL BE LOST!", "Formatting...");
          setTimeout(
            () => window.dispatchEvent(new CustomEvent("win98-bsod")),
            900
          );
        } else {
          print("Specify a drive. You know which one.", "");
        }
        break;
      default:
        print(`Bad command or file name: ${head}`, "");
    }
  };

  return (
    <div
      className="app-body app-body-fill dos-app"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="dos-screen" ref={scrollRef}>
        {lines.map((l, i) => (
          <div key={i} className="dos-line">
            {l.text || "\u00a0"}
          </div>
        ))}
        <div className="dos-prompt-row">
          <span>C:\&gt;&nbsp;</span>
          <input
            ref={inputRef}
            className="dos-input"
            value={input}
            autoFocus
            spellCheck={false}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(input);
                setInput("");
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const next = Math.min(histPos + 1, history.length - 1);
                if (history[next]) {
                  setHistPos(next);
                  setInput(history[next]);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = histPos - 1;
                setHistPos(next);
                setInput(next >= 0 ? history[next] : "");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
