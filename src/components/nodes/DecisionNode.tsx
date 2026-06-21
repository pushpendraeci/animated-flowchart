import { type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../types";
import { accentStyle } from "../../lib/theme";
import { DeleteButton, SideHandles } from "./shared";

/** Branch/decision point, drawn as a diamond (rotated square) with an upright
 *  centered label. Handles sit at the container edge midpoints, which line up
 *  with the diamond's four vertices. */
export function DecisionNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const s = accentStyle(data.accent);
  const side = Math.max(130, data.height + 56);
  return (
    <div className="group relative" style={{ width: side, height: side }}>
      <div
        className="absolute inset-[15%] rotate-45 rounded-lg"
        style={{
          border: `1px solid ${s.border}`,
          boxShadow: data.glow ? `0 0 18px ${s.glow}` : "none",
          background: "rgba(17,24,39,0.85)",
          outline: selected ? `2px solid ${s.border}` : "none",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
        <span className="font-bold text-sm leading-tight" style={{ color: s.title }}>{data.title}</span>
      </div>
      <DeleteButton id={id} className="top-1 right-1" />
      <SideHandles color={s.border} />
    </div>
  );
}
