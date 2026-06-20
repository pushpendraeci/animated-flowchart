import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { Canvas } from "./Canvas";
import { useEditorStore } from "../../store/editorStore";
import { buildHdlTemplate } from "../../templates/hdl";

test("renders nodes from the loaded diagram", () => {
  useEditorStore.getState().loadDiagram(buildHdlTemplate());
  render(
    <ReactFlowProvider>
      <div style={{ width: 800, height: 600 }}>
        <Canvas onSelect={() => {}} />
      </div>
    </ReactFlowProvider>
  );
  expect(screen.getByText("1. Customer Engagement")).toBeInTheDocument();
});
