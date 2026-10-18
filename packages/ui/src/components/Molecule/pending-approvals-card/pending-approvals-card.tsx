import { type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export type ApprovalType = "LEAVE" | "REIMBURSEMENT" | "TIME_ADJUST" | "LETTER";

export interface PendingApprovalItem {
  id: string;
  type: ApprovalType;
  title: string;
  subtitle: string;
  employeeName: string;
  employeeNik: string;
  date: string;
  amountOrDays?: string;
  avatarInitial?: string;
}

export interface PendingApprovalsCardProps extends HTMLAttributes<HTMLDivElement> {
  items: PendingApprovalItem[];
  title?: string;
  onApprove?: (id: string, type: ApprovalType) => void;
  onReject?: (id: string, type: ApprovalType) => void;
  emptyMessage?: string;
  onViewAll?: () => void;
}

const TYPE_CONFIGS: Record<ApprovalType, { label: string; icon: string; badge: string }> = {
  LEAVE: {
    label: "Cuti / Izin",
    icon: "",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  REIMBURSEMENT: {
    label: "Klaim Biaya",
    icon: "",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  TIME_ADJUST: {
    label: "Koreksi Jam",
    icon: "",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  LETTER: {
    label: "Surat / SP",
    icon: "",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

export function PendingApprovalsCard({
  items = [],
  title = "Antrean Persetujuan Tertunda",
  onApprove,
  onReject,
  emptyMessage = "Semua pengajuan telah diproses.",
  onViewAll,
  className,
  ...props
}: PendingApprovalsCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-md bg-slate-900/60 border border-slate-800 backdrop-blur shadow-xl flex flex-col justify-between space-y-4",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base"></span>
          <h3 className="font-bold text-sm text-slate-100">{title}</h3>
          {items.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans tabular-nums font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {items.length} Pending
            </span>
          )}
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            Lihat Semua →
          </button>
        )}
      </div>

      {/* List Items */}
      <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
        {items.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 italic">
            {emptyMessage}
          </div>
        ) : (
          items.map((item) => {
            const cfg = TYPE_CONFIGS[item.type] ?? TYPE_CONFIGS.LEAVE;
            const initial = item.avatarInitial || item.employeeName.charAt(0);

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-md bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                {/* Employee Info & Request */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0 mt-0.5">
                    {initial}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-100 truncate">
                        {item.employeeName}
                      </span>
                      <span className="text-[10px] font-sans tabular-nums text-slate-500">
                        {item.employeeNik}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-sans tabular-nums font-bold px-1.5 py-0.5 rounded border",
                          cfg.badge
                        )}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.subtitle} • {item.date}
                    </p>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.amountOrDays && (
                    <span className="text-xs font-sans tabular-nums font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20 mr-1">
                      {item.amountOrDays}
                    </span>
                  )}

                  {onApprove && (
                    <button
                      type="button"
                      onClick={() => onApprove(item.id, item.type)}
                      className="px-3 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                    >
                      ✓ Setujui
                    </button>
                  )}

                  {onReject && (
                    <button
                      type="button"
                      onClick={() => onReject(item.id, item.type)}
                      className="px-2.5 py-1.5 rounded-sm bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 font-bold text-xs transition"
                    >
                      ✕ Tolak
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center border-t border-slate-800/80 pt-2.5">
        Persetujuan akan memicu mutasi status database secara instan.
      </div>
    </div>
  );
}
