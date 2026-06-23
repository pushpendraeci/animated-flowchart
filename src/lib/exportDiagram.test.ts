import { diagramToJson, diagramFromJson, dataUrlToBlob, downloadDataUrl, exportFilter } from "./exportDiagram";
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

test("exportFilter drops editor chrome but keeps diagram content", () => {
  const make = (cls: string) => { const d = document.createElement("div"); d.className = cls; return d; };
  expect(exportFilter(make("react-flow__controls"))).toBe(false);
  expect(exportFilter(make("react-flow__panel"))).toBe(false);
  expect(exportFilter(make("react-flow__attribution"))).toBe(false);
  expect(exportFilter(make("node-delete-btn nodrag nopan absolute"))).toBe(false);
  expect(exportFilter(make("react-flow__node"))).toBe(true);
  expect(exportFilter(make("react-flow__edge"))).toBe(true);
  expect(exportFilter(document.createTextNode("x") as unknown as HTMLElement)).toBe(true);
});

test("dataUrlToBlob preserves mime for base64 and url-encoded data urls", async () => {
  const png = dataUrlToBlob("data:image/png;base64," + btoa("hi"));
  expect(png.type).toBe("image/png");

  const json = dataUrlToBlob("data:application/json," + encodeURIComponent('{"a":1}'));
  expect(json.type).toBe("application/json");
  expect(json.size).toBe('{"a":1}'.length); // decoded back to the original 7 bytes
});

test("downloadDataUrl attaches an anchor with the exact filename (extension preserved)", () => {
  const createObjectURL = vi.fn(() => "blob:mock");
  const revokeObjectURL = vi.fn();
  vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });

  const captured: { download: string; inDom: boolean }[] = [];
  const realCreate = document.createElement.bind(document);
  const spy = vi.spyOn(document, "createElement").mockImplementation((tag: any) => {
    const el = realCreate(tag) as HTMLElement;
    if (tag === "a") {
      (el as HTMLAnchorElement).click = () =>
        captured.push({ download: (el as HTMLAnchorElement).download, inDom: document.body.contains(el) });
    }
    return el;
  });

  downloadDataUrl("data:application/json," + encodeURIComponent("{}"), "My Flow.json");

  expect(captured).toHaveLength(1);
  expect(captured[0].download).toBe("My Flow.json");
  expect(captured[0].inDom).toBe(true); // anchor was attached to the document before click
  expect(createObjectURL).toHaveBeenCalledOnce();

  spy.mockRestore();
  vi.unstubAllGlobals();
});
