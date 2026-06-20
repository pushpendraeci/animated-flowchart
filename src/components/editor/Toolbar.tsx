import { useRef } from "react";
import { useEditorStore } from "../../store/editorStore";
import { saveDiagram } from "../../db/library";
import { diagramToJson, diagramFromJson, downloadDataUrl } from "../../lib/exportDiagram";

export function Toolbar({
  onPresent, onExportImage, onBack,
}: { onPresent: () => void; onExportImage: (fmt: "png" | "svg") => void; onBack: () => void }) {
  const diagram = useEditorStore((s) => s.diagram);
  const setName = useEditorStore((s) => s.setName);
  const loadDiagram = useEditorStore((s) => s.loadDiagram);
  const fileRef = useRef<HTMLInputElement>(null);
  if (!diagram) return null;

  const btn = "rounded-md border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm hover:border-gray-500";

  return (
    <header className="flex items-center gap-2 border-b border-gray-800 px-3 py-2">
      <button className={btn} onClick={onBack}>← Gallery</button>
      <input aria-label="diagram name"
        className="rounded-md bg-gray-900 border border-gray-700 px-2 py-1 text-sm w-56"
        value={diagram.name} onChange={(e) => setName(e.target.value)} />
      <div className="flex-1" />
      <button className={btn} onClick={() => saveDiagram(useEditorStore.getState().diagram!)}>Save</button>
      <button className={btn} onClick={() =>
        downloadDataUrl("data:application/json," + encodeURIComponent(diagramToJson(diagram)), `${diagram.name}.json`)}>
        Export JSON
      </button>
      <button className={btn} onClick={() => fileRef.current?.click()}>Import JSON</button>
      <input ref={fileRef} type="file" accept="application/json" className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return;
          loadDiagram(diagramFromJson(await f.text()));
          e.target.value = "";
        }} />
      <button className={btn} onClick={() => onExportImage("png")}>PNG</button>
      <button className={btn} onClick={() => onExportImage("svg")}>SVG</button>
      <button className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold hover:bg-sky-500" onClick={onPresent}>
        ▶ Present
      </button>
    </header>
  );
}
