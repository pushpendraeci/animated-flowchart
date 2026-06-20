import { useCallback } from "react";
import {
  ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges,
  type NodeChange, type EdgeChange, type Connection, useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEditorStore } from "../../store/editorStore";
import { nodeTypes } from "../nodes";
import { edgeTypes } from "../edges";
import type { NodeKind } from "../../types";

type Sel = { kind: "node" | "edge"; id: string } | null;

export function Canvas({ onSelect }: { onSelect: (sel: Sel) => void }) {
  const diagram = useEditorStore((s) => s.diagram);
  const setNodes = useEditorStore((s) => s.setNodes);
  const setEdges = useEditorStore((s) => s.setEdges);
  const addEdge = useEditorStore((s) => s.addEdge);
  const addNode = useEditorStore((s) => s.addNode);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const d = useEditorStore.getState().diagram;
      if (!d) return;
      setNodes(applyNodeChanges(changes, d.nodes as any) as any);
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const d = useEditorStore.getState().diagram;
      if (!d) return;
      setEdges(applyEdgeChanges(changes, d.edges as any) as any);
    },
    [setEdges]
  );
  const onConnect = useCallback(
    (c: Connection) => {
      if (c.source && c.target)
        addEdge({ source: c.source, target: c.target, sourceHandle: c.sourceHandle, targetHandle: c.targetHandle });
    },
    [addEdge]
  );
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData("application/flow-kind") as NodeKind;
      if (!kind) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(kind, position);
    },
    [addNode, screenToFlowPosition]
  );

  if (!diagram) return null;

  return (
    <ReactFlow
      nodes={diagram.nodes as any}
      edges={diagram.edges as any}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionMode={"loose" as any}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(_, n) => onSelect({ kind: "node", id: n.id })}
      onEdgeClick={(_, ed) => onSelect({ kind: "edge", id: ed.id })}
      onPaneClick={() => onSelect(null)}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1f2937" gap={20} />
      <Controls />
    </ReactFlow>
  );
}
