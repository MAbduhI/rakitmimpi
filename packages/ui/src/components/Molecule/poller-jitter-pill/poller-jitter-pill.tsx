import { IconClock, IconRefresh } from "@tabler/icons-react";
import type { HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export type PollerStatus = "fresh" | "warning" | "stale";

export interface PollerJitterPillProps extends HTMLAttributes<HTMLDivElement> {
  interval?: string;
  jitter?: string;
  lastSync?: string;
  nextPollIn?: string;
  status?: PollerStatus;
  label?: string;
  syncing?: boolean;
  onRefreshClick?: () => void;
}

const statusStyles: Record<PollerStatus, { pill: string; dot: string; text: string }> = {
  fresh: {
    pill: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  warning: {
    pill: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    dot: "bg-amber-400",
    text: "text-amber-400",
  },
  stale: {
    pill: "bg-rose-500/10 border-rose-500/20 text-rose-300",
    dot: "bg-rose-400",
    text: "text-rose-400",
  },
};

export function PollerJitterPill({
  className,
  interval = "4h",
  jitter = "-28m",
  lastSync,
  nextPollIn,
  status = "fresh",
  label = "POLLER FRESH",
  syncing = false,
  onRefreshClick,
  ...props
}: PollerJitterPillProps) {
  const currentStyles = statusStyles[status] || statusStyles.fresh;

  return (
    <div
      className={cn(
        "inline-flex select-none items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur-sm transition-colors",
        currentStyles.pill,
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex size-2 shrink-0 items-center justify-center">
          <span
            className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-75", currentStyles.dot)}
          />
          <span className={cn("relative inline-flex size-1.5 rounded-full", currentStyles.dot)} />
        </span>
        <span className={cn("font-semibold text-[11px] uppercase tracking-wider", currentStyles.text)}>{label}</span>
      </div>

      <span className="text-slate-400/40">|</span>

      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
        <span>{interval}</span>
        {jitter && (
          <span className="rounded bg-black/20 px-1 py-0.2 text-[10px] text-slate-400">
            {jitter.startsWith("-") || jitter.startsWith("+") ? jitter : `+${jitter}`} jitter
          </span>
        )}
      </div>

      {(lastSync || nextPollIn) && (
        <>
          <span className="text-slate-400/40">|</span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            {nextPollIn ? (
              <>
                <IconClock className="size-3 text-slate-400" />
                <span>Next: {nextPollIn}</span>
              </>
            ) : (
              <span>Last: {lastSync}</span>
            )}
          </div>
        </>
      )}

      {onRefreshClick && (
        <button
          type="button"
          onClick={onRefreshClick}
          className="ml-1 rounded p-0.5 text-slate-400 transition-colors hover:text-white"
          title="Force Sync"
        >
          <IconRefresh className={cn("size-3.5", syncing && "animate-spin text-sky-400")} />
        </button>
      )}
    </div>
  );
}
