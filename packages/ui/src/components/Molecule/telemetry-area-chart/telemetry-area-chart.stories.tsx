import type { Meta, StoryObj } from "@storybook/react-vite";
import { TelemetryAreaChart, type TelemetryDataPoint } from "./telemetry-area-chart";

const sampleData: Array<TelemetryDataPoint> = [
  { timestamp: "00:00", label: "00:00 WIB", rx: 124, tx: 28 },
  { timestamp: "03:00", label: "03:00 WIB", rx: 98, tx: 18 },
  { timestamp: "06:00", label: "06:00 WIB", rx: 156, tx: 34 },
  { timestamp: "09:00", label: "09:00 WIB", rx: 210, tx: 46 },
  { timestamp: "12:00", label: "12:00 WIB", rx: 245, tx: 52 },
  { timestamp: "15:00", label: "15:00 WIB", rx: 188, tx: 41 },
  { timestamp: "18:00", label: "18:00 WIB", rx: 232, tx: 49 },
  { timestamp: "21:00", label: "21:00 WIB", rx: 195, tx: 38 },
];

const meta = {
  title: "Components/Molecule/TelemetryAreaChart",
  component: TelemetryAreaChart,
  tags: ["autodocs"],
  args: {
    data: sampleData,
    title: "Network Throughput & Bandwidth",
    subtitle: "Throughput Inbound (Rx) vs Outbound (Tx)",
    unit: "Mbps",
    activeRange: "24h",
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light"],
    },
  },
} satisfies Meta<typeof TelemetryAreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkMode: Story = {
  args: {
    theme: "dark",
  },
};

export const LightMode: Story = {
  args: {
    theme: "light",
  },
};

export const InvertedOutbound: Story = {
  args: {
    theme: "dark",
    invertedTx: true,
    subtitle: "Inverted Tx Router Style (RRDtool / SNMP)",
  },
};
