"use client";

import { useState } from "react";
import type { ProjectContent, ProjectCategory } from "@/lib/content-types";
import { useContent } from "@/system/ContentContext";
import { PixelIcon } from "@/system/pixel-icons";
import { useWindowManager } from "@/system/WindowManager";
import { Markdown } from "@/components/Markdown";
import { asset, type AppDescriptor } from "@/system/types";

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  work: "Engineering & Research",
  indie: "Indie Games",
  fun: "Just for Fun",
};

const CATEGORY_ICONS: Record<ProjectCategory, string> = {
  work: "flask",
  indie: "joystick",
  fun: "gameboy",
};

export function projectAppDescriptor(project: ProjectContent): AppDescriptor {
  return {
    id: `project-${project.meta.slug}`,
    title: project.meta.name,
    icon: CATEGORY_ICONS[project.meta.category] ?? "folder",
    component: function ProjectWindow() {
      return <ProjectPage project={project} />;
    },
    defaultSize: { width: 620, height: 500 },
  };
}

export function ProjectsApp() {
  const { projects } = useContent();
  const wm = useWindowManager();
  const [selected, setSelected] = useState<string | null>(null);

  const categories: ProjectCategory[] = ["work", "indie", "fun"];

  return (
    <div className="app-body">
      {categories.map((cat) => {
        const items = projects.filter((p) => p.meta.category === cat);
        if (items.length === 0) return null;
        return (
          <fieldset key={cat}>
            <legend>{CATEGORY_LABELS[cat]}</legend>
            <div className="icon-grid">
              {items.map((p) => (
                <button
                  key={p.meta.slug}
                  className={
                    "icon-grid-item project-card" +
                    (selected === p.meta.slug ? " icon-grid-item-selected" : "")
                  }
                  onClick={() => setSelected(p.meta.slug)}
                  onDoubleClick={() => wm.open(projectAppDescriptor(p))}
                  title={p.meta.blurb}
                >
                  <ProjectThumb project={p} icon={CATEGORY_ICONS[cat]} />
                  <span>{p.meta.name}</span>
                </button>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export function ProjectThumb({
  project,
  icon,
}: {
  project: ProjectContent;
  icon: string;
}) {
  if (!project.meta.img) {
    return <PixelIcon name={icon} size={32} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="project-thumb"
      src={asset(project.meta.img)}
      alt={project.meta.name}
      loading="lazy"
    />
  );
}

function ProjectEmbed({ project }: { project: ProjectContent }) {
  const [playing, setPlaying] = useState(false);
  const embed = project.meta.embed;
  if (!embed) return null;

  switch (embed.kind) {
    case "steam":
      return (
        <iframe
          className="embed-widget"
          src={`https://store.steampowered.com/widget/${embed.appId}/`}
          height={190}
          title={`${project.meta.name} on Steam`}
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
          title={`${project.meta.name} showcase video`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    case "site":
      return playing ? (
        <iframe
          className="embed-site"
          src={embed.url}
          title={project.meta.name}
          allow="fullscreen; gamepad; autoplay"
        />
      ) : (
        <button className="play-button" onClick={() => setPlaying(true)}>
          ▶ Run {project.meta.name} in this window
        </button>
      );
  }
}

export function ProjectPage({ project }: { project: ProjectContent }) {
  return (
    <div className="app-body">
      <h1 className="project-title">{project.meta.name}</h1>
      <p className="project-blurb">
        <i>{project.meta.blurb}</i>
      </p>
      <ProjectEmbed project={project} />
      <Markdown>{project.body}</Markdown>
      <div className="toolbar-row">
        {project.meta.links.map((l) => (
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
