import type { Accent } from "../types";

const MAP: Record<Accent, { border: string; glow: string; title: string }> = {
  neutral: { border: "#3b4660", glow: "rgba(96,118,165,0.35)", title: "#e5e7eb" },
  green: { border: "#34d399", glow: "rgba(52,211,153,0.45)", title: "#6ee7b7" },
  pink: { border: "#ec4899", glow: "rgba(236,72,153,0.45)", title: "#f9a8d4" },
  blue: { border: "#60a5fa", glow: "rgba(96,165,250,0.45)", title: "#93c5fd" },
  amber: { border: "#fbbf24", glow: "rgba(251,191,36,0.45)", title: "#fcd34d" },
};

export function accentStyle(accent: Accent) {
  return MAP[accent];
}
