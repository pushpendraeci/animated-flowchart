import { Fragment } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeData } from "../../types";
import { accentStyle } from "../../lib/theme";
import { useEditorStore } from "../../store/editorStore";

export function CardNode({ id, data, selected }: NodeProps & { data: NodeData }) {
  const s = accentStyle(data.accent);
  const removeNode = useEditorStore((state) => state.removeNode);
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
      className="group relative rounded-xl px-4 py-3 backdrop-blur"
    >
      <button
        type="button"
        aria-label="Delete block"
        title="Delete block"
        className="nodrag nopan absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center
          rounded-full border border-gray-600 bg-gray-900 text-xs leading-none text-gray-300
          opacity-0 transition group-hover:opacity-100 hover:border-red-500 hover:text-red-400"
        onClick={(e) => { e.stopPropagation(); removeNode(id); }}
      >
        ×
      </button>
      <div className="font-bold text-sm" style={{ color: s.title }}>{data.title}</div>
      <div className="text-xs text-gray-400 mt-1">{data.subtitle}</div>
      {handles.map((p) => (
        <Fragment key={p}>
          {/* target + source at each side so any handle can both send and receive
              (connectionMode="loose"); shared id lets stored edges resolve on render */}
          <Handle type="target" position={p} id={p}
            style={{ background: s.border, width: 8, height: 8 }} />
          <Handle type="source" position={p} id={p}
            style={{ background: s.border, width: 8, height: 8 }} />
        </Fragment>
      ))}
    </div>
  );
}
