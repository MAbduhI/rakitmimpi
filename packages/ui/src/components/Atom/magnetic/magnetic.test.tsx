import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Magnetic } from "./magnetic";

describe("Magnetic Component (Atom)", () => {
  it("renders magnetic wrapper and children", () => {
    render(
      <Magnetic>
        <button>Magnetic Button</button>
      </Magnetic>
    );
    expect(screen.getByRole("button", { name: "Magnetic Button" })).toBeInTheDocument();
  });
});
