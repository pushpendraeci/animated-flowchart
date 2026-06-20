import { beforeEach, expect, test } from "vitest";
import { useEditorStore } from "./editorStore";
import { createEmptyDiagram } from "../types";

beforeEach(() => {
  useEditorStore.getState().loadDiagram(createEmptyDiagram("T"));
});

test("addNode appends a card node at the given position", () => {
  useEditorStore.getState().addNode("card", { x: 10, y: 20 });
  const nodes = useEditorStore.getState().diagram!.nodes;
  expect(nodes).toHaveLength(1);
  expect(nodes[0].type).toBe("card");
  expect(nodes[0].position).toEqual({ x: 10, y: 20 });
});

test("updateNodeData patches data and bumps updatedAt", () => {
  const s = useEditorStore.getState();
  s.addNode("card", { x: 0, y: 0 });
  const id = useEditorStore.getState().diagram!.nodes[0].id;
  const before = useEditorStore.getState().diagram!.updatedAt;
  s.updateNodeData(id, { title: "Hello" });
  const d = useEditorStore.getState().diagram!;
  expect(d.nodes[0].data.title).toBe("Hello");
  expect(d.updatedAt).toBeGreaterThanOrEqual(before);
});

test("removeNode also removes its connected edges", () => {
  const s = useEditorStore.getState();
  s.addNode("card", { x: 0, y: 0 });
  s.addNode("card", { x: 1, y: 1 });
  const [a, b] = useEditorStore.getState().diagram!.nodes;
  s.addEdge({ source: a.id, target: b.id });
  expect(useEditorStore.getState().diagram!.edges).toHaveLength(1);
  s.removeNode(a.id);
  expect(useEditorStore.getState().diagram!.edges).toHaveLength(0);
  expect(useEditorStore.getState().diagram!.nodes).toHaveLength(1);
});
