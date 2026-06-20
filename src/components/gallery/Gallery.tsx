import { useEffect, useState, useCallback } from "react";
import type { Diagram } from "../../types";
import { createEmptyDiagram } from "../../types";
import { listDiagrams, saveDiagram, deleteDiagram } from "../../db/library";
import { buildHdlTemplate } from "../../templates/hdl";

export function Gallery({ onOpen }: { onOpen: (d: Diagram) => void }) {
  const [items, setItems] = useState<Diagram[]>([]);

  const refresh = useCallback(async () => {
    let list = await listDiagrams();
    if (list.length === 0) {
      await saveDiagram(buildHdlTemplate());
      list = await listDiagrams();
    }
    setItems(list);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const newDiagram = async () => {
    const d = createEmptyDiagram("Untitled Flow");
    await saveDiagram(d);
    onOpen(d);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-sky-400">My Diagrams</h1>
        <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500"
          onClick={newDiagram}>+ New diagram</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((d) => (
          <div key={d.id} className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
            <div className="font-semibold">{d.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(d.updatedAt).toLocaleString()}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded border border-gray-700 px-3 py-1 text-sm hover:border-gray-500"
                onClick={() => onOpen(d)}>Open</button>
              <button className="rounded border border-gray-700 px-3 py-1 text-sm text-red-400 hover:border-red-500"
                onClick={async () => { await deleteDiagram(d.id); await refresh(); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
