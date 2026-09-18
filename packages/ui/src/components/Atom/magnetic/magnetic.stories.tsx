import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Magnetic } from "./magnetic";

const meta = {
  title: "Components/Atom/Magnetic",
  component: Magnetic,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Magnetic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MagneticButton: Story = {
  args: {
    children: (
      <Button variant="primary" size="lg" className="shadow-lg">
        Hover Around Me
      </Button>
    ),
  },
};
