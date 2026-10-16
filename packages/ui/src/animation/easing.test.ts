import { describe, expect, it } from "vitest";
import { cubicBezier, easings, resolveEasing, spring, steps } from "./easing";

describe("Easing Engine", () => {
  it("evaluates penner curves at boundaries (0 and 1)", () => {
    for (const [name, fn] of Object.entries(easings)) {
      expect(fn(0), `${name}(0) should be near 0`).toBeCloseTo(0, 1);
      expect(fn(1), `${name}(1) should be near 1`).toBeCloseTo(1, 1);
    }
  });

  it("calculates accurate cubic-bezier curves", () => {
    // Ease curve (0.25, 0.1, 0.25, 1.0)
    const ease = cubicBezier(0.25, 0.1, 0.25, 1.0);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBeGreaterThan(0.5);
  });

  it("calculates stepped transitions", () => {
    const step4 = steps(4);
    expect(step4(0)).toBe(0);
    expect(step4(0.24)).toBe(0);
    expect(step4(0.26)).toBe(0.25);
    expect(step4(0.51)).toBe(0.5);
    expect(step4(0.76)).toBe(0.75);
    expect(step4(1)).toBe(1);
  });

  it("calculates analytical damped spring physics", () => {
    const { ease, duration } = spring({ mass: 1, stiffness: 100, damping: 10 });
    expect(duration).toBeGreaterThanOrEqual(250);
    expect(ease(0)).toBeCloseTo(0, 2);
    expect(ease(1)).toBe(1);
  });

  it("resolves string easing declarations seamlessly", () => {
    const r1 = resolveEasing("easeOutExpo");
    expect(r1.fn(0.5)).toBeGreaterThan(0.9);

    const r2 = resolveEasing("cubicBezier(0.4, 0, 0.2, 1)");
    expect(r2.fn(0)).toBe(0);
    expect(r2.fn(1)).toBe(1);

    const r3 = resolveEasing("spring(1, 120, 14, 0)");
    expect(r3.duration).toBeDefined();
  });
});
