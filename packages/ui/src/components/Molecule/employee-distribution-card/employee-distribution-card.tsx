"use client";

import React, { type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export interface StatusSegment {
  label: string;
  count: number;
  color: string;
  textColor: string;
}

export interface DepartmentShare {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface EmployeeDistributionCardProps extends HTMLAttributes<HTMLDivElement> {
  totalCount: number;
  types: StatusSegment[];
  departments: DepartmentShare[];
  title?: string;
}

export function EmployeeDistributionCard({
  totalCount,
  types = [],
  departments = [],
  title = "Komposisi & Distribusi Karyawan",
  className,
  ...props
}: EmployeeDistributionCardProps) {
  const safeTotal = totalCount > 0 ? totalCount : 1;
  const safeTypes = Array.isArray(types) ? types : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  return (
    <div
      className={cn(
        "p-6 rounded-md bg-white dark:bg-[#111315]",
        "border border-slate-200/80 dark:border-white/10",
        "shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all",
        "space-y-5",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base"></span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <span className="text-xs  font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-sm border border-emerald-200/60 dark:border-emerald-500/20">
          Total {totalCount} Karyawan Aktif
        </span>
      </div>

      {/* 2-Column Responsive Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Column 1: Employment Status Stacked Bar */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Status Ikatan Kerja (Employment Type)
          </span>

          {/* Multi-segmented Bar */}
          <div className="w-full bg-slate-100 dark:bg-white/10 h-3 rounded-full overflow-hidden flex shadow-inner">
            {safeTypes.map((t) => {
              const widthPct = (t.count / safeTotal) * 100;
              return (
                <div
                  key={t.label}
                  className={cn("h-full transition-all duration-500", t.color)}
                  style={{ width: `${widthPct}%` }}
                  title={`${t.label}: ${t.count} orang (${widthPct.toFixed(0)}%)`}
                />
              );
            })}
          </div>

          {/* Legend pills */}
          <div className="flex items-center gap-4 flex-wrap pt-1 text-xs">
            {safeTypes.map((t) => (
              <div key={t.label} className="flex items-center gap-1.5">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", t.color)} />
                <span className="text-slate-500 dark:text-slate-400">{t.label}:</span>
                <span className=" font-bold text-slate-900 dark:text-slate-100">{t.count} orang</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Department Breakdown Bars */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Sebaran Headcount per Divisi
          </span>

          <div className="space-y-2">
            {safeDepartments.map((dept) => (
              <div key={dept.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[220px]">
                    {dept.name}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500  text-[11px] shrink-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.count} orang</span>
                    <span className="text-slate-400">({dept.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", dept.color)}
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center border-t border-slate-100 dark:border-white/5 pt-3">
        Data demografi disinkronkan langsung dari Master Data IAM & HRIS • Update otomatis per rotasi shift
      </div>
    </div>
  );
}

export default EmployeeDistributionCard;
