"use client";

import { usePerfData, PerfGraph } from "./perf";

export function SysmonWidget({ compact = false }: { compact?: boolean }) {
  const { history, cpu, mem } = usePerfData();

  return (
    <div className="sysmon-widget">
      <PerfGraph history={history} height={compact ? 36 : 60} />
      <div className="sysmon-row">
        <span>CPU: {cpu}%</span>
        <span>Mem: {mem} MB</span>
      </div>
    </div>
  );
}
