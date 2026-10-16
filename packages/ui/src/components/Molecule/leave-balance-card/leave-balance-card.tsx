import { type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export interface LeaveItemBalance {
  type: string;
  name: string;
  total: number;
  used: number;
  remaining: number;
  color?: string; // e.g. "emerald", "blue", "purple", "amber"
}

export interface LeaveBalanceCardProps extends HTMLAttributes<HTMLDivElement> {
  balances: LeaveItemBalance[];
  onRequestLeave?: () => void;
  title?: string;
}

interface ColorStyle {
  bar: string;
  badge: string;
  text: string;
}

const DEFAULT_STYLE: ColorStyle = {
  bar: "bg-emerald-500",
  badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  text: "text-emerald-400",
};

const COLOR_CLASSES: Record<string, ColorStyle> = {
  emerald: DEFAULT_STYLE,
  blue: {
    bar: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    text: "text-blue-400",
  },
  purple: {
    bar: "bg-purple-500",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    text: "text-purple-400",
  },
  amber: {
    bar: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    text: "text-amber-400",
  },
};

export function LeaveBalanceCard({
  balances,
  onRequestLeave,
  title = "Saldo Cuti & Hak Libur Karyawan",
  className,
  ...props
}: LeaveBalanceCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-md bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm dark:shadow-xl flex flex-col justify-between space-y-4",
        className
      )}
      {...props}
    >
      {/* Header with Action */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Hak Cuti Takwim
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span></span> {title}
          </h3>
        </div>

        {onRequestLeave && (
          <button
            type="button"
            onClick={onRequestLeave}
            className="px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
          >
            <span>+</span> Ajukan Cuti
          </button>
        )}
      </div>

      {/* Balance Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Array.isArray(balances) ? balances : []).map((item) => {
          const colorKey = item.color || "emerald";
          const styles: ColorStyle = COLOR_CLASSES[colorKey] ?? DEFAULT_STYLE;
          const pctUsed = item.total > 0 ? (item.used / item.total) * 100 : 0;

          return (
            <div
              key={item.type}
              className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {item.name}
                </span>
                <span className={cn("text-[10px] font-sans tabular-nums font-bold px-2 py-0.5 rounded border", styles.badge)}>
                  Sisa {item.remaining} Hari
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-300", styles.bar)}
                  style={{ width: `${Math.min(100, Math.max(0, 100 - pctUsed))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-sans tabular-nums text-slate-500 pt-0.5">
                <span>Terpakai: {item.used} hari</span>
                <span>Total: {item.total} hari</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800/80 pt-3">
        Pengajuan cuti memerlukan persetujuan HR Manager maksimal H-3 sebelum tanggal cuti.
      </div>
    </div>
  );
}
