/**
 * SVG Path Utilities matching Anime.js 1:1.
 * Provides line-drawing stroke setup and motion path coordinate generation.
 */

export function setDashoffset(element: SVGPathElement | SVGGeometryElement | null): number {
  if (!element || typeof element.getTotalLength !== "function") {
    return 0;
  }
  const length = element.getTotalLength();
  element.setAttribute("stroke-dasharray", `${length}`);
  element.setAttribute("stroke-dashoffset", `${length}`);
  return length;
}

export interface MotionPoint {
  x: number;
  y: number;
  angle: number;
}

export type MotionPathFunction = (progress: number) => MotionPoint;

/**
 * Creates a motion path sampler from an SVG path element or selector.
 * Returns { x, y, angle } at normalized progress (0 to 1).
 */
export function motionPath(pathTarget: string | SVGGeometryElement): MotionPathFunction {
  let pathEl: SVGGeometryElement | null = null;

  if (typeof pathTarget === "string") {
    if (typeof document !== "undefined") {
      pathEl = document.querySelector<SVGGeometryElement>(pathTarget);
    }
  } else {
    pathEl = pathTarget;
  }

  const totalLength = pathEl && typeof pathEl.getTotalLength === "function" ? pathEl.getTotalLength() : 100;

  return (progress: number): MotionPoint => {
    if (!pathEl || typeof pathEl.getPointAtLength !== "function") {
      return { x: progress * 100, y: progress * 100, angle: 0 };
    }

    const clampedProgress = Math.max(0, Math.min(1, progress));
    const currentDist = clampedProgress * totalLength;
    const point = pathEl.getPointAtLength(currentDist);

    // Calculate tangent angle by sampling a micro-step forward
    const deltaDist = Math.min(currentDist + 1, totalLength);
    const nextPoint = pathEl.getPointAtLength(deltaDist);
    const dX = nextPoint.x - point.x;
    const dY = nextPoint.y - point.y;
    const angle = (Math.atan2(dY, dX) * 180) / Math.PI;

    return {
      x: point.x,
      y: point.y,
      angle,
    };
  };
}
