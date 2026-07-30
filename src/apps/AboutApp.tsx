"use client";

/* eslint-disable @next/next/no-img-element */
import { profile } from "@/data/profile";
import { asset } from "@/system/types";

export function AboutApp() {
  return (
    <div className="app-body">
      <div className="about-header">
        <img
          src={asset(profile.avatar)}
          alt={profile.name}
          className="about-avatar"
        />
        <div>
          <h1 className="about-name">{profile.name}</h1>
          <p className="about-title">
            {profile.title}
            <br />
            {profile.affiliation}
          </p>
          <ul className="about-facts">
            {profile.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sunken-panel about-bio">
        {profile.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <fieldset>
        <legend>News</legend>
        <ul className="news-list">
          {profile.news.map((n) => (
            <li key={n.date}>
              <b>{n.date}</b> — {n.text}
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
