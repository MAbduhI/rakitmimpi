import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimateNumber } from "./animate-number";

describe("AnimateNumber Component (Atom)", () => {
  it("renders with initial/from value formatted", () => {
    render(<AnimateNumber from={0} value={100} prefix="$" />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it("applies custom formatter cleanly", () => {
    render(
      <AnimateNumber
        from={50}
        value={50}
        format={(v) => `Rp ${Math.round(v).toLocaleString("id-ID")}`}
      />
    );
    expect(screen.getByText(/Rp 50/)).toBeInTheDocument();
  });
});
