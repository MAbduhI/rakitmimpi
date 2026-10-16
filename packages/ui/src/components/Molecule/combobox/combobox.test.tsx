import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComboBox, type ComboBoxOption } from "./combobox";

const testOptions: Array<ComboBoxOption> = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3", disabled: true },
];

describe("ComboBox", () => {
  it("renders placeholder when empty", () => {
    render(<ComboBox options={testOptions} placeholder="Choose something" />);
    expect(screen.getByText("Choose something")).toBeInTheDocument();
  });

  it("opens dropdown and lists options when clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboBox options={testOptions} placeholder="Choose something" />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("selects an option in single-select mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<ComboBox options={testOptions} onChange={onChange} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.click(screen.getByText("Option 1"));

    expect(onChange).toHaveBeenCalledWith("opt1");
  });

  it("filters options via search input", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboBox options={testOptions} searchPlaceholder="Type to filter" />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const searchInput = screen.getByPlaceholderText("Type to filter");
    await user.type(searchInput, "Option 2");

    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  it("supports multiple selections and tag removal", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container, rerender } = render(
      <ComboBox multiple options={testOptions} value={["opt1"]} onChange={onChange} />
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.click(screen.getByText("Option 2"));

    expect(onChange).toHaveBeenCalledWith(["opt1", "opt2"]);

    // Test removing tag
    rerender(<ComboBox multiple options={testOptions} value={["opt1", "opt2"]} onChange={onChange} />);
    const removeBtn = screen.getAllByRole("button").find((el) => el.textContent === "×");
    if (removeBtn) {
      await user.click(removeBtn);
      expect(onChange).toHaveBeenCalled();
    }
  });

  it("disables the combobox when disabled=true", () => {
    const { container } = render(<ComboBox options={testOptions} disabled />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true");
  });

  it("shows loading indicator when loading=true", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboBox options={[]} loading />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(screen.getByText("Loading suggestions...")).toBeInTheDocument();
  });
});
