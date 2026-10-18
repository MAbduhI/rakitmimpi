import { IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react";
import { type HTMLAttributes, useState } from "react";
import { cn } from "../../../utils/cn";
import { StatusChip } from "../../Atom/status-chip";

export type DiagnosticState =
  | "ONLINE"
  | "CONNECTING"
  | "STANDBY"
  | "WARNING"
  | "OFFLINE"
  | "SEARCHING"
  | "STOWED"
  | "OBSTRUCTED";

export interface DiagnosticTelemetryData {
  state: DiagnosticState;
  /** Primary signal / quality measurement (e.g. dB, %, RSSI) */
  signal?: string | number;
  /** @deprecated Use signal */
  snr?: string | number;
  latencyMs: number;
  downlink?: string | number;
  /** @deprecated Use downlink */
  downlinkMbps?: number;
  uplink?: string | number;
  /** @deprecated Use uplink */
  uplinkMbps?: number;
  unit?: string;
  deviceSerial?: string;
  /** @deprecated Use deviceSerial */
  kitSerial?: string;
  ipAddress?: string;
  /** @deprecated Use ipAddress */
  lanIp?: string;
  metadata?: Record<string, string | number>;
  /** @deprecated Custom dish parameters */
  azimuth?: string;
  /** @deprecated Custom dish parameters */
  elevation?: string;
  syncQueueCount?: number;
  /** @deprecated Use syncQueueCount */
  outboxPendingCount?: number;
}

export interface DiagnosticDumpCardProps extends HTMLAttributes<HTMLDivElement> {
  telemetry: DiagnosticTelemetryData;
  title?: string;
  theme?: "dark" | "light";
  onCopyDump?: () => void;
}

export function DiagnosticDumpCard({
  className,
  telemetry,
  title = "DEVICE TELEMETRY & DIAGNOSTICS",
  theme = "dark",
  onCopyDump,
  ...props
}: DiagnosticDumpCardProps) {
  const [copied, setCopied] = useState(false);
  const isLight = theme === "light";

  const handleCopy = () => {
    if (onCopyDump) {
      onCopyDump();
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(telemetry, null, 2));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusMap: Record<string, "up" | "pending" | "warn" | "down" | "neutral"> = {
    ONLINE: "up",
    CONNECTING: "pending",
    SEARCHING: "pending",
    STANDBY: "neutral",
    STOWED: "neutral",
    WARNING: "warn",
    OBSTRUCTED: "warn",
    OFFLINE: "down",
  };

  const signalVal = telemetry.signal ?? telemetry.snr ?? "—";
  const speedUnit = telemetry.unit ?? "Mbps";
  const downVal = telemetry.downlink ?? telemetry.downlinkMbps ?? 0;
  const upVal = telemetry.uplink ?? telemetry.uplinkMbps ?? 0;
  const serialVal = telemetry.deviceSerial ?? telemetry.kitSerial ?? "DEV-001";
  const ipVal = telemetry.ipAddress ?? telemetry.lanIp ?? "127.0.0.1";
  const queueVal = telemetry.syncQueueCount ?? telemetry.outboxPendingCount;

  return (
    <div
      className={cn(
        "select-none rounded-md border p-4 shadow-sm transition-colors",
        isLight ? "border-slate-200 bg-white text-slate-800" : "border-[#282C34] bg-[#14171D] text-[#ECEFF4]",
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b pb-3",
          isLight ? "border-slate-100" : "border-[#282C34]",
        )}
      >
        <div className="flex items-center gap-2">
          <IconTerminal2 className={cn("size-4", isLight ? "text-indigo-600" : "text-sky-400")} />
          <h4 className={cn("font-bold font-mono text-xs tracking-wider", isLight ? "text-slate-900" : "text-white")}>
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <StatusChip
            status={statusMap[telemetry.state] || "neutral"}
            label={telemetry.state}
            size="xs"
            pulse={telemetry.state === "ONLINE" || telemetry.state === "CONNECTING" || telemetry.state === "SEARCHING"}
          />

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] transition-colors",
              isLight
                ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "border-[#282C34] bg-[#21252B] text-slate-300 hover:bg-[#282C34]",
            )}
            title="Copy Raw Telemetry JSON"
          >
            {copied ? (
              <>
                <IconCheck className="size-3 text-emerald-500" />
                <span className="font-bold text-emerald-500">COPIED</span>
              </>
            ) : (
              <>
                <IconCopy className="size-3 text-slate-400" />
                <span>JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of monospace data */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 font-mono text-xs sm:grid-cols-4">
        <div
          className={cn(
            "rounded border p-2",
            isLight ? "border-slate-200 bg-slate-50" : "border-[#282C34] bg-[#181A1F]",
          )}
        >
          <span className="block text-[10px] text-slate-400">SIGNAL QUALITY</span>
          <span className="font-bold text-emerald-500 text-sm dark:text-emerald-400">
            {typeof signalVal === "number" ? `${signalVal} dB` : signalVal}
          </span>
        </div>

        <div
          className={cn(
            "rounded border p-2",
            isLight ? "border-slate-200 bg-slate-50" : "border-[#282C34] bg-[#181A1F]",
          )}
        >
          <span className="block text-[10px] text-slate-400">LATENCY (RTT)</span>
          <span className={cn("font-bold text-sm", isLight ? "text-indigo-600" : "text-sky-400")}>
            {telemetry.latencyMs} ms
          </span>
        </div>

        <div
          className={cn(
            "rounded border p-2",
            isLight ? "border-slate-200 bg-slate-50" : "border-[#282C34] bg-[#181A1F]",
          )}
        >
          <span className="block text-[10px] text-slate-400">DOWNLINK / RX</span>
          <span className={cn("font-bold text-sm", isLight ? "text-slate-900" : "text-white")}>
            {downVal} {speedUnit}
          </span>
        </div>

        <div
          className={cn(
            "rounded border p-2",
            isLight ? "border-slate-200 bg-slate-50" : "border-[#282C34] bg-[#181A1F]",
          )}
        >
          <span className="block text-[10px] text-slate-400">UPLINK / TX</span>
          <span className={cn("font-bold text-sm", isLight ? "text-slate-900" : "text-white")}>
            {upVal} {speedUnit}
          </span>
        </div>
      </div>

      {/* Technical Details Row */}
      <div
        className={cn(
          "mt-2.5 space-y-1 rounded border p-2.5 font-mono text-[11px]",
          isLight ? "border-slate-200 bg-slate-50 text-slate-700" : "border-[#282C34] bg-[#181A1F] text-slate-300",
        )}
      >
        <div className="flex justify-between">
          <span className="text-slate-400">Device Hardware ID:</span>
          <span className="font-semibold">{serialVal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Gateway / IP Address:</span>
          <span className="font-semibold">{ipVal}</span>
        </div>
        {telemetry.metadata &&
          Object.entries(telemetry.metadata).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-slate-400">{key}:</span>
              <span>{val}</span>
            </div>
          ))}
        {(telemetry.azimuth || telemetry.elevation) && (
          <div className="flex justify-between">
            <span className="text-slate-400">Orientation:</span>
            <span>
              Azimuth {telemetry.azimuth ?? "N/A"} • Elevation {telemetry.elevation ?? "N/A"}
            </span>
          </div>
        )}
      </div>

      {/* Sync / Queue status */}
      {queueVal !== undefined && (
        <div
          className={cn(
            "mt-2.5 flex items-center justify-between border-t pt-2 font-mono text-[10px]",
            isLight ? "border-slate-100" : "border-[#282C34]",
          )}
        >
          <span className="text-slate-400">EVENT QUEUE STATUS:</span>
          {queueVal === 0 ? (
            <span className="font-bold text-emerald-500">✓ 0 PENDING (SYNCED)</span>
          ) : (
            <span className="font-bold text-amber-500">⚠ {queueVal} EVENTS QUEUED</span>
          )}
        </div>
      )}
    </div>
  );
}
