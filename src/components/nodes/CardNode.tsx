import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../types";
import { accentStyle } from "../../lib/theme";

export function CardNode({ data, selected }: NodeProps & { data: NodeData }) {
  const s = accentStyle(data.accent);
  const handles = [Position.Top, Position.Right, Position.Bottom, Position.Left];
  return (
    <div
      style={{
        width: data.width, minHeight: data.height,
        border: `1px solid ${s.border}`,
        boxShadow: data.glow ? `0 0 18px ${s.glow}` : "none",
        background: "rgba(17,24,39,0.85)",
        outline: selected ? `2px solid ${s.border}` : "none",
      }}
      className="rounded-xl px-4 py-3 backdrop-blur"
    >
      <div className="font-bold text-sm" style={{ color: s.title }}>{data.title}</div>
      <div className="text-xs text-gray-400 mt-1">{data.subtitle}</div>
      {handles.map((p) => (
        <Handle key={p} type="source" position={p} id={p}
          style={{ background: s.border, width: 8, height: 8 }} />
      ))}
    </div>
  );
}
