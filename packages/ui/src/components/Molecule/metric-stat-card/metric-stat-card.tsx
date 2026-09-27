"use client";

import React, { type ReactNode, type HTMLAttributes, isValidElement } from "react";
import { cn } from "../../../utils/cn";

export type MetricStatVariant = "default" | "primary" | "success" | "warning" | "danger" | "purple" | "cyan" | "indigo" | "emerald" | "amber" | "blue" | "rose";

export interface MetricStatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
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
}

export function MetricStatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  variant = "default",
  progress,
  badge,
  className,
  ...props
}: MetricStatCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-md bg-white dark:bg-[#111315]",
        "border border-slate-200/80 dark:border-white/10",
        "hover:border-slate-300 dark:hover:border-white/20",
        "shadow-xs hover:shadow-sm transition-all duration-200",
        "flex flex-col justify-between group",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider leading-snug line-clamp-2 min-h-[32px]">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white ">
            {value}
          </div>
        </div>

        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
              "bg-slate-50 dark:bg-white/[0.04]",
              "border border-slate-200/80 dark:border-white/10",
              "text-slate-700 dark:text-slate-300 shadow-2xs"
            )}
          >
            {isValidElement(icon)
              ? icon
              : typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in (icon as any))
              ? React.createElement(icon as any, { className: "w-5 h-5 text-slate-700 dark:text-slate-300" })
              : (icon as React.ReactNode)}
          </div>
        )}
      </div>

      {(trend || subtitle || progress !== undefined || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
          {progress !== undefined && (
            <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between text-xs gap-2">
            {trend && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    "font-bold  text-[11px] px-1.5 py-0.5 rounded flex items-center gap-0.5",
                    trend.isPositive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {trend.value}
                </span>
                {trend.label && <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{trend.label}</span>}
              </div>
            )}

            {subtitle && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {subtitle}
              </span>
            )}

            {badge && <div>{badge}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricStatCard;
