import type { Meta, StoryObj } from "@storybook/react-vite";
import { CameraViewfinderHUD } from "./camera-viewfinder-hud";

const meta = {
  title: "Components/Molecule/CameraViewfinderHUD",
  component: CameraViewfinderHUD,
  tags: ["autodocs"],
  args: {
    timestamp: "2026-10-18 07:15:22 WIB",
    coordinates: "-6.3982° S, 106.8342° E",
    altitude: "98m",
    accuracy: "±3m",
    deviceSerial: "DEV-RACK-042",
    signalQuality: "12.4 dB",
    speedLabel: "184 Mbps",
    gpsLocked: true,
    mockGpsDetected: false,
    alignmentValid: true,
    lineOfSightClear: true,
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light", "transparent"],
    },
  },
} satisfies Meta<typeof CameraViewfinderHUD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkModeHUD: Story = {
  args: {
    theme: "dark",
  },
};

export const LightModeHUD: Story = {
  args: {
    theme: "light",
  },
};

export const FakeGpsAlert: Story = {
  args: {
    mockGpsDetected: true,
    theme: "dark",
  },
};
