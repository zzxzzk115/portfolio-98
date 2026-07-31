"use client";

import type { AppDescriptor } from "./types";
import { AboutApp } from "@/apps/AboutApp";
import { CVApp } from "@/apps/CVApp";
import { PublicationsApp } from "@/apps/PublicationsApp";
import { ContactApp } from "@/apps/ContactApp";
import { NotepadApp } from "@/apps/NotepadApp";
import { DisplayApp } from "@/apps/DisplayApp";
import { MusicApp } from "@/apps/MusicApp";
import { TaskManagerApp } from "@/apps/TaskManagerApp";
import { OQ2000App } from "@/apps/OQ2000App";
import { DosApp } from "@/apps/DosApp";
import { explorerAppDescriptor } from "@/apps/ExplorerApp";
import { FindApp } from "@/apps/FindApp";

// Folder shortcuts are Explorer windows pinned to a path.
const shortcut = (
  path: string,
  title: string,
  icon: string
): AppDescriptor => ({
  ...explorerAppDescriptor(path),
  title,
  icon,
  desktop: true,
  startMenu: true,
  pocket: true,
});
import { MinesweeperApp } from "@/apps/MinesweeperApp";
import { IExploreApp } from "@/apps/IExploreApp";

export const APPS: AppDescriptor[] = [
  {
    ...explorerAppDescriptor("C:"),
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "about",
    title: "About Me",
    icon: "user",
    component: AboutApp,
    defaultSize: { width: 700, height: 560 },
    autoFit: true,
    centered: true,
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "cv",
    title: "Curriculum Vitae",
    icon: "document",
    component: CVApp,
    defaultSize: { width: 640, height: 620 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "publications",
    title: "Publications",
    icon: "book",
    component: PublicationsApp,
    defaultSize: { width: 600, height: 440 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "find",
    title: "Find: Files or Folders",
    icon: "search",
    component: FindApp,
    defaultSize: { width: 560, height: 420 },
    desktop: false,
    startMenu: true,
    pocket: true,
  },
  shortcut("C:\\Projects", "Projects", "folder"),
  shortcut("C:\\Games", "Games", "joystick"),
  shortcut("C:\\My Documents", "My Documents", "folder"),
  {
    id: "oq2000",
    title: "OQ2000",
    icon: "penguin",
    component: OQ2000App,
    defaultSize: { width: 300, height: 480 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "dos",
    title: "MS-DOS Prompt",
    icon: "dos",
    component: DosApp,
    defaultSize: { width: 560, height: 380 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "music",
    title: "Music Player",
    icon: "note",
    component: MusicApp,
    defaultSize: { width: 440, height: 620 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    icon: "mine",
    component: MinesweeperApp,
    defaultSize: { width: 330, height: 480 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "iexplore",
    title: "Internet Explorer",
    icon: "globe",
    component: IExploreApp,
    defaultSize: { width: 760, height: 600 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "contact",
    title: "Contact",
    icon: "mail",
    component: ContactApp,
    defaultSize: { width: 460, height: 340 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "readme",
    title: "README.txt",
    icon: "notepad",
    component: NotepadApp,
    defaultSize: { width: 480, height: 420 },
    desktop: true,
    startMenu: false,
    pocket: true,
  },
  {
    id: "taskmgr",
    title: "Task Manager",
    icon: "taskmgr",
    component: TaskManagerApp,
    defaultSize: { width: 420, height: 480 },
    desktop: false,
    startMenu: true,
    pocket: true,
  },
  {
    id: "display",
    title: "Display Properties",
    icon: "display",
    component: DisplayApp,
    defaultSize: { width: 400, height: 520 },
    desktop: false,
    startMenu: true,
    pocket: true,
  },
];
