"use client";

import { useContent } from "@/system/ContentContext";

export function ContactApp() {
  const { site } = useContent();
  const { socials } = site;
  const rows = [
    { label: "Email", value: socials.email, url: `mailto:${socials.email}` },
    {
      label: "GitHub",
      value: `@${socials.github}`,
      url: `https://github.com/${socials.github}`,
    },
    {
      label: "LinkedIn",
      value: socials.linkedin,
      url: `https://www.linkedin.com/in/${socials.linkedin}`,
    },
    {
      label: "itch.io",
      value: socials.itch,
      url: `https://${socials.itch}.itch.io`,
    },
    {
      label: "Academic site",
      value: socials.academicSite.replace(/^https?:\/\//, ""),
      url: socials.academicSite,
    },
  ];

  return (
    <div className="app-body">
      <p className="hint-text">{site.location}</p>
      <table className="contact-table">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="contact-label">{r.label}</td>
              <td>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.value}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
