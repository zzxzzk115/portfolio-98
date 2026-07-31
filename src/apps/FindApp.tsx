"use client";

import { useState, type ReactNode } from "react";
import { useContent } from "@/system/ContentContext";
import { useWindowManager } from "@/system/WindowManager";
import { PixelIcon } from "@/system/pixel-icons";
import { buildVfs, type VfsNode } from "@/lib/vfs";
import { explorerAppDescriptor } from "@/apps/ExplorerApp";

interface Match {
  node: VfsNode;
  where: "name" | "content" | "type";
  snippet: string; // raw text containing the query (for highlighting)
}

function contentSnippet(text: string, q: string): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return "";
  const start = Math.max(0, idx - 32);
  const end = Math.min(text.length, idx + q.length + 56);
  const clean = (s: string) => s.replace(/\s+/g, " ");
  return (
    (start > 0 ? "…" : "") +
    clean(text.slice(start, end)) +
    (end < text.length ? "…" : "")
  );
}

function collectMatches(root: VfsNode, q: string): Match[] {
  const out: Match[] = [];
  const walk = (node: VfsNode) => {
    (node.children ?? []).forEach((child) => {
      if (child.name.toLowerCase().includes(q)) {
        out.push({ node: child, where: "name", snippet: child.name });
      } else if (child.text?.toLowerCase().includes(q)) {
        out.push({
          node: child,
          where: "content",
          snippet: contentSnippet(child.text, q),
        });
      } else if (child.typeName.toLowerCase().includes(q)) {
        out.push({ node: child, where: "type", snippet: child.typeName });
      }
      walk(child);
    });
  };
  walk(root);
  return out;
}

// Highlight every occurrence of q (case-insensitive) in text.
function Highlight({ text, q }: { text: string; q: string }): ReactNode {
  if (!q) return text;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let i = 0;
  for (;;) {
    const idx = lower.indexOf(q, i);
    if (idx < 0) break;
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <span key={idx} className="find-hl">
        {text.slice(idx, idx + q.length)}
      </span>
    );
    i = idx + q.length;
  }
  parts.push(text.slice(i));
  return <>{parts}</>;
}

export function FindApp() {
  const content = useContent();
  const wm = useWindowManager();
  const root = buildVfs(content);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = q ? collectMatches(root, q) : [];

  const openNode = (node: VfsNode) => {
    if (node.kind === "file") node.open?.(wm);
    else wm.open(explorerAppDescriptor(node.path));
  };

  const parentOf = (node: VfsNode) =>
    node.path.slice(0, node.path.lastIndexOf("\\")) || "C:";

  return (
    <div className="app-body app-body-fill find-app">
      <div className="toolbar-row find-bar">
        <label htmlFor="find-input">Search:</label>
        <input
          id="find-input"
          className="pub-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="File names and contents across C:\"
          spellCheck={false}
          autoFocus
        />
      </div>
      <div className="taskmgr-list sunken-panel find-results">
        <table className="taskmgr-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>In Folder</th>
              <th>Found in</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ node, where, snippet }) => (
              <tr
                key={node.path}
                className={selected === node.path ? "taskmgr-row-selected" : ""}
                onClick={() => setSelected(node.path)}
                onDoubleClick={() => openNode(node)}
              >
                <td className="find-name-cell">
                  <PixelIcon name={node.icon} size={14} />
                  <span>
                    <Highlight text={node.name} q={q} />
                  </span>
                </td>
                <td className="find-folder-cell">{parentOf(node)}</td>
                <td className="find-match-cell">
                  {where === "name" ? (
                    <i>file name</i>
                  ) : where === "type" ? (
                    <i>
                      type: <Highlight text={snippet} q={q} />
                    </i>
                  ) : (
                    <Highlight text={snippet} q={q} />
                  )}
                </td>
              </tr>
            ))}
            {q && results.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <i>No files found. The 90s had less content too.</i>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="taskmgr-statusbar">
        <span>
          {q ? `${results.length} file(s) found` : "Type to search"}
        </span>
      </div>
    </div>
  );
}
