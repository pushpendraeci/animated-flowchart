import { useEffect, useMemo, useState } from "react";
import { ReactFlow, ReactFlowProvider, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEditorStore } from "../../store/editorStore";
import { nodeTypes } from "../nodes";
import { edgeTypes } from "../edges";

export function PresentMode({ onExit }: { onExit: () => void }) {
  const diagram = useEditorStore((s) => s.diagram);
  const [playing, setPlaying] = useState(true);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onExit(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onExit]);

  const edges = useMemo(() => {
    if (!diagram) return [];
    return diagram.edges.map((e) =>
      playing ? e : { ...e, data: { ...e.data, animation: "none" as const } }
    );
  }, [diagram, playing]);

  if (!diagram) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0e1a] flex flex-col">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button className="rounded-md border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm backdrop-blur hover:border-gray-500"
          onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
        <button className="rounded-md border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm backdrop-blur hover:border-gray-500"
          onClick={() => { setRestartKey((k) => k + 1); setPlaying(true); }}>Restart</button>
        <button className="rounded-md bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700" onClick={onExit}>Exit</button>
      </div>
      <div className="text-center pt-6 pb-2">
        <h1 className="text-3xl font-bold text-sky-400">{diagram.name}</h1>
        <p className="text-gray-500 text-sm">Interactive Workflow Simulation</p>
      </div>
      <div className="flex-1 pb-4" key={restartKey}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={diagram.nodes as any}
            edges={edges as any}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag
            panOnScroll
            zoomOnScroll
            minZoom={0.05}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#111827" gap={24} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
