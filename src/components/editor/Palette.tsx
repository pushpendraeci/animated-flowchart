import { NODE_KINDS, type NodeKind } from "../../types";

const LABELS: Record<NodeKind, string> = {
  card: "Card", decision: "Decision", pill: "Start / End", label: "Label",
};

export function Palette() {
  return (
    <aside className="w-44 shrink-0 border-r border-gray-800 p-3 space-y-2">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Blocks</div>
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
          {LABELS[k]}
        </div>
      ))}
    </aside>
  );
}
