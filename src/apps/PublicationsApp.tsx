"use client";

import { useState } from "react";
import { publications } from "@/data/profile";
import { asset } from "@/system/types";

export function PublicationsApp() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="app-body">
      <p className="hint-text">
        Peer-reviewed publications. More coming as the PhD progresses — watch
        this space.
      </p>
      {publications.map((pub) => (
        <fieldset key={pub.id} className="pub-entry">
          <legend>{pub.year}</legend>
          <b>{pub.title}</b>
          <p className="pub-authors">{pub.authors}</p>
          <p className="pub-venue">
            <i>{pub.venue}</i>
            {pub.doi ? <> · DOI: {pub.doi}</> : null}
          </p>
          <div className="toolbar-row">
            {pub.pdf ? (
              <a
                className="btn-link"
                href={asset(pub.pdf)}
                target="_blank"
                rel="noreferrer"
              >
                <button>PDF</button>
              </a>
            ) : null}
            {(pub.external ?? []).map((e) => (
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
            {pub.abstract ? (
              <button
                onClick={() =>
                  setExpanded(expanded === pub.id ? null : pub.id)
                }
              >
                {expanded === pub.id ? "Hide abstract" : "Abstract"}
              </button>
            ) : null}
          </div>
          {expanded === pub.id ? (
            <div className="sunken-panel pub-abstract">
              <p>{pub.abstract}</p>
              {pub.citationCn ? (
                <p className="pub-citation">{pub.citationCn}</p>
              ) : null}
            </div>
          ) : null}
        </fieldset>
      ))}
    </div>
  );
}
