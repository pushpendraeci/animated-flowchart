import { render, screen, fireEvent } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { CardNode } from "./CardNode";
import { useEditorStore } from "../../store/editorStore";
import { createEmptyDiagram, type NodeData } from "../../types";

const DATA: NodeData = { title: "1. Engagement", subtitle: "Touchpoints", accent: "green", width: 220, height: 88, glow: true };

function renderNode(data: any, id = "n1") {
  return render(
    <ReactFlowProvider>
      <CardNode id={id} data={data} selected={false} type="card"
        dragging={false} zIndex={0} isConnectable positionAbsoluteX={0} positionAbsoluteY={0}
        draggable={false} selectable={false} deletable={false} />
    </ReactFlowProvider> as any
  );
}

test("renders title and subtitle", () => {
  renderNode(DATA);
  expect(screen.getByText("1. Engagement")).toBeInTheDocument();
  expect(screen.getByText("Touchpoints")).toBeInTheDocument();
});

test("delete button removes the node from the store", () => {
  const d = createEmptyDiagram("T");
  d.nodes = [{ id: "n1", type: "card", position: { x: 0, y: 0 }, data: { ...DATA } }];
  useEditorStore.getState().loadDiagram(d);
  renderNode(DATA);
  fireEvent.click(screen.getByLabelText(/delete block/i));
  expect(useEditorStore.getState().diagram!.nodes).toHaveLength(0);
});
