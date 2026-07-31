"use client";

import { useState } from "react";
import { useContent } from "@/system/ContentContext";
import { Markdown } from "@/components/Markdown";
import { asset } from "@/system/types";

export function PublicationsApp() {
  const { publications } = useContent();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="app-body">
      <p className="hint-text">
        Peer-reviewed publications. More coming as the PhD progresses — watch
        this space.
      </p>
      {publications.map(({ meta, body }) => (
        <fieldset key={meta.id} className="pub-entry">
          <legend>{meta.year}</legend>
          <b>{meta.title}</b>
          <p className="pub-authors">{meta.authors}</p>
          <p className="pub-venue">
            <i>{meta.venue}</i>
            {meta.doi ? <> · DOI: {meta.doi}</> : null}
          </p>
          <div className="toolbar-row">
            {meta.pdf ? (
              <a
                className="btn-link"
                href={asset(meta.pdf)}
                target="_blank"
                rel="noreferrer"
              >
                <button>PDF</button>
              </a>
            ) : null}
            {meta.links.map((e) => (
              <a
                key={e.label}
                className="btn-link"
                href={e.url}
                target="_blank"
                rel="noreferrer"
              >
                <button>{e.label}</button>
              </a>
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
              <Markdown>{body}</Markdown>
            </div>
          ) : null}
        </fieldset>
      ))}
    </div>
  );
}
