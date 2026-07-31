"use client";

import { useState } from "react";
import { useContent } from "@/system/ContentContext";
import { useWindowManager } from "@/system/WindowManager";
import { PixelIcon } from "@/system/pixel-icons";
import { buildVfs, type VfsNode } from "@/lib/vfs";
import { explorerAppDescriptor } from "@/apps/ExplorerApp";

function collectMatches(root: VfsNode, q: string): VfsNode[] {
  const out: VfsNode[] = [];
  const walk = (node: VfsNode) => {
    (node.children ?? []).forEach((child) => {
      const hit =
        child.name.toLowerCase().includes(q) ||
        child.typeName.toLowerCase().includes(q) ||
        (child.text?.toLowerCase().includes(q) ?? false);
      if (hit) out.push(child);
      walk(child);
    });
  };
  walk(root);
  return out;
}

export function FindApp() {
  const content = useContent();
  const wm = useWindowManager();
  const root = buildVfs(content);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const q = searched.trim().toLowerCase();
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
        <label htmlFor="find-input">Named:</label>
        <input
          id="find-input"
          className="pub-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearched(query);
          }}
          spellCheck={false}
          autoFocus
        />
        <button onClick={() => setSearched(query)}>Find Now</button>
        <button
          onClick={() => {
            setQuery("");
            setSearched("");
            setSelected(null);
          }}
        >
          New Search
        </button>
      </div>
      <p className="hint-text find-hint">
        Searches file names and contents across C:\
      </p>
      <div className="taskmgr-list sunken-panel find-results">
        <table className="taskmgr-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>In Folder</th>
              <th>Type</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            {results.map((node) => (
              <tr
                key={node.path}
                className={selected === node.path ? "taskmgr-row-selected" : ""}
                onClick={() => setSelected(node.path)}
                onDoubleClick={() => openNode(node)}
              >
                <td className="find-name-cell">
                  <PixelIcon name={node.icon} size={14} />
                  {node.name}
                </td>
                <td>{parentOf(node)}</td>
                <td>{node.typeName}</td>
                <td>
                  {node.kind === "file" ? `${node.sizeKB ?? 0} KB` : ""}
                </td>
              </tr>
            ))}
            {q && results.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <i>No files found. The 90s had less content too.</i>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="taskmgr-statusbar">
        <span>
          {q ? `${results.length} file(s) found` : "Enter a search term"}
        </span>
      </div>
    </div>
  );
}
