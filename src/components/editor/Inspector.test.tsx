import { render, screen, fireEvent } from "@testing-library/react";
import { Inspector } from "./Inspector";
import { useEditorStore } from "../../store/editorStore";
import { createEmptyDiagram } from "../../types";

test("editing node title updates the store", () => {
  useEditorStore.getState().loadDiagram(createEmptyDiagram("T"));
  useEditorStore.getState().addNode("card", { x: 0, y: 0 });
  const id = useEditorStore.getState().diagram!.nodes[0].id;
  render(<Inspector selection={{ kind: "node", id }} />);
  fireEvent.change(screen.getByDisplayValue("New Block"), { target: { value: "Renamed" } });
  expect(useEditorStore.getState().diagram!.nodes[0].data.title).toBe("Renamed");
});

test("editing width/height resizes the node in the store", () => {
  useEditorStore.getState().loadDiagram(createEmptyDiagram("T"));
  useEditorStore.getState().addNode("card", { x: 0, y: 0 });
  const id = useEditorStore.getState().diagram!.nodes[0].id;
  render(<Inspector selection={{ kind: "node", id }} />);
  fireEvent.change(screen.getByLabelText("width"), { target: { value: "300" } });
  fireEvent.change(screen.getByLabelText("height"), { target: { value: "120" } });
  const n = useEditorStore.getState().diagram!.nodes[0].data;
  expect(n.width).toBe(300);
  expect(n.height).toBe(120);
});

test("delete connector removes the edge from the store and clears selection", () => {
  useEditorStore.getState().loadDiagram(createEmptyDiagram("T"));
  useEditorStore.getState().addNode("card", { x: 0, y: 0 });
  useEditorStore.getState().addNode("card", { x: 100, y: 0 });
  const [a, b] = useEditorStore.getState().diagram!.nodes;
  useEditorStore.getState().addEdge({ source: a.id, target: b.id });
  const edgeId = useEditorStore.getState().diagram!.edges[0].id;
  let cleared = false;
  render(<Inspector selection={{ kind: "edge", id: edgeId }} onClearSelection={() => { cleared = true; }} />);
  fireEvent.click(screen.getByLabelText("Delete connector"));
  expect(useEditorStore.getState().diagram!.edges).toHaveLength(0);
  expect(cleared).toBe(true);
});

test("shows placeholder when nothing selected", () => {
  render(<Inspector selection={null} />);
  expect(screen.getByText(/select a block/i)).toBeInTheDocument();
});
