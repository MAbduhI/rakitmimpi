import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Motion } from "./motion";

describe("Motion Component (Atom)", () => {
  it("renders children cleanly", () => {
    render(<Motion.div>Animated Content</Motion.div>);
    expect(screen.getByText("Animated Content")).toBeInTheDocument();
  });

  it("applies preset configuration on mount", () => {
    const { container } = render(
      <Motion.div preset="fade-up" className="test-box">
        Box
      </Motion.div>
    );
    const el = container.querySelector(".test-box") as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it("supports HTML element types like button and span", () => {
    render(<Motion.button>Click Me</Motion.button>);
    const btn = screen.getByRole("button", { name: "Click Me" });
    expect(btn).toBeInTheDocument();
  });
});
