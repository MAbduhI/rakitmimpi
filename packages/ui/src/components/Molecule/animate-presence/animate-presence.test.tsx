import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Motion } from "../../Atom/motion";
import { AnimatePresence } from "./animate-presence";

describe("AnimatePresence Component (Molecule)", () => {
  it("renders active children", () => {
    render(
      <AnimatePresence>
        <Motion.div key="item-1">Item 1</Motion.div>
      </AnimatePresence>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });
});
