import type { Meta, StoryObj } from "@storybook/react-vite";
import { DiagnosticDumpCard } from "./diagnostic-dump-card";

const sampleTelemetry = {
  state: "ONLINE" as const,
  signal: "13.8 dB",
  latencyMs: 27,
  downlink: 214.5,
  uplink: 38.2,
  unit: "Mbps",
  deviceSerial: "ROUTER-GW-4912",
  ipAddress: "192.168.1.1 / 24",
  syncQueueCount: 0,
};

const meta = {
  title: "Components/Molecule/DiagnosticDumpCard",
  component: DiagnosticDumpCard,
  tags: ["autodocs"],
  args: {
    telemetry: sampleTelemetry,
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light"],
    },
  },
} satisfies Meta<typeof DiagnosticDumpCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkMode: Story = {
  args: {
    theme: "dark",
    telemetry: sampleTelemetry,
  },
};

export const LightMode: Story = {
  args: {
    theme: "light",
    telemetry: sampleTelemetry,
  },
};

export const QueuedWarning: Story = {
  args: {
    theme: "dark",
    telemetry: {
      ...sampleTelemetry,
      state: "CONNECTING",
      latencyMs: 142,
      syncQueueCount: 12,
    },
  },
};
