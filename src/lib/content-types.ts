// Shared (server + client) types for markdown-driven content.

export interface SiteMeta {
  osName: string;
  pocketName: string;
  name: string;
  handle: string;
  title: string;
  affiliation: string;
  location: string;
  avatar: string;
  cvPdf: string;
  facts: string[];
  news: { date: string; text: string }[];
  socials: {
    email: string;
    github: string;
    linkedin: string;
    itch: string;
    academicSite: string;
  };
}

export type ProjectCategory = "work" | "indie" | "fun";

export type ProjectEmbed =
  | { kind: "steam"; appId: string }
  | { kind: "itch"; embedId: string; url: string; title: string }
  | { kind: "youtube"; videoId: string }
  | { kind: "site"; url: string };

export interface ProjectMeta {
  slug: string;
  name: string;
  category: ProjectCategory;
  order: number;
  blurb: string;
  img?: string; // thumbnail shown in the Projects folder
  links: { label: string; url: string }[];
  embed?: ProjectEmbed;
}

export interface ProjectContent {
  meta: ProjectMeta;
  body: string; // markdown
}

export interface PublicationMeta {
  id: string;
  title: string;
  authors: string;
  venue: string;
  abbr?: string; // short venue badge, e.g. "CSA"
  year: number;
  doi?: string;
  pdf?: string;
  bibtex?: string; // raw BibTeX entry shown behind the BibTeX button
  gbt?: string; // GB/T 7714 citation string (Chinese standard)
  preview?: string; // journal/conference cover thumbnail
  teaser?: string; // optional figure shown with the abstract
  projectPage?: string; // dedicated project-page button
  github?: string; // repo url or "owner/name" — dedicated code button
  // Extensible icon buttons; `icon` is a pixel-icon name.
  links: { label: string; url: string; icon?: string }[];
}

export interface PublicationContent {
  meta: PublicationMeta;
  body: string; // markdown: abstract + citation
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  order: number;
  code: string; // strudel pattern source
}

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  body: string; // markdown
}

export interface Friend {
  name: string;
  url: string;
  sign: string;
  avatar?: string;
  online: boolean;
}

export interface SiteContent {
  site: SiteMeta;
  aboutMd: string;
  readmeText: string;
  projects: ProjectContent[];
  publications: PublicationContent[];
  music: MusicTrack[];
  posts: Post[];
  friends: Friend[];
}
