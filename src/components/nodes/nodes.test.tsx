import { render, screen, fireEvent } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { nodeTypes } from "./index";
import { CardNode } from "./CardNode";
import { DecisionNode } from "./DecisionNode";
import { PillNode } from "./PillNode";
import { LabelNode } from "./LabelNode";
import { useEditorStore } from "../../store/editorStore";
import { createEmptyDiagram, type NodeData, type NodeKind } from "../../types";

const DATA: NodeData = { title: "My Block", subtitle: "Sub", accent: "blue", width: 220, height: 88, glow: true };

function renderNode(Comp: any) {
  return render(
    <ReactFlowProvider>
      <Comp id="n1" data={DATA} selected={false} type="card"
        dragging={false} zIndex={0} isConnectable positionAbsoluteX={0} positionAbsoluteY={0}
        draggable={false} selectable={false} deletable={false} />
    </ReactFlowProvider> as any
  );
}

test("nodeTypes maps each kind to a distinct component", () => {
  expect(nodeTypes.card).toBe(CardNode);
  expect(nodeTypes.decision).toBe(DecisionNode);
  expect(nodeTypes.pill).toBe(PillNode);
  expect(nodeTypes.label).toBe(LabelNode);
  expect(new Set(Object.values(nodeTypes)).size).toBe(4);
});

test.each([
  ["decision", DecisionNode],
  ["pill", PillNode],
  ["label", LabelNode],
] as const)("%s node renders its title and can be deleted", (kind, Comp) => {
  const d = createEmptyDiagram("T");
  d.nodes = [{ id: "n1", type: kind as NodeKind, position: { x: 0, y: 0 }, data: { ...DATA } }];
  useEditorStore.getState().loadDiagram(d);
  renderNode(Comp);
  expect(screen.getByText("My Block")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText(/delete block/i));
  expect(useEditorStore.getState().diagram!.nodes).toHaveLength(0);
});
