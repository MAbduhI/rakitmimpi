import type { ReactNode } from "react";
import { cn } from "../../../utils";
import { Card } from "../../Atom/card";
import { Icon, type IconName } from "../../Atom/icon";
import { Badge } from "../../Atom/badge";

export interface StatWidgetProps {
  /** Metric or KPI title */
  title: string;
  /** Primary metric value (e.g. "$45,200", "84.5%", "1,240") */
  value: string | number;
  /** Optional icon displayed in widget badge */
  icon?: IconName;
  /** Change percentage or indicator text (e.g. "+12.5%") */
  change?: string | number;
  /** Trend direction: positive (green), negative (red), neutral */
  trend?: "up" | "down" | "neutral";
  /** Trend comparison period or description (e.g. "vs last month") */
  trendPeriod?: string;
  /** Progress percentage bar (0 - 100) */
  progress?: number;
  /** Additional custom footer / micro-chart element */
  footer?: ReactNode;
  /** Card visual style variant */
  variant?: "default" | "bordered" | "flush" | "elevated";
  /** Custom CSS classes */
  className?: string;
}

export function StatWidget({
  title,
  value,
  icon,
  change,
  trend,
  trendPeriod,
  progress,
  footer,
  variant = "default",
  className,
}: StatWidgetProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card variant={variant} className={cn("p-6 flex flex-col justify-between", className)}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-secondary text-xs font-medium uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div className="flex size-9 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Icon name={icon} className="size-5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-bold text-2xl tracking-tight text-primary">
            {value}
          </span>
          {change !== undefined && (
            <Badge
              variant={isPositive ? "soft-success" : isNegative ? "soft-error" : "soft-secondary"}
              size="xs"
              className="font-medium"
            >
              {isPositive && "↑ "}
              {isNegative && "↓ "}
              {change}
            </Badge>
          )}
        </div>

        {trendPeriod && (
          <p className="text-secondary text-xs mt-1">
            {trendPeriod}
          </p>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-secondary mb-1">
            <span>Progress</span>
            <span className="font-medium text-primary">{Math.min(100, Math.max(0, progress))}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {footer && <div className="mt-4 pt-3 border-t border-border">{footer}</div>}
    </Card>
  );
}
