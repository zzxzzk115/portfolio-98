"use client";

import type { AppDescriptor } from "./types";
import { AboutApp } from "@/apps/AboutApp";
import { CVApp } from "@/apps/CVApp";
import { PublicationsApp } from "@/apps/PublicationsApp";
import { ProjectsApp } from "@/apps/ProjectsApp";
import { GamesApp } from "@/apps/GamesApp";
import { ContactApp } from "@/apps/ContactApp";
import { NotepadApp } from "@/apps/NotepadApp";
import { DisplayApp } from "@/apps/DisplayApp";

export const APPS: AppDescriptor[] = [
  {
    id: "about",
    title: "About Me",
    icon: "computer",
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
    id: "projects",
    title: "Projects",
    icon: "folder",
    component: ProjectsApp,
    defaultSize: { width: 760, height: 620 },
    desktop: true,
    startMenu: true,
    pocket: true,
  },
  {
    id: "games",
    title: "Games",
    icon: "joystick",
    component: GamesApp,
    defaultSize: { width: 760, height: 420 },
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
