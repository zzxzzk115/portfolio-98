"use client";

import { useEffect, useRef, useState } from "react";
import { APPS } from "@/system/registry";
import { useWindowManager } from "@/system/WindowManager";
import { useContent } from "@/system/ContentContext";
import { buildVfs, findNode, type VfsNode } from "@/lib/vfs";

interface Line {
  text: string;
}

export function DosApp({ windowId }: { windowId: string }) {
  const wm = useWindowManager();
  const content = useContent();
  const { site } = content;
  const root = buildVfs(content);
  const [cwd, setCwd] = useState("C:");
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
    print(`${cwd}\\> ${cmd}`);
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHistPos(-1);

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");

    switch (head.toLowerCase()) {
      case "help":
        print(
          "  HELP            this text",
          "  DIR             list current directory",
          "  CD <dir>        change directory (CD .. to go up)",
          "  TYPE <file>     print a text file",
          "  TREE            draw the directory tree",
          "  START <name>    open a file or program (path or app id)",
          "  VER             show version",
          "  WHOAMI          about the owner of this machine",
          "  ECHO <text>     echo text",
          "  CLS             clear screen",
          "  EXIT            close this window",
          ""
        );
        break;
      case "dir": {
        const node = findNode(root, arg || cwd, cwd);
        if (!node || node.kind === "file") {
          print("Invalid directory.", "");
          break;
        }
        print(` Directory of ${node.path}`, "");
        const kids = node.children ?? [];
        kids.forEach((c) =>
          print(
            c.kind === "file"
              ? `  ${c.name.padEnd(28)}${String(c.sizeKB ?? 0).padStart(8)} KB`
              : `  ${c.name.padEnd(28)}   <DIR>`
          )
        );
        const files = kids.filter((c) => c.kind === "file");
        print(
          "",
          `        ${files.length} file(s), ${kids.length - files.length} dir(s)`,
          ""
        );
        break;
      }
      case "cd": {
        if (!arg) {
          print(cwd, "");
          break;
        }
        const node = findNode(root, arg, cwd);
        if (!node || node.kind === "file") {
          print("Invalid directory.", "");
        } else {
          setCwd(node.path);
          print("");
        }
        break;
      }
      case "type": {
        const node = findNode(root, arg, cwd);
        if (!node || node.kind !== "file") {
          print(`File not found: ${arg}`, "");
        } else if (!node.text) {
          print(`Cannot display ${node.name} — not a text file.`, "");
        } else {
          node.text.split("\n").forEach((l) => print(l));
          print("");
        }
        break;
      }
      case "tree": {
        const start = findNode(root, arg || cwd, cwd) ?? root;
        print(start.path);
        const walk = (n: VfsNode, prefix: string) => {
          const kids = n.children ?? [];
          kids.forEach((c, i) => {
            const last = i === kids.length - 1;
            print(`${prefix}${last ? "\\--" : "+--"}${c.name}`);
            if (c.kind !== "file") {
              walk(c, prefix + (last ? "   " : "|  "));
            }
          });
        };
        walk(start, "");
        print("");
        break;
      }
      case "start": {
        // App id / title first, then VFS path.
        const app = APPS.find(
          (a) =>
            a.id === arg.toLowerCase() ||
            a.title.toLowerCase() === arg.toLowerCase()
        );
        if (app) {
          wm.open(app);
          print(`Starting ${app.title}...`, "");
          break;
        }
        const node = findNode(root, arg, cwd);
        if (node?.kind === "file" && node.open) {
          node.open(wm);
          print(`Starting ${node.name}...`, "");
        } else if (node && node.kind !== "file") {
          print(`${node.path} is a directory. Use CD.`, "");
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
          <span>{cwd}\&gt;&nbsp;</span>
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
