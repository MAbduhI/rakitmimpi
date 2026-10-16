import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Motion } from "../../Atom/motion";
import { StaggerList } from "./stagger-list";

describe("StaggerList Component (Molecule)", () => {
  it("renders all staggered children cleanly", () => {
    render(
      <StaggerList>
        <Motion.div key="1">Child A</Motion.div>
        <Motion.div key="2">Child B</Motion.div>
      </StaggerList>
    );
    expect(screen.getByText("Child A")).toBeInTheDocument();
    expect(screen.getByText("Child B")).toBeInTheDocument();
  });
});
