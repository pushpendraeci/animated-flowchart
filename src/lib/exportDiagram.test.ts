import { diagramToJson, diagramFromJson } from "./exportDiagram";
import { createEmptyDiagram } from "../types";

test("round-trips a diagram through JSON", () => {
  const d = createEmptyDiagram("Round");
  const restored = diagramFromJson(diagramToJson(d));
  expect(restored.name).toBe("Round");
  expect(restored.id).toBe(d.id);
});

test("rejects invalid JSON", () => {
  expect(() => diagramFromJson("{}")).toThrow("Invalid diagram file");
  expect(() => diagramFromJson("not json")).toThrow();
});
