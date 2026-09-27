import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils";

const dividerVariants = cva("shrink-0 border-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full self-stretch",
    },
    variant: {
      solid: "border-solid",
      dashed: "border-dashed bg-transparent border-t border-border",
      dotted: "border-dotted bg-transparent border-t border-border",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
      xl: "",
      "2xl": "",
    },
  },
  compoundVariants: [
    { orientation: "horizontal", size: "sm", variant: "solid", class: "h-px" },
    { orientation: "horizontal", size: "md", variant: "solid", class: "h-0.5" },
    { orientation: "horizontal", size: "lg", variant: "solid", class: "h-1" },
    { orientation: "horizontal", size: "xl", variant: "solid", class: "h-1.5" },
    { orientation: "horizontal", size: "2xl", variant: "solid", class: "h-2" },
    { orientation: "vertical", size: "sm", variant: "solid", class: "w-px" },
    { orientation: "vertical", size: "md", variant: "solid", class: "w-0.5" },
    { orientation: "vertical", size: "lg", variant: "solid", class: "w-1" },
    { orientation: "vertical", size: "xl", variant: "solid", class: "w-1.5" },
    { orientation: "vertical", size: "2xl", variant: "solid", class: "w-2" },
  ],
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid",
    size: "sm",
  },
});

export interface DividerProps extends HTMLAttributes<HTMLHRElement>, VariantProps<typeof dividerVariants> {
  /** Optional content/label inside the separator (Metronic .separator-content) */
  label?: ReactNode;
}

export function Divider({ className, orientation = "horizontal", variant = "solid", size = "sm", label, ...props }: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("flex items-center text-center text-xs text-secondary font-medium my-2", className)}>
        <div className={cn("flex-1 border-border", variant === "dashed" ? "border-t border-dashed" : variant === "dotted" ? "border-t border-dotted" : "border-t")} />
        <span className="px-3 select-none">{label}</span>
        <div className={cn("flex-1 border-border", variant === "dashed" ? "border-t border-dashed" : variant === "dotted" ? "border-t border-dotted" : "border-t")} />
      </div>
    );
  }

  return (
    <hr
      aria-orientation={orientation ?? "horizontal"}
      className={cn(dividerVariants({ orientation, variant, size }), className)}
      {...props}
    />
  );
}
