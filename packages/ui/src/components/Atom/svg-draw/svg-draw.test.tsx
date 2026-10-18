import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SvgDraw } from "./svg-draw";

describe("SvgDraw Component (Atom)", () => {
  it("renders SVG path cleanly", () => {
    const { container } = render(
      <SvgDraw path="M10 80 Q 52.5 10, 95 80 T 180 80" />
    );
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute("d")).toBe("M10 80 Q 52.5 10, 95 80 T 180 80");
  });
});
