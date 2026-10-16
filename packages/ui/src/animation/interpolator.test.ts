import { describe, expect, it } from "vitest";
import {
  buildTransformString,
  interpolateColor,
  parseColor,
  parseValue,
  resolveRelativeValue,
} from "./interpolator";

describe("Interpolator Engine", () => {
  it("parses numbers with units and relative operators", () => {
    expect(parseValue(150)).toEqual({ num: 150, unit: "" });
    expect(parseValue("250px")).toEqual({ num: 250, unit: "px", operator: undefined });
    expect(parseValue("+=50%")).toEqual({ num: 50, unit: "%", operator: "+=" });
    expect(parseValue("-=180deg")).toEqual({ num: 180, unit: "deg", operator: "-=" });
    expect(parseValue("*=1.5")).toEqual({ num: 1.5, unit: "", operator: "*=" });
  });

  it("resolves relative mathematical operations", () => {
    expect(resolveRelativeValue(100, { num: 50, unit: "px", operator: "+=" })).toBe(150);
    expect(resolveRelativeValue(100, { num: 40, unit: "px", operator: "-=" })).toBe(60);
    expect(resolveRelativeValue(100, { num: 2.5, unit: "", operator: "*=" })).toBe(250);
  });

  it("interpolates colors cleanly between Hex and RGBA", () => {
    expect(parseColor("#ffffff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("rgba(0, 0, 0, 0.5)")).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });

    const midColor = interpolateColor("#000000", "#ffffff", 0.5);
    expect(midColor).toBe("rgba(128, 128, 128, 1.000)");
  });

  it("builds hardware-accelerated 3D transform strings", () => {
    const map = new Map<string, { value: number; unit: string }>();
    map.set("translateX", { value: 100, unit: "px" });
    map.set("translateY", { value: 50, unit: "px" });
    map.set("rotate", { value: 45, unit: "deg" });
    map.set("scale", { value: 1.2, unit: "" });

    const tf = buildTransformString(map);
    expect(tf).toContain("translate3d(100.0000px, 50.0000px, 0px)");
    expect(tf).toContain("rotate(45.0000deg)");
    expect(tf).toContain("scale3d(1.2000, 1.2000, 1.0000)");
  });
});
