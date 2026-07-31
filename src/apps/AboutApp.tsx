"use client";

/* eslint-disable @next/next/no-img-element */
import { useContent } from "@/system/ContentContext";
import { Markdown } from "@/components/Markdown";
import { asset } from "@/system/types";

export function AboutApp() {
  const { site, aboutMd } = useContent();
  return (
    <div className="app-body">
      <div className="about-header">
        <img src={asset(site.avatar)} alt={site.name} className="about-avatar" />
        <div>
          <h1 className="about-name">{site.name}</h1>
          <p className="about-title">
            {site.title}
            <br />
            {site.affiliation}
          </p>
          <ul className="about-facts">
            {site.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sunken-panel about-bio">
        <Markdown>{aboutMd}</Markdown>
      </div>
      <fieldset>
        <legend>News</legend>
        <ul className="news-list">
          {site.news.map((n) => (
            <li key={n.date}>
              <b>{n.date}</b> — {n.text}
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
