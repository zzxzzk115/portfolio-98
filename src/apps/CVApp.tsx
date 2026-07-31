"use client";

import { useContent } from "@/system/ContentContext";
import { asset } from "@/system/types";

export function CVApp() {
  const { site } = useContent();
  const pdf = asset(site.cvPdf);
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
