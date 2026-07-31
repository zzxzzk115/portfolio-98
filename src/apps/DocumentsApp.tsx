"use client";

// Slimmed: the My Documents folder view now lives in Explorer
// (C:\My Documents); this module keeps the per-post Notepad window.

import type { Post } from "@/lib/content-types";
import { Markdown } from "@/components/Markdown";
import type { AppDescriptor } from "@/system/types";

export function postAppDescriptor(post: Post): AppDescriptor {
  return {
    id: `post-${post.slug}`,
    title: `${post.title} - Notepad`,
    icon: "notepad",
    component: function PostWindow() {
      return (
        <div className="app-body">
          <h1 className="project-title">{post.title}</h1>
          <p className="hint-text">{post.date}</p>
          <Markdown>{post.body}</Markdown>
        </div>
      );
    },
    defaultSize: { width: 560, height: 520 },
  };
}
