import {
  BaseEdge, getBezierPath, getSmoothStepPath, getStraightPath,
  type EdgeProps,
} from "@xyflow/react";
import type { EdgeData } from "../../types";

function durationFor(speed: number): number {
  // speed 1 (slow) -> 4s, speed 5 (fast) -> 0.8s
  const clamped = Math.min(5, Math.max(1, speed));
  return 4.8 - clamped * 0.8;
}

export function AnimatedEdge(props: EdgeProps & { data: EdgeData }) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;
  const common = { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition };
  const [path] =
    data.path === "bezier" ? getBezierPath(common)
    : data.path === "straight" ? getStraightPath(common)
    : getSmoothStepPath(common);

  const dur = `${durationFor(data.speed)}s`;
  const dash = data.lineStyle === "dashed" ? "6 6" : undefined;
  const gradId = `grad-${id}`;

  if (data.animation === "gradient") {
    return (
      <>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={data.color} stopOpacity="0.1" />
            <stop offset="50%" stopColor={data.color} stopOpacity="1" />
            <stop offset="100%" stopColor={data.color} stopOpacity="0.1" />
            <animateTransform attributeName="gradientTransform" type="translate"
              from="-1 0" to="1 0" dur={dur} repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <BaseEdge id={id} path={path}
          style={{ stroke: `url(#${gradId})`, strokeWidth: 3, strokeDasharray: dash,
            filter: `drop-shadow(0 0 4px ${data.color})` }} />
      </>
    );
  }

  return (
    <>
      <BaseEdge id={id} path={path}
        style={{ stroke: data.color, strokeWidth: 2, opacity: 0.55, strokeDasharray: dash }} />
      {data.animation === "dots" && (
        <circle r={4} fill={data.color} style={{ filter: `drop-shadow(0 0 6px ${data.color})` }}>
          <animateMotion dur={dur} repeatCount="indefinite" path={path} />
        </circle>
      )}
    </>
  );
}
