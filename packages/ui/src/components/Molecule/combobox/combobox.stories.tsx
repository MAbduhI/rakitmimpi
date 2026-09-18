import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ComboBox, type ComboBoxOption } from "./combobox";

const frameworkOptions: Array<ComboBoxOption> = [
  { value: "next", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const meta = {
  title: "Components/Molecule/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  args: {
    options: frameworkOptions,
  },
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [val, setVal] = useState<string | Array<string>>("");
    return (
      <ComboBox
        {...args}
        value={val}
        onChange={setVal}
        placeholder="Select framework..."
        searchPlaceholder="Search frameworks..."
      />
    );
  },
};

export const Multiple: Story = {
  render: (args) => {
    const [val, setVal] = useState<string | Array<string>>(["next", "react"]);
    return (
      <ComboBox
        {...args}
        multiple
        value={val}
        onChange={setVal}
        placeholder="Select multiple..."
        searchPlaceholder="Filter tags..."
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    options: frameworkOptions,
    value: "next",
    disabled: true,
    placeholder: "Disabled selection...",
  },
};

export const Loading: Story = {
  args: {
    options: [],
    loading: true,
    placeholder: "Fetching options...",
  },
};
