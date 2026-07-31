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
  year: number;
  doi?: string;
  pdf?: string;
  links: { label: string; url: string }[];
}

export interface PublicationContent {
  meta: PublicationMeta;
  body: string; // markdown: abstract + citation
}

export interface SiteContent {
  site: SiteMeta;
  aboutMd: string;
  readmeText: string;
  projects: ProjectContent[];
  publications: PublicationContent[];
}
