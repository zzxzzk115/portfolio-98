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

// Highlight the site owner's name in the author list.
function Authors({ authors, self }: { authors: string; self: string }) {
  const idx = authors.indexOf(self);
  if (idx < 0) return <p className="pub-authors">{authors}</p>;
  return (
    <p className="pub-authors">
      {authors.slice(0, idx)}
      <span className="pub-self">{self}</span>
      {authors.slice(idx + self.length)}
    </p>
  );
}

// Citation panel with a copy button (bottom-right).
function CitePanel({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="sunken-panel pub-bibtex-wrap">
      <pre className="pub-bibtex">{text.trim()}</pre>
      <div className="pub-cite-actions">
        <button
          onClick={() => {
            navigator.clipboard
              .writeText(text.trim())
              .then(() => setCopied(true))
              .catch(() => setCopied(false));
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

type Panel = { id: string; kind: "abstract" | "bibtex" | "gbt" };

export function PublicationsApp() {
  const { publications, site } = useContent();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");

  const years = [...new Set(publications.map((p) => p.meta.year))].sort(
    (a, b) => b - a
  );

  const q = query.trim().toLowerCase();
  const filtered = publications.filter(({ meta, body }) => {
    if (year !== "all" && String(meta.year) !== year) return false;
    if (!q) return true;
    return [meta.title, meta.authors, meta.venue, meta.abbr ?? "", body]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const togglePanel = (id: string, kind: Panel["kind"]) =>
    setPanel(panel?.id === id && panel.kind === kind ? null : { id, kind });

  const isOpen = (id: string, kind: Panel["kind"]) =>
    panel?.id === id && panel.kind === kind;

  return (
    <div className="app-body">
      <div className="toolbar-row pub-toolbar">
        <input
          className="pub-search"
          placeholder="Search title, author, venue…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
        />
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {filtered.map(({ meta, body }) => {
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
                {meta.abbr ? (
                  <span className="pub-abbr">{meta.abbr}</span>
                ) : null}
                <b>{meta.title}</b>
                <Authors authors={meta.authors} self={site.name} />
                <p className="pub-venue">
                  <i>{meta.venue}</i>
                </p>
              </div>
            </div>
            <div className="toolbar-row">
              {body ? (
                <button onClick={() => togglePanel(meta.id, "abstract")}>
                  ABS
                </button>
              ) : null}
              {meta.doi ? (
                <IconButton
                  href={`https://doi.org/${meta.doi}`}
                  icon="globe"
                  label="DOI"
                />
              ) : null}
              {meta.links.map((e) => (
                <IconButton
                  key={e.label}
                  href={e.url}
                  icon={e.icon ?? "globe"}
                  label={e.label}
                />
              ))}
              {meta.bibtex ? (
                <button onClick={() => togglePanel(meta.id, "bibtex")}>
                  BIB
                </button>
              ) : null}
              {meta.gbt ? (
                <button onClick={() => togglePanel(meta.id, "gbt")}>
                  GB/T 7714
                </button>
              ) : null}
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
            </div>
            {isOpen(meta.id, "abstract") ? (
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
            {isOpen(meta.id, "bibtex") && meta.bibtex ? (
              <CitePanel text={meta.bibtex} />
            ) : null}
            {isOpen(meta.id, "gbt") && meta.gbt ? (
              <CitePanel text={meta.gbt} />
            ) : null}
          </fieldset>
        );
      })}
      {filtered.length === 0 ? (
        <p className="hint-text">No publications match.</p>
      ) : null}
    </div>
  );
}
