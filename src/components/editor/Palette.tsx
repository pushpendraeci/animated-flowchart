import { NODE_KINDS, NODE_LABELS } from "../../types";

export function Palette() {
  return (
    <aside className="w-48 shrink-0 overflow-y-auto border-r border-gray-800 p-3">
      <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Blocks</div>
      <div className="space-y-1.5">
        {NODE_KINDS.map((k) => (
          <div
            key={k}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/flow-kind", k);
              e.dataTransfer.effectAllowed = "move";
            }}
            className="cursor-grab rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm hover:border-gray-500"
          >
            {NODE_LABELS[k]}
          </div>
        ))}
      </div>
    </aside>
  );
}
