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

test("shows placeholder when nothing selected", () => {
  render(<Inspector selection={null} />);
  expect(screen.getByText(/select a block/i)).toBeInTheDocument();
});
