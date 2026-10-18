import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";

const statusChipVariants = cva(
  "inline-flex items-center gap-1.5 font-medium select-none rounded-full transition-colors",
  {
    variants: {
      status: {
        up: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warn: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        down: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        pending: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        neutral: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        checked_out: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        synced: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
      },
      size: {
        xs: "h-5 px-2 text-[10px] tracking-wider",
        sm: "h-6 px-2.5 text-xs tracking-wide",
        md: "h-7 px-3 text-xs tracking-normal",
      },
    },
    defaultVariants: {
      status: "neutral",
      size: "sm",
    },
  },
);

const dotColors: Record<string, string> = {
  up: "bg-emerald-400",
  warn: "bg-amber-400",
  down: "bg-rose-400",
  pending: "bg-sky-400",
  neutral: "bg-slate-400",
  checked_out: "bg-indigo-400",
  synced: "bg-teal-400",
};

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusChipVariants> {
  label?: string;
  pulse?: boolean;
  dot?: boolean;
  icon?: ReactNode;
}

export function StatusChip({
  children,
  className,
  status = "neutral",
  size = "sm",
  label,
  pulse = false,
  dot = true,
  icon,
  ...props
}: StatusChipProps) {
  const currentStatus = status || "neutral";
  const displayLabel = label || children;

  return (
    <span className={cn(statusChipVariants({ status: currentStatus, size }), className)} {...props}>
      {dot && (
        <span className="relative flex size-2 shrink-0 items-center justify-center">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                dotColors[currentStatus] || "bg-slate-400",
              )}
            />
          )}
          <span
            className={cn("relative inline-flex size-1.5 rounded-full", dotColors[currentStatus] || "bg-slate-400")}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate font-semibold uppercase">{displayLabel}</span>
    </span>
  );
}
