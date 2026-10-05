import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";

export type TagVariant = "success" | "warning" | "danger" | "error" | "muted" | "primary" | "accent";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  children: ReactNode;
}

const tagVariants: Record<TagVariant, string> = {
  success: "text-success border-[var(--success)]/40",
  warning: "text-warning border-[var(--warning)]/40",
  danger: "text-danger border-[var(--danger)]/40",
  error: "text-danger border-[var(--danger)]/40",
  muted: "text-muted-foreground border-border",
  primary: "text-primary border-primary/40",
  accent: "text-accent border-accent/40",
};

export function Tag({ variant = "muted", className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-sm border bg-transparent inline-flex items-center gap-1 font-medium leading-tight",
        tagVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
