import { type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../types";
import { accentStyle } from "../../lib/theme";
import { DeleteButton, SideHandles } from "./shared";

/** Start / End terminator, drawn as a pill (stadium) with a single centered label. */
export function PillNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const s = accentStyle(data.accent);
  return (
    <div
      className="group relative flex items-center justify-center rounded-full px-7 py-3 text-center backdrop-blur"
      style={{
        minWidth: 140, minHeight: 52,
        border: `1px solid ${s.border}`,
        boxShadow: data.glow ? `0 0 18px ${s.glow}` : "none",
        background: "rgba(17,24,39,0.85)",
        outline: selected ? `2px solid ${s.border}` : "none",
      }}
    >
      <DeleteButton id={id} />
      <span className="font-bold text-sm" style={{ color: s.title }}>{data.title}</span>
      <SideHandles color={s.border} />
    </div>
  );
}
