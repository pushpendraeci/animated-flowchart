import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow, ReactFlowProvider, Background,
  useReactFlow, useViewport, useStore,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEditorStore } from "../../store/editorStore";
import { diagramBounds, type Bounds } from "../../lib/exportDiagram";
import { nodeTypes } from "../nodes";
import { edgeTypes } from "../edges";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Zoom in / out / fit buttons — useful on desktop where there is no pinch gesture. */
function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const cls =
    "flex h-9 w-9 items-center justify-center rounded-md border border-gray-700 bg-gray-900/80 text-lg leading-none text-gray-200 backdrop-blur hover:border-gray-500";
  return (
    <div className="absolute left-4 bottom-4 z-10 flex flex-col gap-1.5">
      <button className={cls} title="Zoom in" aria-label="Zoom in" onClick={() => zoomIn({ duration: 150 })}>+</button>
      <button className={cls} title="Zoom out" aria-label="Zoom out" onClick={() => zoomOut({ duration: 150 })}>−</button>
      <button className={`${cls} text-sm`} title="Fit to view" aria-label="Fit to view"
        onClick={() => fitView({ padding: 0.12, duration: 200 })}>⤢</button>
    </div>
  );
}

/** Draggable vertical scrollbar; appears only when the chart is taller than the pane. */
function VerticalScrollbar({ bounds }: { bounds: Bounds }) {
  const paneHeight = useStore((s) => s.height);
  const vp = useViewport();
  const { setViewport } = useReactFlow();

  const z = vp.zoom;
  const contentPx = bounds.height * z;
  const trackTop = 88, trackBottom = 24;
  const trackH = Math.max(0, paneHeight - trackTop - trackBottom);

  // Nothing to scroll if the whole diagram already fits vertically.
  if (contentPx <= paneHeight + 1 || trackH <= 0) return null;

  const yMax = -bounds.y * z;                       // viewport.y that pins content top to pane top
  const yMin = paneHeight - (bounds.y + bounds.height) * z; // ...content bottom to pane bottom
  const range = yMax - yMin;                        // > 0 when content overflows
  const f = clamp((yMax - vp.y) / range, 0, 1);     // 0 = top, 1 = bottom
  const thumbH = clamp(paneHeight / contentPx, 0.06, 1) * trackH;
  const thumbTop = f * (trackH - thumbH);

  const onThumbDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget;
    const startY = e.clientY;
    const startF = f;
    const travel = trackH - thumbH;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const nf = clamp(startF + (travel > 0 ? (ev.clientY - startY) / travel : 0), 0, 1);
      setViewport({ x: vp.x, y: yMax - nf * range, zoom: z });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="absolute right-2 z-10 w-2.5" style={{ top: trackTop, height: trackH }}>
      <div className="relative h-full w-full rounded-full bg-gray-700/30">
        <div
          role="scrollbar"
          aria-label="Scroll vertically"
          aria-orientation="vertical"
          onPointerDown={onThumbDown}
          className="absolute left-0 w-full cursor-grab rounded-full bg-gray-400/70 hover:bg-gray-300 active:cursor-grabbing"
          style={{ top: thumbTop, height: thumbH }}
        />
      </div>
    </div>
  );
}

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

  const bounds = useMemo(() => diagramBounds(diagram?.nodes ?? []), [diagram]);

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
            <ZoomControls />
            <VerticalScrollbar bounds={bounds} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
