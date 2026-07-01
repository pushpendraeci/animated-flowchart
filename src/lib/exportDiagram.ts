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

// React Flow UI chrome that should not appear in an exported image.
const EXPORT_EXCLUDE = [
  "react-flow__controls",
  "react-flow__panel",
  "react-flow__attribution",
  "react-flow__minimap",
  "node-delete-btn",
];

/** html-to-image filter: drop the editor chrome so exports show only the diagram. */
export function exportFilter(node: HTMLElement): boolean {
  const cl = node.classList;
  if (!cl) return true;
  return !EXPORT_EXCLUDE.some((c) => cl.contains(c));
}

export interface Bounds { x: number; y: number; width: number; height: number; }

/** Bounding box (in flow coordinates) that encloses every node, plus padding.
 *  Used so exports capture the whole diagram, not just the on-screen viewport. */
export function diagramBounds(
  nodes: { position: { x: number; y: number }; data: { width?: number; height?: number } }[],
  pad = 100,
): Bounds {
  if (!nodes.length) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    const w = n.data.width ?? 0, h = n.data.height ?? 0;
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + w);
    maxY = Math.max(maxY, n.position.y + h);
  }
  return { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 };
}

/**
 * Render the entire diagram to an image. Pass the `.react-flow__viewport`
 * element and the flow-coordinate bounds of all nodes; the viewport is
 * re-transformed to frame the full diagram at 1:1 so nothing is clipped by
 * the on-screen pan/zoom.
 */
export async function exportImage(
  viewport: HTMLElement,
  format: "png" | "svg",
  bounds: Bounds,
): Promise<string> {
  const width = Math.ceil(bounds.width) || viewport.clientWidth;
  const height = Math.ceil(bounds.height) || viewport.clientHeight;
  const opts = {
    backgroundColor: "#0a0e1a",
    pixelRatio: 2,
    filter: exportFilter,
    width,
    height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${-bounds.x}px, ${-bounds.y}px) scale(1)`,
      transformOrigin: "top left",
    },
  };
  return format === "png" ? toPng(viewport, opts) : toSvg(viewport, opts);
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
