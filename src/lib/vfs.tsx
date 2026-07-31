"use client";

// The virtual file system: one tree that unifies all site content.
// Explorer browses it, MS-DOS walks it, both open the same windows.

import type { SiteContent } from "@/lib/content-types";
import type { AppDescriptor } from "@/system/types";
import { asset } from "@/system/types";
import { projectAppDescriptor } from "@/apps/ProjectsApp";
import { postAppDescriptor } from "@/apps/DocumentsApp";
import { lazy100Player } from "@/apps/GamesApp";
import { playSound } from "@/system/sounds";
// Module cycle note: vfs → registry → ExplorerApp → vfs is safe because
// APPS / explorerAppDescriptor are only touched at runtime (inside
// buildVfs / open callbacks), never during module evaluation.
import { APPS } from "@/system/registry";
import { explorerAppDescriptor } from "@/apps/ExplorerApp";

// Minimal wm surface the VFS needs (avoids importing the full context type).
export interface VfsWm {
  open: (app: AppDescriptor) => void;
}

export interface VfsNode {
  name: string;
  path: string; // "C:\Projects\Lazy-100"
  kind: "drive" | "folder" | "file";
  icon: string;
  thumb?: string;
  typeName: string;
  sizeKB?: number;
  modified: string;
  text?: string; // content readable via DOS `type` / notepad
  children?: VfsNode[];
  open?: (wm: VfsWm) => void;
}

const DATE = "07-31-26";

function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 99991;
  return h;
}

function errorDialogDescriptor(fileName: string): AppDescriptor {
  return {
    id: `err-${fileName}`,
    title: fileName,
    icon: "close",
    component: function ErrDialog() {
      return (
        <div className="app-body vfs-error-dialog">
          <p>
            <b>{fileName}</b> is not a valid Win32 application.
          </p>
          <p className="hint-text">
            (It never was. It never will be. Let it rest.)
          </p>
        </div>
      );
    },
    defaultSize: { width: 320, height: 150 },
  };
}

function textFileDescriptor(name: string, text: string): AppDescriptor {
  return {
    id: `txt-${name}`,
    title: `${name} - Notepad`,
    icon: "notepad",
    component: function TextWindow() {
      return (
        <div className="app-body app-body-fill">
          <pre className="notepad-text">{text}</pre>
        </div>
      );
    },
    defaultSize: { width: 460, height: 380 },
  };
}

const AUTOEXEC = `@ECHO OFF
PATH=C:\\WINDOWS;C:\\WINDOWS\\COMMAND
SET BLASTER=A220 I5 D1 T4
SET VIBE=RETRO
LH C:\\WINDOWS\\COMMAND\\MSCDEX.EXE /D:LAZYCD01
REM If you can read this, you type too fast.
`;

const CONFIGSYS = `DEVICE=C:\\WINDOWS\\HIMEM.SYS
DEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS
DOS=HIGH,UMB
FILES=42
BUFFERS=30
STACKS=9,256
REM 640K ought to be enough for this website.
`;

let cachedRoot: VfsNode | null = null;
let cachedContent: SiteContent | null = null;

export function buildVfs(content: SiteContent): VfsNode {
  if (cachedRoot && cachedContent === content) return cachedRoot;

  const file = (
    parent: string,
    name: string,
    partial: Partial<VfsNode> & Pick<VfsNode, "icon" | "typeName">
  ): VfsNode => ({
    name,
    path: `${parent}\\${name}`,
    kind: "file",
    modified: DATE,
    sizeKB: 1 + (hashOf(name) % 240),
    ...partial,
  });

  const folder = (
    parent: string,
    name: string,
    children: (path: string) => VfsNode[],
    icon = "folder"
  ): VfsNode => {
    const path = `${parent}\\${name}`;
    return {
      name,
      path,
      kind: "folder",
      icon,
      typeName: "File Folder",
      modified: DATE,
      children: children(path),
    };
  };

  const C = "C:";

  const myDocuments = folder(C, "My Documents", (p) =>
    content.posts.map((post) =>
      file(p, `${post.slug}.txt`, {
        icon: "notepad",
        typeName: "Text Document",
        sizeKB: Math.max(1, Math.round(post.body.length / 1024)),
        modified: post.date || DATE,
        text: post.body,
        open: (wm) => wm.open(postAppDescriptor(post)),
      })
    )
  );

  const projects = folder(C, "Projects", (p) =>
    content.projects.map((proj) =>
      file(p, proj.meta.name, {
        icon: "flask",
        thumb: proj.meta.img,
        typeName: "Project",
        sizeKB: 64 + (hashOf(proj.meta.slug) % 4000),
        text: proj.meta.blurb,
        open: (wm) => wm.open(projectAppDescriptor(proj)),
      })
    )
  );

  const games = folder(C, "Games", (p) => [
    file(p, "Lazy-100.exe", {
      icon: "joystick",
      typeName: "Application",
      sizeKB: 1998,
      open: (wm) => wm.open(lazy100Player),
    }),
    ...content.projects
      .filter((x) =>
        ["cells-of-division", "gold-miner-rebirth", "catmario-gb"].includes(
          x.meta.slug
        )
      )
      .map((proj) =>
        file(p, `${proj.meta.slug}.exe`, {
          icon: "gameboy",
          thumb: proj.meta.img,
          typeName: "Application",
          sizeKB: 256 + (hashOf(proj.meta.slug) % 2000),
          open: (wm) => wm.open(projectAppDescriptor(proj)),
        })
      ),
  ]);

  const publications = folder(C, "Publications", (p) =>
    content.publications.map((pub) =>
      file(p, `${pub.meta.id}.pdf`, {
        icon: "book",
        typeName: "PDF Document",
        sizeKB: 3050,
        open: () => {
          if (pub.meta.pdf) window.open(asset(pub.meta.pdf), "_blank");
        },
      })
    )
  );

  const music = folder(C, "Music", (p) =>
    content.music.map((t) =>
      file(p, `${t.id}.strudel`, {
        icon: "note",
        typeName: "Strudel Pattern",
        sizeKB: Math.max(1, Math.round(t.code.length / 1024)),
        text: t.code,
        open: (wm) => {
          const app = APPS.find((a) => a.id === "music");
          if (app) wm.open(app);
        },
      })
    )
  );

  const programFiles = folder(C, "Program Files", (p) =>
    APPS.filter((a) => !a.id.startsWith("explorer-")).map((app) =>
      file(p, `${app.id}.exe`, {
        icon: app.icon,
        typeName: "Application",
        sizeKB: 128 + (hashOf(app.id) % 3000),
        open: (wm) => wm.open(app),
      })
    )
  );

  const windowsDir = folder(C, "Windows", (p) => [
    file(p, "EXPLORER.EXE", {
      icon: "computer",
      typeName: "Application",
      sizeKB: 204,
      open: (wm) => wm.open(explorerAppDescriptor("C:")),
    }),
    file(p, "CLIPPY.EXE", {
      icon: "clippy",
      typeName: "Application",
      sizeKB: 98,
      open: () =>
        window.dispatchEvent(new CustomEvent("win98-summon-clippy")),
    }),
    file(p, "BLUESCRN.SCR", {
      icon: "display",
      typeName: "Screen Saver",
      sizeKB: 14,
      open: () => window.dispatchEvent(new CustomEvent("win98-bsod")),
    }),
    ...["VULKAN32.DLL", "RASTER.DLL", "USER98.DLL", "FOVEA.DLL", "WARP16.DLL"].map(
      (dll) =>
        file(p, dll, {
          icon: "gear",
          typeName: "Application Extension",
          open: (wm) => {
            playSound("error");
            wm.open(errorDialogDescriptor(dll));
          },
        })
    ),
  ]);

  const rootFiles: VfsNode[] = [
    file(C, "README.txt", {
      icon: "notepad",
      typeName: "Text Document",
      sizeKB: Math.max(1, Math.round(content.readmeText.length / 1024)),
      text: content.readmeText,
      open: (wm) => wm.open(textFileDescriptor("README.txt", content.readmeText)),
    }),
    file(C, "AUTOEXEC.BAT", {
      icon: "dos",
      typeName: "MS-DOS Batch File",
      sizeKB: 1,
      text: AUTOEXEC,
      open: (wm) => wm.open(textFileDescriptor("AUTOEXEC.BAT", AUTOEXEC)),
    }),
    file(C, "CONFIG.SYS", {
      icon: "gear",
      typeName: "System File",
      sizeKB: 1,
      text: CONFIGSYS,
      open: (wm) => wm.open(textFileDescriptor("CONFIG.SYS", CONFIGSYS)),
    }),
  ];

  cachedRoot = {
    name: "C:",
    path: "C:",
    kind: "drive",
    icon: "drive",
    typeName: "Local Disk",
    modified: DATE,
    children: [
      myDocuments,
      projects,
      games,
      publications,
      music,
      programFiles,
      windowsDir,
      ...rootFiles,
    ],
  };
  cachedContent = content;
  return cachedRoot;
}

// Case-insensitive path resolution. Accepts "C:\Projects", "\Projects",
// relative segments and "..".
export function findNode(
  root: VfsNode,
  rawPath: string,
  cwd?: string
): VfsNode | null {
  let path = rawPath.trim().replace(/\//g, "\\");
  if (path === "" || path.toUpperCase() === "C:" || path === "\\") return root;
  if (/^c:/i.test(path)) path = path.slice(2);
  else if (!path.startsWith("\\") && cwd) {
    path = `${cwd.replace(/^c:/i, "")}\\${path}`;
  }
  const segments = path.split("\\").filter(Boolean);
  let node: VfsNode = root;
  const stack: VfsNode[] = [];
  for (const seg of segments) {
    if (seg === ".") continue;
    if (seg === "..") {
      node = stack.pop() ?? root;
      continue;
    }
    const next = node.children?.find(
      (c) => c.name.toLowerCase() === seg.toLowerCase()
    );
    if (!next) return null;
    stack.push(node);
    node = next;
  }
  return node;
}

export function totalSizeKB(node: VfsNode): number {
  if (node.kind === "file") return node.sizeKB ?? 0;
  return (node.children ?? []).reduce((sum, c) => sum + totalSizeKB(c), 0);
}
