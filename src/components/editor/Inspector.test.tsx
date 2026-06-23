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

test("shows placeholder when nothing selected", () => {
  render(<Inspector selection={null} />);
  expect(screen.getByText(/select a block/i)).toBeInTheDocument();
});
