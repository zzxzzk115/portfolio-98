"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/profile";
import { PixelIcon } from "@/system/pixel-icons";
import { useWindowManager } from "@/system/WindowManager";
import type { AppDescriptor } from "@/system/types";

const CATEGORY_LABELS: Record<string, string> = {
  work: "Engineering & Research",
  indie: "Indie Games",
  fun: "Just for Fun",
};

const CATEGORY_ICONS: Record<string, string> = {
  work: "flask",
  indie: "joystick",
  fun: "gameboy",
};

export function projectAppDescriptor(project: Project): AppDescriptor {
  return {
    id: `project-${project.slug}`,
    title: project.name,
    icon: CATEGORY_ICONS[project.category] ?? "folder",
    component: function ProjectWindow() {
      return <ProjectPage project={project} />;
    },
    defaultSize: { width: 620, height: 500 },
  };
}

export function ProjectsApp() {
  const wm = useWindowManager();
  const [selected, setSelected] = useState<string | null>(null);

  const categories: Project["category"][] = ["work", "indie", "fun"];

  return (
    <div className="app-body">
      <p className="hint-text">
        Double-click a project to open it. Each one opens in its own window —
        this is a real desktop, after all.
      </p>
      {categories.map((cat) => {
        const items = projects.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        return (
          <fieldset key={cat}>
            <legend>{CATEGORY_LABELS[cat]}</legend>
            <div className="icon-grid">
              {items.map((p) => (
                <button
                  key={p.slug}
                  className={
                    "icon-grid-item" +
                    (selected === p.slug ? " icon-grid-item-selected" : "")
                  }
                  onClick={() => setSelected(p.slug)}
                  onDoubleClick={() => wm.open(projectAppDescriptor(p))}
                  title={p.blurb}
                >
                  <PixelIcon name={CATEGORY_ICONS[cat]} size={32} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

function ProjectEmbed({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false);
  const embed = project.embed;
  if (!embed) return null;

  switch (embed.kind) {
    case "steam":
      return (
        <iframe
          className="embed-widget"
          src={`https://store.steampowered.com/widget/${embed.appId}/`}
          height={190}
          title={`${project.name} on Steam`}
        />
      );
    case "itch":
      return (
        <iframe
          className="embed-widget"
          src={`https://itch.io/embed/${embed.embedId}`}
          height={167}
          title={embed.title}
        >
          <a href={embed.url}>{embed.title}</a>
        </iframe>
      );
    case "youtube":
      return (
        <iframe
          className="embed-video"
          src={`https://www.youtube.com/embed/${embed.videoId}`}
          title={`${project.name} showcase video`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    case "site":
      return playing ? (
        <iframe
          className="embed-site"
          src={embed.url}
          title={project.name}
          allow="fullscreen; gamepad; autoplay"
        />
      ) : (
        <button className="play-button" onClick={() => setPlaying(true)}>
          ▶ Run {project.name} in this window
        </button>
      );
  }
}

export function ProjectPage({ project }: { project: Project }) {
  return (
    <div className="app-body">
      <h1 className="project-title">{project.name}</h1>
      <p className="project-blurb">
        <i>{project.blurb}</i>
      </p>
      <ProjectEmbed project={project} />
      {project.paragraphs.map((p, i) => (
        <div key={i}>
          {p.heading ? <h3 className="project-heading">{p.heading}</h3> : null}
          <p>{p.text}</p>
        </div>
      ))}
      <div className="toolbar-row">
        {project.links.map((l) => (
          <a
            key={l.label}
            className="btn-link"
            href={l.url}
            target="_blank"
            rel="noreferrer"
          >
            <button>{l.label}</button>
          </a>
        ))}
      </div>
    </div>
  );
}
