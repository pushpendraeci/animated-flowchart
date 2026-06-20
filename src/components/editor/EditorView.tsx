import { useEffect, useRef, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useEditorStore } from "../../store/editorStore";
import { saveDiagram } from "../../db/library";
import { exportImage, downloadDataUrl } from "../../lib/exportDiagram";
import { Toolbar } from "./Toolbar";
import { Palette } from "./Palette";
import { Canvas } from "./Canvas";
import { Inspector } from "./Inspector";
import { PresentMode } from "../present/PresentMode";

type Sel = { kind: "node" | "edge"; id: string } | null;

export function EditorView({ onBack }: { onBack: () => void }) {
  const diagram = useEditorStore((s) => s.diagram);
  const [selection, setSelection] = useState<Sel>(null);
  const [present, setPresent] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Debounced auto-save on any diagram change.
  useEffect(() => {
    if (!diagram) return;
    const t = setTimeout(() => { void saveDiagram(diagram); }, 600);
    return () => clearTimeout(t);
  }, [diagram]);

  const onExportImage = async (fmt: "png" | "svg") => {
    if (!canvasRef.current) return;
    const url = await exportImage(canvasRef.current, fmt);
    downloadDataUrl(url, `${diagram?.name ?? "diagram"}.${fmt}`);
  };

  if (present) return <PresentMode onExit={() => setPresent(false)} />;

  return (
    <div className="flex h-full flex-col">
      <Toolbar onPresent={() => setPresent(true)} onExportImage={onExportImage} onBack={onBack} />
      <div className="flex flex-1 overflow-hidden">
        <Palette />
        <div ref={canvasRef} className="flex-1 relative">
          <ReactFlowProvider>
            <Canvas onSelect={setSelection} />
          </ReactFlowProvider>
        </div>
        <Inspector selection={selection} />
      </div>
    </div>
  );
}
