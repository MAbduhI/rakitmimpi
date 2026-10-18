import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";

export interface StatRowItem {
  id?: string;
  label: ReactNode;
  value: ReactNode;
  highlight?: boolean;
  subtext?: ReactNode;
  change?: ReactNode;
  icon?: ReactNode;
}

export interface StatRowProps extends HTMLAttributes<HTMLDivElement> {
  items: StatRowItem[];
}

export function StatRow({ items, className, ...props }: StatRowProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-sm divide-y sm:divide-y-0 sm:divide-x divide-border grid grid-cols-2 sm:grid-cols-4 overflow-hidden",
        className
      )}
      {...props}
    >
      {items.map((it, idx) => (
        <div key={it.id || idx} className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="font-sans tabular-nums text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {it.label}
            </span>
            {it.icon}
          </div>
          <div className="flex items-baseline gap-2">
            <div
              className={cn(
                "text-3xl sm:text-5xl font-extrabold font-display tabular-nums tracking-tight leading-none",
                it.highlight ? "text-primary" : "text-foreground"
              )}
            >
              {it.value}
            </div>
            {it.change && <div>{it.change}</div>}
          </div>
          {it.subtext && (
            <div className="text-[11px] text-muted-foreground mt-1.5 font-sans tabular-nums">
              {it.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
