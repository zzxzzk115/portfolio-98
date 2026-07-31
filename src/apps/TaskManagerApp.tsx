"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/system/WindowManager";
import { usePerfData, PerfGraph } from "@/components/widgets/perf";

type Tab = "applications" | "processes" | "performance";

const SYSTEM_PROCESSES = [
  { name: "explorer.exe", mem: 3812 },
  { name: "systray.exe", mem: 428 },
  { name: "rundll32.exe", mem: 892 },
  { name: "agent98.exe", mem: 1204 },
];

function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return h;
}

export function TaskManagerApp({ windowId }: { windowId: string }) {
  const wm = useWindowManager();
  const [tab, setTab] = useState<Tab>("applications");
  const [selected, setSelected] = useState<string | null>(null);
  const { history, cpu, mem } = usePerfData();
  // Re-roll the per-process jitter every second.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const apps = wm.windows.filter((w) => w.id !== windowId);

  const processes = [
    ...SYSTEM_PROCESSES.map((p) => ({
      key: `sys-${p.name}`,
      name: p.name,
      system: true,
      cpu: (hashOf(p.name) + tick * 7) % 3,
      mem: p.mem + ((hashOf(p.name) * (tick + 1)) % 64),
    })),
    ...wm.windows.map((w) => ({
      key: w.id,
      name: `${w.app.id}.exe`,
      system: false,
      cpu: (hashOf(w.id) + tick * 13) % 9,
      mem: 800 + ((hashOf(w.id) * 37) % 4000) + ((tick * hashOf(w.id)) % 128),
    })),
  ];

  const endProcess = (key: string) => {
    if (key.startsWith("sys-")) {
      // Killing a system process has consequences.
      window.dispatchEvent(new CustomEvent("win98-bsod"));
      return;
    }
    wm.close(key);
    setSelected(null);
  };

  return (
    <div className="app-body app-body-fill taskmgr">
      <menu role="tablist">
        {(
          [
            ["applications", "Applications"],
            ["processes", "Processes"],
            ["performance", "Performance"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <li
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            <a href="#" onClick={(e) => e.preventDefault()}>
              {label}
            </a>
          </li>
        ))}
      </menu>

      <div className="taskmgr-page window" role="tabpanel">
        {tab === "applications" ? (
          <>
            <div className="taskmgr-list sunken-panel">
              <table className="taskmgr-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((w) => (
                    <tr
                      key={w.id}
                      className={selected === w.id ? "taskmgr-row-selected" : ""}
                      onClick={() => setSelected(w.id)}
                    >
                      <td>{w.app.title}</td>
                      <td>Running</td>
                    </tr>
                  ))}
                  {apps.length === 0 ? (
                    <tr>
                      <td colSpan={2}>
                        <i>Nothing running. Suspiciously idle.</i>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <div className="toolbar-row toolbar-row-right">
              <button
                disabled={!selected || !apps.some((w) => w.id === selected)}
                onClick={() => {
                  if (selected) {
                    wm.close(selected);
                    setSelected(null);
                  }
                }}
              >
                End Task
              </button>
              <button
                disabled={!selected || !apps.some((w) => w.id === selected)}
                onClick={() => selected && wm.focus(selected)}
              >
                Switch To
              </button>
            </div>
          </>
        ) : null}

        {tab === "processes" ? (
          <>
            <div className="taskmgr-list sunken-panel">
              <table className="taskmgr-table">
                <thead>
                  <tr>
                    <th>Image Name</th>
                    <th>CPU</th>
                    <th>Mem Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p) => (
                    <tr
                      key={p.key}
                      className={
                        selected === p.key ? "taskmgr-row-selected" : ""
                      }
                      onClick={() => setSelected(p.key)}
                    >
                      <td>{p.name}</td>
                      <td>{String(p.cpu).padStart(2, "0")}</td>
                      <td>{p.mem.toLocaleString()} K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="toolbar-row toolbar-row-right">
              <button
                disabled={!selected || !processes.some((p) => p.key === selected)}
                onClick={() => selected && endProcess(selected)}
              >
                End Process
              </button>
            </div>
          </>
        ) : null}

        {tab === "performance" ? (
          <>
            <fieldset>
              <legend>CPU Usage: {cpu}%</legend>
              <PerfGraph history={history} height={70} />
            </fieldset>
            <fieldset>
              <legend>Totals</legend>
              <table className="taskmgr-stats">
                <tbody>
                  <tr>
                    <td>Processes</td>
                    <td>{processes.length}</td>
                  </tr>
                  <tr>
                    <td>Handles</td>
                    <td>{processes.length * 47 + 213}</td>
                  </tr>
                  <tr>
                    <td>Threads</td>
                    <td>{processes.length * 6 + 18}</td>
                  </tr>
                  <tr>
                    <td>Memory</td>
                    <td>{mem} MB / 64 MB (it&apos;s fine)</td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </>
        ) : null}
      </div>

      <div className="taskmgr-statusbar">
        <span>Processes: {processes.length}</span>
        <span>CPU Usage: {cpu}%</span>
        <span>Mem Usage: {mem} MB</span>
      </div>
    </div>
  );
}
