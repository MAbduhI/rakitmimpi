import type { Meta, StoryObj } from "@storybook/react-vite";
import { Motion } from "../../Atom/motion";
import { StaggerList } from "./stagger-list";

const meta = {
  title: "Components/Molecule/StaggerList",
  component: StaggerList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof StaggerList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinearStagger: Story = {
  render: () => (
    <StaggerList staggerDelay={80} className="w-80">
      {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"].map((text) => (
        <Motion.div
          key={text}
          preset="fade-up"
          className="rounded-md border border-border bg-surface p-3 font-medium text-primary shadow-xs"
        >
          {text}
        </Motion.div>
      ))}
    </StaggerList>
  ),
};
