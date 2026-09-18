import { resolveEasing } from "./easing";

export interface StaggerOptions {
  start?: number;
  from?: "first" | "last" | "center" | number;
  direction?: "normal" | "reverse";
  grid?: [number, number]; // [columns, rows]
  axis?: "x" | "y";
  easing?: string | ((t: number) => number);
}

export type StaggerFunction = (target: any, index: number, total: number) => number;

/**
 * 1:1 Anime.js stagger function generator.
 * Computes individual item delays based on item index, total count,
 * distribution curves, or 2D grid radial coordinate distances.
 */
export function stagger(val: number | [number, number], options: StaggerOptions = {}): StaggerFunction {
  const { start = 0, from = "first", direction = "normal", grid, axis, easing } = options;

  const easeFn = easing ? resolveEasing(easing).fn : null;

  return (_target: any, index: number, total: number): number => {
    if (total <= 1) return start;

    let fromIndex = 0;
    if (from === "first") fromIndex = 0;
    else if (from === "last") fromIndex = total - 1;
    else if (from === "center") fromIndex = (total - 1) / 2;
    else if (typeof from === "number") fromIndex = from;

    let distance = Math.abs(fromIndex - index);
    let maxDistance = Math.max(fromIndex, total - 1 - fromIndex);

    // ─── 2D GRID STAGGERING ─────────────────────────────────────────────────
    if (grid && Array.isArray(grid) && grid.length === 2) {
      const [cols, rows] = grid;
      const fromCol = fromIndex % cols;
      const fromRow = Math.floor(fromIndex / cols);

      const curCol = index % cols;
      const curRow = Math.floor(index / cols);

      const dX = curCol - fromCol;
      const dY = curRow - fromRow;

      if (axis === "x") {
        distance = Math.abs(dX);
        maxDistance = Math.max(fromCol, cols - 1 - fromCol);
      } else if (axis === "y") {
        distance = Math.abs(dY);
        maxDistance = Math.max(fromRow, rows - 1 - fromRow);
      } else {
        distance = Math.sqrt(dX * dX + dY * dY);
        // Calculate max radial corner distance
        const maxDistTopLeft = Math.sqrt(fromCol * fromCol + fromRow * fromRow);
        const maxDistTopRight = Math.sqrt((cols - 1 - fromCol) ** 2 + fromRow * fromRow);
        const maxDistBottomLeft = Math.sqrt(fromCol * fromCol + (rows - 1 - fromRow) ** 2);
        const maxDistBottomRight = Math.sqrt((cols - 1 - fromCol) ** 2 + (rows - 1 - fromRow) ** 2);
        maxDistance = Math.max(maxDistTopLeft, maxDistTopRight, maxDistBottomLeft, maxDistBottomRight) || 1;
      }
    }

    // Apply normalized easing curve to the distance ratio if specified
    const normalizedRatio = maxDistance > 0 ? distance / maxDistance : 0;
    const curvedRatio = easeFn ? easeFn(normalizedRatio) : normalizedRatio;

    let calculatedValue = 0;
    if (Array.isArray(val)) {
      const [min, max] = val;
      calculatedValue = min + (max - min) * curvedRatio;
    } else {
      calculatedValue = val * (maxDistance > 0 ? curvedRatio * maxDistance : distance);
    }

    const finalValue =
      direction === "reverse" ? start + (val as number) * maxDistance - calculatedValue : start + calculatedValue;
    return Math.max(0, finalValue);
  };
}
