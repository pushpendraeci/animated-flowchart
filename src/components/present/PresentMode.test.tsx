import { render, screen, fireEvent } from "@testing-library/react";
import { PresentMode } from "./PresentMode";
import { useEditorStore } from "../../store/editorStore";
import { buildHdlTemplate } from "../../templates/hdl";

test("shows the diagram title and exits on Escape", () => {
  useEditorStore.getState().loadDiagram(buildHdlTemplate());
  const onExit = vi.fn();
  render(<PresentMode onExit={onExit} />);
  expect(screen.getByText("HDL Customer Lifecycle")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(onExit).toHaveBeenCalled();
});

test("Exit button calls onExit", () => {
  useEditorStore.getState().loadDiagram(buildHdlTemplate());
  const onExit = vi.fn();
  render(<PresentMode onExit={onExit} />);
  fireEvent.click(screen.getByText(/exit/i));
  expect(onExit).toHaveBeenCalled();
});
