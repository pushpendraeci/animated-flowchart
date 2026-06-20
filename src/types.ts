export const ACCENTS = ["neutral", "green", "pink", "blue", "amber"] as const;
export type Accent = (typeof ACCENTS)[number];

export const NODE_KINDS = ["card", "decision", "pill", "label"] as const;
export type NodeKind = (typeof NODE_KINDS)[number];

export const EDGE_ANIMATIONS = ["dots", "gradient", "none"] as const;
export type EdgeAnimation = (typeof EDGE_ANIMATIONS)[number];

export type PathKind = "bezier" | "smoothstep" | "straight";
export type LineStyle = "solid" | "dashed";

export interface NodeData {
  title: string;
  subtitle: string;
  accent: Accent;
  width: number;
  height: number;
  glow: boolean;
  [key: string]: unknown; // React Flow requires index signature on node data
}

export interface EdgeData {
  animation: EdgeAnimation;
  color: string;
  speed: number; // 1..5
  lineStyle: LineStyle;
  path: PathKind;
  label?: string;
  [key: string]: unknown;
}

export interface FlowNode {
  id: string;
  type: NodeKind;
  position: { x: number; y: number };
  data: NodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type: "animated";
  data: EdgeData;
}

export interface Diagram {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  theme: "dark";
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createEmptyDiagram(name: string): Diagram {
  const now = Date.now();
  return {
    id: uid(),
    name,
    createdAt: now,
    updatedAt: now,
    nodes: [],
    edges: [],
    theme: "dark",
  };
}
