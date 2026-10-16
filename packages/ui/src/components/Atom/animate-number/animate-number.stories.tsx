import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimateNumber } from "./animate-number";

const meta = {
  title: "Components/Atom/AnimateNumber",
  component: AnimateNumber,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AnimateNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCounter: Story = {
  args: {
    value: 54321,
    from: 0,
    duration: 1500,
    prefix: "+",
    className: "text-3xl font-black text-primary",
  },
};

export const CurrencyFormatter: Story = {
  args: {
    value: 1450000,
    from: 0,
    duration: 2000,
    prefix: "Rp ",
    className: "text-2xl font-bold text-accent",
  },
};
