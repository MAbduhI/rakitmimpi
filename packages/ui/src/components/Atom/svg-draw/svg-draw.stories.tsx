import type { Meta, StoryObj } from "@storybook/react-vite";
import { SvgDraw } from "./svg-draw";

const meta = {
  title: "Components/Atom/SvgDraw",
  component: SvgDraw,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SvgDraw>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkmark: Story = {
  args: {
    path: "M 20 50 L 40 70 L 80 30",
    stroke: "#10B981",
    strokeWidth: 4,
    duration: 1200,
    className: "w-20 h-20",
  },
};

export const HeartShape: Story = {
  args: {
    path: "M 50,30 A 20,20 0,0,0 10,50 C 10,70 50,90 50,90 C 50,90 90,70 90,50 A 20,20 0,0,0 50,30 Z",
    stroke: "#EF4444",
    strokeWidth: 3,
    duration: 1800,
    className: "w-24 h-24",
  },
};
