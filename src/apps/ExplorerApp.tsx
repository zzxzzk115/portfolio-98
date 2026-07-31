"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { AppDescriptor } from "@/system/types";
import { asset } from "@/system/types";
import { useWindowManager } from "@/system/WindowManager";
import { useContent } from "@/system/ContentContext";
import { PixelIcon } from "@/system/pixel-icons";
import { ContextMenu } from "@/components/ContextMenu";
import { playSound } from "@/system/sounds";
import {
  buildVfs,
  findNode,
  totalSizeKB,
  type VfsNode,
} from "@/lib/vfs";

const DRIVE_TOTAL_MB = 512;

function propertiesDescriptor(node: VfsNode): AppDescriptor {
  return {
    id: `props-${node.path}`,
    title: `${node.name} Properties`,
    icon: node.kind === "drive" ? "drive" : node.icon,
    component: function PropsDialog() {
      const usedKB = totalSizeKB(node);
      const usedMB = Math.max(1, Math.round(usedKB / 1024) + 97); // system overhead, obviously
      const freeMB = DRIVE_TOTAL_MB - usedMB;
      const usedAngle = (usedMB / DRIVE_TOTAL_MB) * Math.PI * 2;
      const large = usedAngle > Math.PI ? 1 : 0;
      const x = 60 + 50 * Math.sin(usedAngle);
      const y = 60 - 50 * Math.cos(usedAngle);
      return (
        <div className="app-body props-dialog">
          <div className="props-head">
            {node.thumb ? (
              <img
                className="props-thumb"
                src={asset(node.thumb)}
                alt={node.name}
              />
            ) : (
              <PixelIcon name={node.icon} size={32} />
            )}
            <b>{node.name}</b>
          </div>
          <hr className="props-rule" />
          <table className="props-table">
            <tbody>
              <tr>
                <td>Type:</td>
                <td>{node.typeName}</td>
              </tr>
              <tr>
                <td>Location:</td>
                <td>{node.path.slice(0, node.path.lastIndexOf("\\")) || "C:"}</td>
              </tr>
              <tr>
                <td>Size:</td>
                <td>
                  {node.kind === "file"
                    ? `${node.sizeKB ?? 0} KB`
                    : `${totalSizeKB(node).toLocaleString()} KB`}
                </td>
              </tr>
              <tr>
                <td>Modified:</td>
                <td>{node.modified}</td>
              </tr>
            </tbody>
          </table>
          {node.kind === "drive" ? (
            <div className="props-pie-wrap">
              <svg viewBox="0 0 120 120" className="props-pie">
                <circle cx={60} cy={60} r={50} fill="#ff00ff" />
                <path
                  d={`M60,60 L60,10 A50,50 0 ${large} 1 ${x},${y} Z`}
                  fill="#000080"
                />
                <circle cx={60} cy={60} r={50} fill="none" stroke="#000" />
              </svg>
              <table className="props-table">
                <tbody>
                  <tr>
                    <td>
                      <span className="props-swatch" style={{ background: "#000080" }} />
                      Used:
                    </td>
                    <td>{usedMB} MB</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="props-swatch" style={{ background: "#ff00ff" }} />
                      Free:
                    </td>
                    <td>{freeMB} MB</td>
                  </tr>
                  <tr>
                    <td>Capacity:</td>
                    <td>{DRIVE_TOTAL_MB} MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      );
    },
    defaultSize: { width: 340, height: node.kind === "drive" ? 420 : 300 },
  };
}

function TreeItem({
  node,
  depth,
  cwd,
  onNavigate,
}: {
  node: VfsNode;
  depth: number;
  cwd: string;
  onNavigate: (path: string) => void;
}) {
  const [open, setOpen] = useState(depth === 0);
  const folders = (node.children ?? []).filter((c) => c.kind !== "file");
  const active = cwd.toLowerCase() === node.path.toLowerCase();

  return (
    <div>
      <div
        className={"tree-row" + (active ? " tree-row-active" : "")}
        style={{ paddingLeft: depth * 14 + 4 }}
        onClick={() => {
          onNavigate(node.path);
          setOpen(true);
        }}
      >
        <span
          className="tree-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          {folders.length > 0 ? (open ? "−" : "+") : " "}
        </span>
        <PixelIcon name={node.icon} size={14} />
        <span className="tree-label">{node.name}</span>
      </div>
      {open
        ? folders.map((f) => (
            <TreeItem
              key={f.path}
              node={f}
              depth={depth + 1}
              cwd={cwd}
              onNavigate={onNavigate}
            />
          ))
        : null}
    </div>
  );
}

function Explorer({ initialPath }: { initialPath: string }) {
  const content = useContent();
  const wm = useWindowManager();
  const root = buildVfs(content);

  const [history, setHistory] = useState<string[]>([initialPath]);
  const [pos, setPos] = useState(0);
  const [address, setAddress] = useState(initialPath);
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    node: VfsNode;
  } | null>(null);

  const cwd = history[pos];
  const node = findNode(root, cwd) ?? root;
  const children = node.children ?? [];

  const navigate = (path: string) => {
    const target = findNode(root, path);
    if (!target || target.kind === "file") {
      playSound("error");
      return;
    }
    setHistory((h) => [...h.slice(0, pos + 1), target.path]);
    setPos((p) => p + 1);
    setAddress(target.path);
    setSelected(null);
    playSound("click");
  };

  const go = (dir: 1 | -1) => {
    const next = pos + dir;
    if (next < 0 || next >= history.length) return;
    setPos(next);
    setAddress(history[next]);
    setSelected(null);
  };

  const up = () => {
    const idx = cwd.lastIndexOf("\\");
    if (idx > 0) navigate(cwd.slice(0, idx));
    else if (cwd !== "C:") navigate("C:");
  };

  const activate = (child: VfsNode) => {
    if (child.kind === "file") child.open?.(wm);
    else navigate(child.path);
  };

  return (
    <div className="app-body app-body-fill explorer">
      <div className="ie-toolbar">
        <button onClick={() => go(-1)} disabled={pos === 0} title="Back">
          <PixelIcon name="prev" size={12} />
        </button>
        <button
          onClick={() => go(1)}
          disabled={pos >= history.length - 1}
          title="Forward"
        >
          <PixelIcon name="next" size={12} />
        </button>
        <button onClick={up} disabled={cwd === "C:"} title="Up">
          <PixelIcon name="up" size={12} />
        </button>
        <input
          className="ie-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate(address);
          }}
          spellCheck={false}
        />
      </div>

      <div className="explorer-main">
        <div className="explorer-tree sunken-panel">
          <TreeItem node={root} depth={0} cwd={cwd} onNavigate={navigate} />
        </div>
        <div
          className="explorer-pane sunken-panel"
          onClick={() => {
            setSelected(null);
            setMenu(null);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenu({ x: e.clientX, y: e.clientY, node });
          }}
        >
          {(() => {
            const renderItem = (child: VfsNode) => (
              <button
                key={child.path}
                className={
                  "icon-grid-item" +
                  (child.thumb ? " project-card" : " explorer-item") +
                  (selected === child.path ? " icon-grid-item-selected" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(child.path);
                  setMenu(null);
                }}
                onDoubleClick={() => activate(child)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelected(child.path);
                  setMenu({ x: e.clientX, y: e.clientY, node: child });
                }}
                title={child.typeName}
              >
                {child.thumb ? (
                  <img
                    className="project-thumb"
                    src={asset(child.thumb)}
                    alt={child.name}
                    loading="lazy"
                  />
                ) : (
                  <PixelIcon name={child.icon} size={32} />
                )}
                <span>{child.name}</span>
              </button>
            );

            const groups = [
              ...new Set(
                children.map((c) => c.group).filter((g): g is string => !!g)
              ),
            ];
            if (groups.length === 0) {
              return (
                <div className="icon-grid">
                  {children.map(renderItem)}
                  {children.length === 0 ? (
                    <p className="hint-text">(empty)</p>
                  ) : null}
                </div>
              );
            }
            const ungrouped = children.filter((c) => !c.group);
            return (
              <>
                {groups.map((g) => (
                  <fieldset key={g} className="explorer-group">
                    <legend>{g}</legend>
                    <div className="icon-grid">
                      {children.filter((c) => c.group === g).map(renderItem)}
                    </div>
                  </fieldset>
                ))}
                {ungrouped.length > 0 ? (
                  <div className="icon-grid">{ungrouped.map(renderItem)}</div>
                ) : null}
              </>
            );
          })()}
        </div>
      </div>

      <div className="taskmgr-statusbar explorer-status">
        <span>{children.length} object(s)</span>
        <span>{totalSizeKB(node).toLocaleString()} KB</span>
      </div>

      {menu ? (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          items={[
            ...(menu.node.kind === "file"
              ? [{ label: "Open", onClick: () => activate(menu.node) }]
              : menu.node.path !== cwd
                ? [{ label: "Open", onClick: () => navigate(menu.node.path) }]
                : []),
            {
              label: "Properties",
              onClick: () => wm.open(propertiesDescriptor(menu.node)),
            },
          ]}
        />
      ) : null}
    </div>
  );
}

export function explorerAppDescriptor(initialPath: string): AppDescriptor {
  const isRoot = initialPath === "C:";
  return {
    id: `explorer-${initialPath.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: isRoot ? "My Computer" : initialPath,
    icon: isRoot ? "computer" : "folder",
    component: function ExplorerWindow() {
      return <Explorer initialPath={initialPath} />;
    },
    defaultSize: { width: 760, height: 520 },
  };
}
