import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAnimate, useSpring, useTimeline } from "./hooks";

describe("React Animation Hooks", () => {
  it("useAnimate returns ref and start function", () => {
    const { result } = renderHook(() => useAnimate());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.animate).toBe("function");
  });

  it("useTimeline returns an active Timeline instance", () => {
    const { result } = renderHook(() => useTimeline());
    expect(result.current).toBeDefined();
    expect(typeof result.current.add).toBe("function");
    expect(typeof result.current.seek).toBe("function");
  });

  it("useSpring tracks animated values", () => {
    const { result } = renderHook(() => useSpring(100));
    expect(result.current).toBe(100);
  });
});
