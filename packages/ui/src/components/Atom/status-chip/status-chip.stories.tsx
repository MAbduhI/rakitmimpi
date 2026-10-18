import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusChip } from "./status-chip";

const meta = {
  title: "Components/Atom/StatusChip",
  component: StatusChip,
  tags: ["autodocs"],
  args: {
    label: "UP",
    status: "up",
    pulse: true,
  },
  argTypes: {
    status: {
      control: "select",
      options: ["up", "warn", "down", "pending", "neutral", "checked_out", "synced"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md"],
    },
    pulse: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof StatusChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OperationalUp: Story = {
  args: {
    status: "up",
    label: "UP",
    pulse: true,
  },
};

export const OperationalWarn: Story = {
  args: {
    status: "warn",
    label: "WARN",
    pulse: true,
  },
};

export const OperationalDown: Story = {
  args: {
    status: "down",
    label: "DOWN",
    pulse: false,
  },
};

export const OperationalPending: Story = {
  args: {
    status: "pending",
    label: "PENDING",
    pulse: true,
  },
};

export const CheckedOut: Story = {
  args: {
    status: "checked_out",
    label: "CHECKED OUT",
    pulse: false,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-[#14171D] p-6">
      <StatusChip status="up" label="ONLINE • UP" pulse />
      <StatusChip status="warn" label="DEGRADED • WARN" pulse />
      <StatusChip status="down" label="OFFLINE • DOWN" />
      <StatusChip status="pending" label="INITIALIZING" pulse />
      <StatusChip status="checked_out" label="CHECKED OUT" />
      <StatusChip status="synced" label="KAFKA SYNCED" />
      <StatusChip status="neutral" label="STANDBY" />
    </div>
  ),
};
