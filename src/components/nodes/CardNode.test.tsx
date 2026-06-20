import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { CardNode } from "./CardNode";

function renderNode(data: any) {
  return render(
    <ReactFlowProvider>
      <CardNode id="n1" data={data} selected={false} type="card"
        dragging={false} zIndex={0} isConnectable positionAbsoluteX={0} positionAbsoluteY={0} />
    </ReactFlowProvider> as any
  );
}

test("renders title and subtitle", () => {
  renderNode({ title: "1. Engagement", subtitle: "Touchpoints", accent: "green", width: 220, height: 88, glow: true });
  expect(screen.getByText("1. Engagement")).toBeInTheDocument();
  expect(screen.getByText("Touchpoints")).toBeInTheDocument();
});
