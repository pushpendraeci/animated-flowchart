import { Fragment } from "react";
import { Handle, Position } from "@xyflow/react";
import { useEditorStore } from "../../store/editorStore";

/** Hover-reveal delete button. Parent must have the `group relative` classes. */
export function DeleteButton({ id, className = "-top-2 -right-2" }: { id: string; className?: string }) {
  const removeNode = useEditorStore((s) => s.removeNode);
  return (
    <button
      type="button"
      aria-label="Delete block"
      title="Delete block"
      className={`node-delete-btn nodrag nopan absolute ${className} z-10 flex h-5 w-5 items-center justify-center
        rounded-full border border-gray-600 bg-gray-900 text-xs leading-none text-gray-300
        opacity-0 transition group-hover:opacity-100 hover:border-red-500 hover:text-red-400`}
      onClick={(e) => { e.stopPropagation(); removeNode(id); }}
    >
      ×
    </button>
  );
}

const SIDES = [Position.Top, Position.Right, Position.Bottom, Position.Left];

/** Target + source handle on each side so any side can both send and receive
 *  connections (connectionMode="loose"); shared id lets stored edges resolve. */
export function SideHandles({ color }: { color: string }) {
  return (
    <>
      {SIDES.map((p) => (
        <Fragment key={p}>
          <Handle type="target" position={p} id={p} style={{ background: color, width: 8, height: 8 }} />
          <Handle type="source" position={p} id={p} style={{ background: color, width: 8, height: 8 }} />
        </Fragment>
      ))}
    </>
  );
}
