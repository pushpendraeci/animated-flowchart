import { useEditorStore } from "../../store/editorStore";
import { ACCENTS, EDGE_ANIMATIONS } from "../../types";

type Sel = { kind: "node" | "edge"; id: string } | null;

export function Inspector({ selection }: { selection: Sel }) {
  const diagram = useEditorStore((s) => s.diagram);
  const updateNodeData = useEditorStore((s) => s.updateNodeData);
  const updateEdgeData = useEditorStore((s) => s.updateEdgeData);

  if (!selection || !diagram)
    return <aside className="w-64 shrink-0 border-l border-gray-800 p-4 text-sm text-gray-500">Select a block or connector to edit it.</aside>;

  if (selection.kind === "node") {
    const n = diagram.nodes.find((x) => x.id === selection.id);
    if (!n) return <aside className="w-64 shrink-0 border-l border-gray-800 p-4" />;
    return (
      <aside className="w-64 shrink-0 border-l border-gray-800 p-4 space-y-3 text-sm">
        <div className="text-xs uppercase tracking-wide text-gray-500">Block</div>
        <label className="block">Title
          <input aria-label="title" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 px-2 py-1"
            value={n.data.title} onChange={(e) => updateNodeData(n.id, { title: e.target.value })} />
        </label>
        <label className="block">Subtitle
          <input aria-label="subtitle" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 px-2 py-1"
            value={n.data.subtitle} onChange={(e) => updateNodeData(n.id, { subtitle: e.target.value })} />
        </label>
        <label className="block">Accent
          <select aria-label="accent" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 px-2 py-1"
            value={n.data.accent} onChange={(e) => updateNodeData(n.id, { accent: e.target.value as any })}>
            {ACCENTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={n.data.glow} onChange={(e) => updateNodeData(n.id, { glow: e.target.checked })} />
          Glow
        </label>
      </aside>
    );
  }

  const ed = diagram.edges.find((x) => x.id === selection.id);
  if (!ed) return <aside className="w-64 shrink-0 border-l border-gray-800 p-4" />;
  return (
    <aside className="w-64 shrink-0 border-l border-gray-800 p-4 space-y-3 text-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500">Connector</div>
      <label className="block">Animation
        <select aria-label="animation" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 px-2 py-1"
          value={ed.data.animation} onChange={(e) => updateEdgeData(ed.id, { animation: e.target.value as any })}>
          {EDGE_ANIMATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
      <label className="block">Color
        <input aria-label="color" type="color" className="mt-1 h-8 w-full rounded bg-gray-900 border border-gray-700"
          value={ed.data.color} onChange={(e) => updateEdgeData(ed.id, { color: e.target.value })} />
      </label>
      <label className="block">Speed: {ed.data.speed}
        <input aria-label="speed" type="range" min={1} max={5} className="mt-1 w-full"
          value={ed.data.speed} onChange={(e) => updateEdgeData(ed.id, { speed: Number(e.target.value) })} />
      </label>
      <label className="block">Line style
        <select aria-label="lineStyle" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 px-2 py-1"
          value={ed.data.lineStyle} onChange={(e) => updateEdgeData(ed.id, { lineStyle: e.target.value as any })}>
          <option value="solid">solid</option><option value="dashed">dashed</option>
        </select>
      </label>
      <label className="block">Path
        <select aria-label="path" className="mt-1 w-full rounded bg-gray-900 border border-gray-700 px-2 py-1"
          value={ed.data.path} onChange={(e) => updateEdgeData(ed.id, { path: e.target.value as any })}>
          <option value="smoothstep">smoothstep</option><option value="bezier">bezier</option><option value="straight">straight</option>
        </select>
      </label>
    </aside>
  );
}
