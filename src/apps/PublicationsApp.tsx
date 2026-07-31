"use client";

import { useState } from "react";
import { useContent } from "@/system/ContentContext";
import { Markdown } from "@/components/Markdown";
import { PixelIcon } from "@/system/pixel-icons";
import { asset } from "@/system/types";

function IconButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a className="btn-link" href={href} target="_blank" rel="noreferrer">
      <button className="btn-with-icon">
        <PixelIcon name={icon} size={14} />
        <span>{label}</span>
      </button>
    </a>
  );
}

export function PublicationsApp() {
  const { publications } = useContent();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="app-body">
      {publications.map(({ meta, body }) => {
        const githubUrl = meta.github
          ? meta.github.startsWith("http")
            ? meta.github
            : `https://github.com/${meta.github}`
          : null;
        return (
          <fieldset key={meta.id} className="pub-entry">
            <legend>{meta.year}</legend>
            <div className="pub-row">
              {meta.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="pub-preview"
                  src={asset(meta.preview)}
                  alt={meta.venue}
                  loading="lazy"
                />
              ) : null}
              <div className="pub-main">
                <b>{meta.title}</b>
                <p className="pub-authors">{meta.authors}</p>
                <p className="pub-venue">
                  <i>{meta.venue}</i>
                  {meta.doi ? <> · DOI: {meta.doi}</> : null}
                </p>
              </div>
            </div>
            <div className="toolbar-row">
              {meta.pdf ? (
                <IconButton href={asset(meta.pdf)} icon="document" label="PDF" />
              ) : null}
              {meta.projectPage ? (
                <IconButton
                  href={meta.projectPage}
                  icon="globe"
                  label="Project Page"
                />
              ) : null}
              {githubUrl ? (
                <IconButton href={githubUrl} icon="github" label="Code" />
              ) : null}
              {meta.links.map((e) => (
                <IconButton
                  key={e.label}
                  href={e.url}
                  icon={e.icon ?? "globe"}
                  label={e.label}
                />
              ))}
              {body ? (
                <button
                  onClick={() =>
                    setExpanded(expanded === meta.id ? null : meta.id)
                  }
                >
                  {expanded === meta.id ? "Hide abstract" : "Abstract"}
                </button>
              ) : null}
            </div>
            {expanded === meta.id ? (
              <div className="sunken-panel pub-abstract">
                {meta.teaser ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="pub-teaser"
                    src={asset(meta.teaser)}
                    alt={`${meta.title} teaser`}
                    loading="lazy"
                  />
                ) : null}
                <Markdown>{body}</Markdown>
              </div>
            ) : null}
          </fieldset>
        );
      })}
    </div>
  );
}
