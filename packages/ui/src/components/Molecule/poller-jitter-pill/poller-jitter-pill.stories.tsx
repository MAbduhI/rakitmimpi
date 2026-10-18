import type { Meta, StoryObj } from "@storybook/react-vite";
import { PollerJitterPill } from "./poller-jitter-pill";

const meta = {
  title: "Components/Molecule/PollerJitterPill",
  component: PollerJitterPill,
  tags: ["autodocs"],
  args: {
    interval: "4h",
    jitter: "-28m",
    status: "fresh",
    label: "POLLER FRESH",
    lastSync: "14:12:05 WIB",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["fresh", "warning", "stale"],
    },
    syncing: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof PollerJitterPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fresh: Story = {
  args: {
    interval: "4h",
    jitter: "-28m",
    status: "fresh",
    label: "POLLER FRESH",
    lastSync: "14:12:05 WIB",
  },
};

export const CountdownWithJitter: Story = {
  args: {
    interval: "4h",
    jitter: "+15m",
    status: "fresh",
    label: "SNMP SYNC",
    nextPollIn: "02:47:13",
  },
};

export const StaleWarning: Story = {
  args: {
    interval: "4h",
    jitter: "+45m",
    status: "stale",
    label: "POLLER DELAYED",
    lastSync: "08:10:00 WIB",
  },
};
