import { useState } from "react";
import type { Diagram } from "./types";
import { useEditorStore } from "./store/editorStore";
import { Gallery } from "./components/gallery/Gallery";
import { EditorView } from "./components/editor/EditorView";

export default function App() {
  const [view, setView] = useState<"gallery" | "editor">("gallery");
  const loadDiagram = useEditorStore((s) => s.loadDiagram);

  const open = (d: Diagram) => { loadDiagram(d); setView("editor"); };

  return (
    <div className="h-full">
      {view === "gallery"
        ? <Gallery onOpen={open} />
        : <EditorView onBack={() => setView("gallery")} />}
    </div>
  );
}
