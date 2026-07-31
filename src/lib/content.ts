// Build-time content loader. Runs only on the server (during `next build` /
// dev SSR) — the parsed result is passed into the client shell as props.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Friend,
  MusicTrack,
  Post,
  ProjectContent,
  PublicationContent,
  SiteContent,
  SiteMeta,
} from "./content-types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMd(...segments: string[]) {
  return matter(
    fs.readFileSync(path.join(CONTENT_DIR, ...segments), "utf-8")
  );
}

function listMd(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

export function loadSiteContent(): SiteContent {
  const site = readMd("site.md").data as SiteMeta;
  const aboutMd = readMd("about.md").content.trim();
  const readmeText = readMd("readme.md").content.trim();

  const projects: ProjectContent[] = listMd("projects").map((file) => {
    const { data, content } = readMd("projects", file);
    const d = data as Partial<ProjectContent["meta"]>;
    return {
      meta: {
        slug: file.replace(/\.md$/, ""),
        name: d.name ?? file,
        category: d.category ?? "fun",
        blurb: d.blurb ?? "",
        img: d.img,
        order: d.order ?? 99,
        links: d.links ?? [],
        embed: d.embed,
      },
      body: content.trim(),
    };
  });
  projects.sort((a, b) => a.meta.order - b.meta.order);

  const publications: PublicationContent[] = listMd("publications").map(
    (file) => {
      const { data, content } = readMd("publications", file);
      const d = data as Partial<PublicationContent["meta"]>;
      return {
        meta: {
          id: file.replace(/\.md$/, ""),
          title: d.title ?? file,
          authors: d.authors ?? "",
          venue: d.venue ?? "",
          year: d.year ?? 0,
          doi: d.doi,
          pdf: d.pdf,
          links: d.links ?? [],
        },
        body: content.trim(),
      };
    }
  );
  publications.sort((a, b) => b.meta.year - a.meta.year);

  const music: MusicTrack[] = listMd("music").map((file) => {
    const { data, content } = readMd("music", file);
    const d = data as Partial<MusicTrack>;
    return {
      id: file.replace(/\.md$/, ""),
      title: d.title ?? file,
      artist: d.artist ?? "",
      order: d.order ?? 99,
      code: content.trim(),
    };
  });
  music.sort((a, b) => a.order - b.order);

  const posts: Post[] = listMd("posts").map((file) => {
    const { data, content } = readMd("posts", file);
    const d = data as { title?: string; date?: string | Date };
    return {
      slug: file.replace(/\.md$/, ""),
      title: d.title ?? file,
      date:
        d.date instanceof Date
          ? d.date.toISOString().slice(0, 10)
          : (d.date ?? ""),
      body: content.trim(),
    };
  });
  posts.sort((a, b) => b.date.localeCompare(a.date));

  let friends: Friend[] = [];
  if (fs.existsSync(path.join(CONTENT_DIR, "friends.md"))) {
    const raw = readMd("friends.md").data as { friends?: Partial<Friend>[] };
    friends = (raw.friends ?? []).map((f) => ({
      name: f.name ?? "?",
      url: f.url ?? "#",
      sign: f.sign ?? "",
      avatar: f.avatar,
      online: f.online ?? true,
    }));
  }

  return {
    site,
    aboutMd,
    readmeText,
    projects,
    publications,
    music,
    posts,
    friends,
  };
}
