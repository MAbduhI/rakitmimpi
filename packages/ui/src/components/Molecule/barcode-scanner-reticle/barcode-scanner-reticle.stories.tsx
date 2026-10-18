import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarcodeScannerReticle } from "./barcode-scanner-reticle";

const meta = {
  title: "Components/Molecule/BarcodeScannerReticle",
  component: BarcodeScannerReticle,
  tags: ["autodocs"],
  args: {
    guideText: "Arahkan kamera ke QR / Barcode",
    scanning: true,
    theme: "dark",
    laserColor: "cyan",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light", "transparent"],
    },
    laserColor: {
      control: "select",
      options: ["cyan", "emerald", "amber", "rose", "indigo", "primary"],
    },
  },
} satisfies Meta<typeof BarcodeScannerReticle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkModeScanning: Story = {
  args: {
    theme: "dark",
    laserColor: "cyan",
  },
};

export const LightModeScanning: Story = {
  args: {
    theme: "light",
    laserColor: "indigo",
  },
};

export const CodeDetected: Story = {
  args: {
    scannedCode: "INV-89410294-ID",
    scanning: false,
    theme: "dark",
  },
};
