import { create } from "zustand";
import {
  type Diagram, type FlowNode, type FlowEdge, type NodeKind,
  type NodeData, type EdgeData, uid,
} from "../types";

const DEFAULT_NODE_DATA: NodeData = {
  title: "New Block", subtitle: "Subtitle", accent: "neutral",
  width: 220, height: 88, glow: true,
};

const DEFAULT_EDGE_DATA: EdgeData = {
  animation: "dots", color: "#60a5fa", speed: 3, lineStyle: "solid", path: "smoothstep",
};

interface EditorState {
  diagram: Diagram | null;
  loadDiagram: (d: Diagram) => void;
  addNode: (kind: NodeKind, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, patch: Partial<NodeData>) => void;
  updateEdgeData: (id: string, patch: Partial<EdgeData>) => void;
  addEdge: (partial: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  setName: (name: string) => void;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
}

function touch(d: Diagram): Diagram {
  return { ...d, updatedAt: Date.now() };
}

export const useEditorStore = create<EditorState>((set) => ({
  diagram: null,
  loadDiagram: (d) => set({ diagram: d }),
  addNode: (kind, position) =>
    set((s) => {
      if (!s.diagram) return s;
      const n: FlowNode = { id: uid(), type: kind, position, data: { ...DEFAULT_NODE_DATA } };
      return { diagram: touch({ ...s.diagram, nodes: [...s.diagram.nodes, n] }) };
    }),
  updateNodeData: (id, patch) =>
    set((s) => {
      if (!s.diagram) return s;
      const nodes = s.diagram.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
      );
      return { diagram: touch({ ...s.diagram, nodes }) };
    }),
  updateEdgeData: (id, patch) =>
    set((s) => {
      if (!s.diagram) return s;
      const edges = s.diagram.edges.map((e) =>
        e.id === id ? { ...e, data: { ...e.data, ...patch } } : e
      );
      return { diagram: touch({ ...s.diagram, edges }) };
    }),
  addEdge: (partial) =>
    set((s) => {
      if (!s.diagram) return s;
      const e: FlowEdge = {
        id: uid(), source: partial.source, target: partial.target,
        sourceHandle: partial.sourceHandle, targetHandle: partial.targetHandle,
        type: "animated", data: { ...DEFAULT_EDGE_DATA },
      };
      return { diagram: touch({ ...s.diagram, edges: [...s.diagram.edges, e] }) };
    }),
  removeNode: (id) =>
    set((s) => {
      if (!s.diagram) return s;
      const nodes = s.diagram.nodes.filter((n) => n.id !== id);
      const edges = s.diagram.edges.filter((e) => e.source !== id && e.target !== id);
      return { diagram: touch({ ...s.diagram, nodes, edges }) };
    }),
  removeEdge: (id) =>
    set((s) => {
      if (!s.diagram) return s;
      return { diagram: touch({ ...s.diagram, edges: s.diagram.edges.filter((e) => e.id !== id) }) };
    }),
  setName: (name) => set((s) => (s.diagram ? { diagram: touch({ ...s.diagram, name }) } : s)),
  setNodes: (nodes) => set((s) => (s.diagram ? { diagram: touch({ ...s.diagram, nodes }) } : s)),
  setEdges: (edges) => set((s) => (s.diagram ? { diagram: touch({ ...s.diagram, edges }) } : s)),
}));
