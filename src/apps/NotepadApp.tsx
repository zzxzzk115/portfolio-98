"use client";

import { useContent } from "@/system/ContentContext";

export function NotepadApp() {
  const { readmeText } = useContent();
  return (
    <div className="app-body app-body-fill">
      <pre className="notepad-text">{readmeText}</pre>
    </div>
  );
}
