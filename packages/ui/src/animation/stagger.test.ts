import { describe, expect, it } from "vitest";
import { stagger } from "./stagger";

describe("Stagger Engine (1:1 with Anime.js)", () => {
  it("generates simple linear sequence delays", () => {
    const fn = stagger(100);
    expect(fn(null, 0, 5)).toBe(0);
    expect(fn(null, 1, 5)).toBe(100);
    expect(fn(null, 2, 5)).toBe(200);
    expect(fn(null, 3, 5)).toBe(300);
    expect(fn(null, 4, 5)).toBe(400);
  });

  it("staggers from center outwards symmetrically", () => {
    const fn = stagger(100, { from: "center" });
    // total 5 items: center is index 2
    expect(fn(null, 2, 5)).toBe(0);
    expect(fn(null, 1, 5)).toBe(100);
    expect(fn(null, 3, 5)).toBe(100);
    expect(fn(null, 0, 5)).toBe(200);
    expect(fn(null, 4, 5)).toBe(200);
  });

  it("staggers from last element", () => {
    const fn = stagger(50, { from: "last" });
    expect(fn(null, 4, 5)).toBe(0);
    expect(fn(null, 3, 5)).toBe(50);
    expect(fn(null, 0, 5)).toBe(200);
  });

  it("calculates 2D grid radial wave staggering", () => {
    // 3x3 grid (9 items)
    const fn = stagger(100, { grid: [3, 3], from: "center" });
    // center element (index 4) should have 0 delay
    expect(fn(null, 4, 9)).toBe(0);
    // cardinal neighbors (indices 1, 3, 5, 7) should have identical delay
    expect(fn(null, 1, 9)).toBeCloseTo(fn(null, 3, 9), 1);
    expect(fn(null, 5, 9)).toBeCloseTo(fn(null, 7, 9), 1);
    // corner elements (0, 2, 6, 8) should have equal and greatest delay
    expect(fn(null, 0, 9)).toBeCloseTo(fn(null, 8, 9), 1);
    expect(fn(null, 0, 9)).toBeGreaterThan(fn(null, 1, 9));
  });

  it("constrains grid staggering to a specific axis", () => {
    // Stagger along x axis only in a 3x3 grid
    const fnX = stagger(100, { grid: [3, 3], axis: "x", from: "first" });
    // Column 0 (indices 0, 3, 6) must all have delay 0
    expect(fnX(null, 0, 9)).toBe(0);
    expect(fnX(null, 3, 9)).toBe(0);
    expect(fnX(null, 6, 9)).toBe(0);

    // Column 1 (indices 1, 4, 7) must all have delay 100
    expect(fnX(null, 1, 9)).toBe(100);
    expect(fnX(null, 4, 9)).toBe(100);
    expect(fnX(null, 7, 9)).toBe(100);
  });
});
