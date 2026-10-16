import { type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export interface PunctualityDonutProps extends HTMLAttributes<HTMLDivElement> {
  total: number;
  onTime: number;
  late: number;
  absent: number;
  onLeave?: number;
  percentage?: string | number;
  title?: string;
}

export function PunctualityDonut({
  total,
  onTime,
  late,
  absent,
  onLeave = 0,
  percentage,
  title = "Rasio Ketepatan Waktu (Punctuality Rate)",
  className,
  ...props
}: PunctualityDonutProps) {
  const safeTotal = total > 0 ? total : 1;
  const onTimePct = (onTime / safeTotal) * 100;
  const latePct = (late / safeTotal) * 100;
  const absentPct = (absent / safeTotal) * 100;

  const displayPct = typeof percentage === "number" ? `${percentage}%` : percentage || `${onTimePct.toFixed(0)}%`;

  return (
    <div
      className={cn(
        "p-6 rounded-md bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm dark:shadow-xl flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="text-emerald-500 text-base"></span> {title}
        </h3>
        <span className="text-xs  text-slate-500 dark:text-slate-400">Total {total} Karyawan</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        {/* SVG Donut Chart */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Base Circle */}
            <path
              className="text-slate-100 dark:text-slate-800/80"
              strokeWidth="3.8"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* On-Time Circle (Emerald) */}
            <path
              className="text-emerald-500 transition-all duration-1000 ease-out"
              strokeDasharray={`${onTimePct}, 100`}
              strokeWidth="3.8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Late Circle (Amber) */}
            {late > 0 && (
              <path
                className="text-amber-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${latePct}, 100`}
                strokeDashoffset={-onTimePct}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            )}
            {/* Absent Circle (Rose) */}
            {absent > 0 && (
              <path
                className="text-rose-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${absentPct}, 100`}
                strokeDashoffset={-(onTimePct + latePct)}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            )}
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black  text-emerald-600 dark:text-emerald-400 tracking-tight">
              {displayPct}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Tepat Waktu
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 text-xs w-full sm:w-auto">
          <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">Tepat Waktu</span>
            </div>
            <span className=" font-bold text-emerald-700 dark:text-emerald-400">{onTime}</span>
          </div>

          <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="font-semibold text-amber-800 dark:text-amber-300">Terlambat</span>
            </div>
            <span className=" font-bold text-amber-700 dark:text-amber-400">{late}</span>
          </div>

          <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="font-semibold text-rose-800 dark:text-rose-300">Absen (Alpha)</span>
            </div>
            <span className=" font-bold text-rose-700 dark:text-rose-400">{absent}</span>
          </div>

          {onLeave > 0 && (
            <div className="p-2.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                <span className="font-semibold text-indigo-800 dark:text-indigo-300">Izin / Cuti</span>
              </div>
              <span className=" font-bold text-indigo-700 dark:text-indigo-400">{onLeave}</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
        Berdasarkan sinkronisasi presensi harian per jam 08:30 WIB.
      </div>
    </div>
  );
}
