import type { Meta, StoryObj } from "@storybook/react-vite";
import { Motion } from "./motion";

const meta = {
  title: "Components/Atom/Motion",
  component: Motion.div,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Motion.div>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FadeUp: Story = {
  args: {
    preset: "fade-up",
    children: (
      <div className="rounded-md border border-border bg-surface p-6 shadow-sm">
        <h3 className="font-bold text-lg text-primary">Fade Up Preset</h3>
        <p className="text-secondary text-sm">Buttery smooth spring & cubic motion.</p>
      </div>
    ),
  },
};

export const PopAndHover: Story = {
  args: {
    preset: "pop",
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    children: (
      <div className="cursor-pointer rounded-sm bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-md">
        Hover / Tap Me
      </div>
    ),
  },
};

export const ElasticBounce: Story = {
  args: {
    preset: "elastic-up",
    children: (
      <div className="rounded-md border border-border bg-surface p-6 shadow-sm">
        <span className="font-bold text-primary">Elastic Overshoot</span>
      </div>
    ),
  },
};
