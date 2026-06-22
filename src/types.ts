export const ACCENTS = ["neutral", "green", "pink", "blue", "amber"] as const;
export type Accent = (typeof ACCENTS)[number];

export const NODE_KINDS = [
  "card", "decision", "pill", "label",
  "process", "io", "database", "document", "multidoc", "predefined",
  "preparation", "connector", "manualinput", "delay", "manualop", "offpage",
] as const;
export type NodeKind = (typeof NODE_KINDS)[number];

/** Human-readable palette label per node kind. */
export const NODE_LABELS: Record<NodeKind, string> = {
  card: "Card",
  decision: "Decision",
  pill: "Start / End",
  label: "Label",
  process: "Process",
  io: "Input / Output",
  database: "Database",
  document: "Document",
  multidoc: "Multi-document",
  predefined: "Predefined Process",
  preparation: "Preparation",
  connector: "Connector",
  manualinput: "Manual Input",
  delay: "Delay",
  manualop: "Manual Operation",
  offpage: "Off-page Connector",
};

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

/** Default data (title + sensible shape size) for a freshly-dropped node of a kind. */
export function defaultNodeData(kind: NodeKind): NodeData {
  const presets: Record<NodeKind, { title: string; subtitle?: string; width: number; height: number }> = {
    card: { title: "New Block", subtitle: "Subtitle", width: 220, height: 88 },
    decision: { title: "Decision?", width: 150, height: 150 },
    pill: { title: "Start", width: 150, height: 56 },
    label: { title: "Label", width: 120, height: 40 },
    process: { title: "Process", width: 180, height: 80 },
    io: { title: "Input / Output", width: 190, height: 80 },
    database: { title: "Database", width: 150, height: 120 },
    document: { title: "Document", width: 180, height: 100 },
    multidoc: { title: "Documents", width: 184, height: 110 },
    predefined: { title: "Subroutine", width: 190, height: 80 },
    preparation: { title: "Preparation", width: 190, height: 90 },
    connector: { title: "A", width: 64, height: 64 },
    manualinput: { title: "Manual Input", width: 180, height: 84 },
    delay: { title: "Delay", width: 170, height: 80 },
    manualop: { title: "Manual Op", width: 180, height: 80 },
    offpage: { title: "Off-page", width: 150, height: 96 },
  };
  const p = presets[kind];
  return { title: p.title, subtitle: p.subtitle ?? "", accent: "neutral", width: p.width, height: p.height, glow: true };
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
