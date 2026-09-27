import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../Atom/button";
import { Motion } from "../../Atom/motion";
import { AnimatePresence } from "./animate-presence";

const meta = {
  title: "Components/Molecule/AnimatePresence",
  component: AnimatePresence,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AnimatePresence>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TogglePresence: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);
    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setIsVisible(!isVisible)}>{isVisible ? "Hide Element" : "Show Element"}</Button>
        <div className="flex h-32 items-center justify-center">
          <AnimatePresence>
            {isVisible && (
              <Motion.div
                key="box"
                preset="pop"
                exit={{ opacity: 0, scale: 0.8 }}
                className="rounded-sm bg-accent px-6 py-4 font-bold text-accent-foreground shadow-md"
              >
                Dismissable Element
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
};
