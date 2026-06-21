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

/** Convert a data: URL (base64 or URL-encoded) into a Blob, preserving its MIME type. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(",");
  const header = dataUrl.slice(0, comma);
  const body = dataUrl.slice(comma + 1);
  const mime = header.match(/data:([^;,]+)/)?.[1] ?? "application/octet-stream";
  if (header.includes(";base64")) {
    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(body)], { type: mime });
}

/**
 * Download a data: URL with the given filename. Routes through a Blob object URL
 * and a DOM-attached anchor so the filename (including its extension) is honored
 * reliably across browsers — a detached anchor on a data: URL is not.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const url = URL.createObjectURL(dataUrlToBlob(dataUrl));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
