"use client";

import React, { type HTMLAttributes, isValidElement, type ReactNode } from "react";
import { cn } from "../../../utils/cn";

export type MetricStatVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "cyan"
  | "indigo"
  | "emerald"
  | "amber"
  | "blue"
  | "rose";

export interface MetricStatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  subtitle?: string;
  variant?: MetricStatVariant;
  progress?: number; // 0 - 100
  badge?: ReactNode;
  sparkline?: Array<number>;
  sparklineType?: "bar" | "line";
  sparklineColor?: string;
}

export function MetricStatCard({
  title,
  value,
  unit,
  icon,
  trend,
  subtitle,
  variant = "default",
  progress,
  badge,
  sparkline,
  sparklineType = "bar",
  sparklineColor,
  className,
  ...props
}: MetricStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-white p-5 dark:bg-[#111315]",
        "border border-slate-200/80 dark:border-white/10",
        "hover:border-slate-300 dark:hover:border-white/20",
        "shadow-xs transition-all duration-200 hover:shadow-sm",
        "group flex flex-col justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <span className="line-clamp-2 block min-h-[32px] font-semibold text-[11px] text-slate-500 uppercase leading-snug tracking-wider dark:text-slate-400">
            {title}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold font-sans text-2xl text-slate-900 tracking-tight sm:text-3xl dark:text-white">
              {value}
            </span>
            {unit && <span className="font-medium font-mono text-slate-500 text-xs dark:text-slate-400">{unit}</span>}
          </div>
        </div>

        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-transform duration-200 group-hover:scale-105",
              "bg-slate-50 dark:bg-white/[0.04]",
              "border border-slate-200/80 dark:border-white/10",
              "text-slate-700 shadow-2xs dark:text-slate-300",
            )}
          >
            {isValidElement(icon)
              ? icon
              : typeof icon === "function"
                ? React.createElement(icon as React.ComponentType<{ className?: string }>, {
                    className: "w-5 h-5 text-slate-700 dark:text-slate-300",
                  })
                : (icon as ReactNode)}
          </div>
        )}
      </div>

      {(trend || subtitle || progress !== undefined || badge || (sparkline && sparkline.length > 0)) && (
        <div className="mt-4 space-y-2 border-slate-100 border-t pt-3 dark:border-white/5">
          {progress !== undefined && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-400"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 text-xs">
            {trend && (
              <div className="flex shrink-0 items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center gap-0.5 rounded px-1.5 py-0.5 font-bold text-[11px]",
                    trend.isPositive
                      ? "border border-emerald-200/60 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border border-rose-200/60 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400",
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {trend.value}
                </span>
                {trend.label && (
                  <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">{trend.label}</span>
                )}
              </div>
            )}

            {subtitle && <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</span>}

            {badge && <div>{badge}</div>}

            {sparkline && sparkline.length > 0 && (
              <div className="ml-auto flex h-4 shrink-0 items-end gap-0.5">
                {sparklineType === "line" ? (
                  <svg className="h-4 w-16 overflow-visible" viewBox={`0 0 ${sparkline.length * 8} 16`}>
                    <title>Sparkline Trend</title>
                    <path
                      d={sparkline.reduce((acc, val, idx) => {
                        const max = Math.max(...sparkline, 1);
                        const min = Math.min(...sparkline, 0);
                        const range = max - min || 1;
                        const x = idx * 8;
                        const y = 14 - ((val - min) / range) * 12;
                        return `${acc} ${idx === 0 ? "M" : "L"} ${x} ${y}`;
                      }, "")}
                      fill="none"
                      stroke={sparklineColor || (trend?.isPositive === false ? "#E06C75" : "#98C379")}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  sparkline.map((val, idx) => {
                    const max = Math.max(...sparkline, 1);
                    const heightPct = Math.min(100, Math.max(15, (val / max) * 100));
                    const barKey = `spark-bar-${title}-${idx}`;
                    return (
                      <span
                        key={barKey}
                        className="w-1 rounded-xs transition-all duration-300"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: sparklineColor || (trend?.isPositive === false ? "#E06C75" : "#98C379"),
                        }}
                      />
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
