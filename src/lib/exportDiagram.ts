import { toPng, toSvg } from "html-to-image";
import type { Diagram } from "../types";

export function diagramToJson(d: Diagram): string {
  return JSON.stringify(d, null, 2);
}

export function diagramFromJson(text: string): Diagram {
  const obj = JSON.parse(text);
  if (
    !obj || typeof obj.id !== "string" || typeof obj.name !== "string" ||
    !Array.isArray(obj.nodes) || !Array.isArray(obj.edges)
  ) {
    throw new Error("Invalid diagram file");
  }
  return obj as Diagram;
}

export async function exportImage(el: HTMLElement, format: "png" | "svg"): Promise<string> {
  const opts = { backgroundColor: "#0a0e1a", pixelRatio: 2 };
  return format === "png" ? toPng(el, opts) : toSvg(el, opts);
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
