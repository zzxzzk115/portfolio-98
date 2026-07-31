import { loadSiteContent } from "@/lib/content";

export const dynamic = "force-static";

const SITE_URL = "https://zzxzzk115.github.io/portfolio-98";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const { site, posts } = loadSiteContent();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/</link>
      <guid isPermaLink="false">${escapeXml(p.slug)}</guid>
      <pubDate>${new Date(p.date + "T00:00:00Z").toUTCString()}</pubDate>
      <description>${escapeXml(p.body.slice(0, 400))}…</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.osName)} — ${escapeXml(site.name)}</title>
    <link>${SITE_URL}/</link>
    <description>Posts from ${escapeXml(site.name)}'s Windows 98-style homepage</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
