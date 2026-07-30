"use client";

import { readmeText } from "@/data/profile";

export function NotepadApp() {
  return (
    <div className="app-body app-body-fill">
      <pre className="notepad-text">{readmeText}</pre>
    </div>
  );
}
