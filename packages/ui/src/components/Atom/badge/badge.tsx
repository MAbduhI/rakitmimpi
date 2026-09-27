import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";
import { badgeTones } from "./badge-tones";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold transition-colors",
  {
    variants: {
      variant: badgeTones,
      size: {
        xs: "px-1.5 py-0.2 text-[10px] leading-tight",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm font-medium",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
        circle: "size-5 p-0 justify-center rounded-full text-[10px] aspect-square",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "pill",
    },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Renders a small status dot inside the badge */
  dot?: boolean;
  /** Adds a pulsing animation to the dot indicator */
  pulse?: boolean;
}

export function Badge({ className, variant, size, shape, dot, pulse, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, shape }), className)} {...props}>
      {dot && (
        <span className="relative flex size-2 items-center justify-center">
          {pulse && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
          )}
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
