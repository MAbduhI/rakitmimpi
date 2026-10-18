import { describe, expect, it } from "vitest";
import { getPresetVariant, motionPresets } from "./variants";

describe("Motion Variants Engine", () => {
  it("contains rich presets matching all major animation styles", () => {
    expect(motionPresets["fade-up"]).toBeDefined();
    expect(motionPresets["pop"]).toBeDefined();
    expect(motionPresets["flip-x"]).toBeDefined();
    expect(motionPresets["elastic-up"]).toBeDefined();
    expect(motionPresets["float"]).toBeDefined();
    expect(motionPresets["pulse"]).toBeDefined();
  });

  it("returns fallback for unknown preset", () => {
    const fallback = getPresetVariant("unknown" as any);
    expect(fallback).toEqual(motionPresets.fade);
  });

  it("configures proper transitions for presets", () => {
    const elastic = getPresetVariant("elastic-up");
    expect(elastic.transition?.easing).toBe("easeOutElastic");
    expect(elastic.transition?.duration).toBe(800);
  });
});
