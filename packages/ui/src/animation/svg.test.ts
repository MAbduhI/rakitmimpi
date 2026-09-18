import { describe, expect, it } from "vitest";
import { motionPath, setDashoffset } from "./svg";

describe("SVG Utilities (1:1 with Anime.js)", () => {
  it("calculates path dashoffset and sets attributes", () => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path") as SVGPathElement;
    // mock getTotalLength
    path.getTotalLength = () => 450;

    const len = setDashoffset(path);
    expect(len).toBe(450);
    expect(path.getAttribute("stroke-dasharray")).toBe("450");
    expect(path.getAttribute("stroke-dashoffset")).toBe("450");
  });

  it("samples points along a motion path", () => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path") as SVGPathElement;
    path.getTotalLength = () => 100;
    path.getPointAtLength = ((dist: number) => ({
      x: dist * 2,
      y: dist * 3,
      z: 0,
      w: 1,
      toJSON: () => ({}),
      matrixTransform: () => ({} as any),
    })) as unknown as (distance: number) => DOMPoint;

    const sampler = motionPath(path);
    const p0 = sampler(0);
    expect(p0.x).toBe(0);
    expect(p0.y).toBe(0);

    const pHalf = sampler(0.5);
    expect(pHalf.x).toBe(100);
    expect(pHalf.y).toBe(150);
  });
});
