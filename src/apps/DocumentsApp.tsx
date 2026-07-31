"use client";

import type { Post } from "@/lib/content-types";
import { useContent } from "@/system/ContentContext";
import { PixelIcon } from "@/system/pixel-icons";
import { useWindowManager } from "@/system/WindowManager";
import { Markdown } from "@/components/Markdown";
import type { AppDescriptor } from "@/system/types";

function postAppDescriptor(post: Post): AppDescriptor {
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

export function DocumentsApp() {
  const { posts } = useContent();
  const wm = useWindowManager();

  return (
    <div className="app-body">
      <div className="icon-grid">
        {posts.map((post) => (
          <button
            key={post.slug}
            className="icon-grid-item"
            onDoubleClick={() => wm.open(postAppDescriptor(post))}
            onClick={() => wm.open(postAppDescriptor(post))}
            title={post.date}
          >
            <PixelIcon name="document" size={32} />
            <span>{post.slug}.txt</span>
          </button>
        ))}
      </div>
    </div>
  );
}
