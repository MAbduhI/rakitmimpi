import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionTakeoverModal } from "./session-takeover-modal";

const sampleDevice = {
  deviceName: "MacBook Pro 16 (Chrome 130)",
  os: "macOS Sequoia",
  ipAddress: "103.14.88.21",
  location: "Jakarta, Indonesia",
  sessionId: "sess_usr_8921df04",
  lastActive: "1 menit lalu",
};

const meta = {
  title: "Components/Molecule/SessionTakeoverModal",
  component: SessionTakeoverModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    device: sampleDevice,
    isTakingOver: false,
    theme: "dark",
    onClose: () => {},
    onConfirmTakeover: () => {},
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["dark", "light"],
    },
  },
} satisfies Meta<typeof SessionTakeoverModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkMode: Story = {
  args: {
    theme: "dark",
    device: sampleDevice,
  },
};

export const LightMode: Story = {
  args: {
    theme: "light",
    device: sampleDevice,
  },
};

export const TakingOverLoading: Story = {
  args: {
    isTakingOver: true,
    theme: "dark",
    device: sampleDevice,
  },
};
