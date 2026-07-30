"use client";

import { profile } from "@/data/profile";
import { asset } from "@/system/types";

export function CVApp() {
  const pdf = asset(profile.cvPdf);
  return (
    <div className="app-body app-body-fill">
      <div className="toolbar-row">
        <a className="btn-link" href={pdf} target="_blank" rel="noreferrer">
          <button>Open in new tab</button>
        </a>
        <a className="btn-link" href={pdf} download="Kexuan_Zhang_CV.pdf">
          <button>Download</button>
        </a>
      </div>
      <iframe className="fill-frame" src={pdf} title="Curriculum Vitae" />
    </div>
  );
}
