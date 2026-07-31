"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { asset } from "@/system/types";

// Markdown renderer for app content. Root-relative image/link paths are
// prefixed with the deploy basePath so they work on GitHub Pages.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: kids, ...props }) => (
            <a
              href={href?.startsWith("/") ? asset(href) : href}
              target="_blank"
              rel="noreferrer"
              {...props}
            >
              {kids}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" && src.startsWith("/") ? asset(src) : src}
              alt={alt ?? ""}
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
