import { type HTMLAttributes, type MouseEvent as ReactMouseEvent, useId, useState } from "react";
import { cn } from "../../../utils/cn";

export interface TelemetryDataPoint {
  timestamp: string | number;
  label?: string;
  rx: number; // Downlink / Inbound (e.g. Mbps)
  tx: number; // Uplink / Outbound (e.g. Mbps)
}

export type TimeRangeOption = "3h" | "24h" | "7d" | "30d";

export interface TelemetryAreaChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Array<TelemetryDataPoint>;
  title?: string;
  subtitle?: string;
  unit?: string;
  height?: number;
  timeRanges?: Array<TimeRangeOption>;
  activeRange?: TimeRangeOption;
  onRangeChange?: (range: TimeRangeOption) => void;
  rxLabel?: string;
  txLabel?: string;
  rxColor?: string;
  txColor?: string;
  invertedTx?: boolean;
  theme?: "dark" | "light";
}

export function TelemetryAreaChart({
  className,
  data,
  title = "Network Throughput & Traffic",
  subtitle = "Dual-Stream Inbound (Rx) / Outbound (Tx)",
  unit = "Mbps",
  height = 220,
  timeRanges = ["3h", "24h", "7d", "30d"],
  activeRange = "24h",
  onRangeChange,
  rxLabel = "Inbound (Rx)",
  txLabel = "Outbound (Tx)",
  rxColor = "#10B981", // Emerald / Green
  txColor = "#3B82F6", // Blue
  invertedTx = false,
  theme = "dark",
  ...props
}: TelemetryAreaChartProps) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isLight = theme === "light";

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border p-8 text-xs",
          isLight ? "border-slate-200 bg-slate-50 text-slate-500" : "border-[#282C34] bg-[#1D2127] text-slate-400",
          className,
        )}
      >
        No telemetry stream available
      </div>
    );
  }

  const maxRx = Math.max(...data.map((d) => d.rx), 1);
  const maxTx = Math.max(...data.map((d) => d.tx), 1);
  const peakVal = Math.max(maxRx, maxTx);
  const avgRx = (data.reduce((acc, d) => acc + d.rx, 0) / data.length).toFixed(1);
  const avgTx = (data.reduce((acc, d) => acc + d.tx, 0) / data.length).toFixed(1);
  const lastItem = data[data.length - 1] ?? { rx: 0, tx: 0 };
  const curRx = lastItem.rx.toFixed(1);
  const curTx = lastItem.tx.toFixed(1);

  const paddingLeft = 40;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;
  const viewBoxWidth = 600;
  const viewBoxHeight = height;

  const chartWidth = viewBoxWidth - paddingLeft - paddingRight;
  const chartHeight = viewBoxHeight - paddingTop - paddingBottom;

  // Calculate points
  const pointsRx = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.rx / peakVal) * chartHeight;
    return { x, y, raw: d };
  });

  const pointsTx = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1 || 1)) * chartWidth;
    const y = invertedTx
      ? paddingTop + (d.tx / peakVal) * chartHeight
      : paddingTop + chartHeight - (d.tx / peakVal) * chartHeight;
    return { x, y, raw: d };
  });

  const firstRx = pointsRx[0] ?? { x: paddingLeft, y: paddingTop + chartHeight };
  const lastRx = pointsRx[pointsRx.length - 1] ?? { x: paddingLeft + chartWidth, y: paddingTop + chartHeight };
  const firstTx = pointsTx[0] ?? { x: paddingLeft, y: paddingTop + chartHeight };
  const lastTx = pointsTx[pointsTx.length - 1] ?? { x: paddingLeft + chartWidth, y: paddingTop + chartHeight };

  const pathRx = pointsRx.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");
  const areaRx = `${pathRx} L ${lastRx.x} ${paddingTop + chartHeight} L ${firstRx.x} ${paddingTop + chartHeight} Z`;

  const pathTx = pointsTx.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");
  const areaTx = `${pathTx} L ${lastTx.x} ${paddingTop + chartHeight} L ${firstTx.x} ${paddingTop + chartHeight} Z`;

  const hoveredPoint = hoverIndex !== null ? (data[hoverIndex] ?? null) : null;
  const hoveredRxPoint = hoverIndex !== null ? pointsRx[hoverIndex] : undefined;
  const hoveredTxPoint = hoverIndex !== null ? pointsTx[hoverIndex] : undefined;

  const gridStroke = isLight ? "#E2E8F0" : "#282C34";
  const labelColor = isLight ? "#64748B" : "#5C6370";

  const handleMouseMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const x = e.clientX - rect.left;
    const relativeX = (x / rect.width) * viewBoxWidth;
    const clampedX = Math.max(paddingLeft, Math.min(viewBoxWidth - paddingRight, relativeX));
    const ratio = (clampedX - paddingLeft) / (chartWidth || 1);
    const index = Math.round(ratio * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, index)));
  };

  return (
    <div
      className={cn(
        "select-none rounded-md border p-4 shadow-sm transition-colors",
        isLight ? "border-slate-200 bg-white text-slate-800" : "border-[#282C34] bg-[#1D2127] text-[#ECEFF4]",
        className,
      )}
      {...props}
    >
      {/* Header bar */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 border-b pb-3",
          isLight ? "border-slate-100" : "border-[#282C34]",
        )}
      >
        <div>
          <h3
            className={cn("font-sans font-semibold text-sm tracking-wide", isLight ? "text-slate-900" : "text-white")}
          >
            {title}
          </h3>
          {subtitle && (
            <p className={cn("font-sans text-[11px]", isLight ? "text-slate-500" : "text-slate-400")}>{subtitle}</p>
          )}
        </div>

        {/* Time range buttons */}
        <div
          className={cn(
            "flex items-center gap-1 rounded border p-0.5",
            isLight ? "border-slate-200 bg-slate-100" : "border-[#282C34] bg-[#181A1F]",
          )}
        >
          {timeRanges.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange?.(r)}
              className={cn(
                "rounded-sm px-2 py-0.5 font-medium font-mono text-[11px] transition-colors",
                activeRange === r
                  ? isLight
                    ? "bg-indigo-600 font-bold text-white"
                    : "bg-[#61AFEF] font-bold text-[#14171D]"
                  : isLight
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-400 hover:text-white",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="h-auto w-full cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <title>{title}</title>
          <defs>
            <linearGradient id={`rxGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rxColor} stopOpacity={isLight ? "0.25" : "0.35"} />
              <stop offset="100%" stopColor={rxColor} stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id={`txGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={txColor} stopOpacity={isLight ? "0.25" : "0.35"} />
              <stop offset="100%" stopColor={txColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = (peakVal * ratio).toFixed(0);
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={viewBoxWidth - paddingRight}
                  y2={y}
                  stroke={gridStroke}
                  strokeDasharray="2 3"
                />
                <text x={paddingLeft - 6} y={y + 3} textAnchor="end" fill={labelColor} className="font-mono text-[9px]">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Rx Area & Line */}
          <path d={areaRx} fill={`url(#rxGrad-${gradientId})`} />
          <path d={pathRx} fill="none" stroke={rxColor} strokeWidth="2" strokeLinecap="round" />

          {/* Tx Area & Line */}
          <path d={areaTx} fill={`url(#txGrad-${gradientId})`} />
          <path
            d={pathTx}
            fill="none"
            stroke={txColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray={invertedTx ? "4 3" : undefined}
          />

          {/* Hover Crosshair */}
          {hoveredRxPoint && hoveredTxPoint && (
            <g>
              <line
                x1={hoveredRxPoint.x}
                y1={paddingTop}
                x2={hoveredRxPoint.x}
                y2={paddingTop + chartHeight}
                stroke={isLight ? "#94A3B8" : "#ABB2BF"}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredRxPoint.x}
                cy={hoveredRxPoint.y}
                r="4"
                fill={rxColor}
                stroke={isLight ? "#FFFFFF" : "#14171D"}
                strokeWidth="2"
              />
              <circle
                cx={hoveredTxPoint.x}
                cy={hoveredTxPoint.y}
                r="4"
                fill={txColor}
                stroke={isLight ? "#FFFFFF" : "#14171D"}
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && hoverIndex !== null && (
          <div
            className={cn(
              "pointer-events-none absolute top-2 rounded border px-2.5 py-1.5 font-mono text-[11px] shadow-lg backdrop-blur-xs",
              isLight
                ? "border-slate-200 bg-white/95 text-slate-800"
                : "border-[#282C34] bg-[#181A1F]/95 text-[#ECEFF4]",
            )}
            style={{
              left: `${Math.min(Math.max(10, (hoverIndex / (data.length - 1 || 1)) * 100), 80)}%`,
            }}
          >
            <div
              className={cn(
                "border-b pb-1 text-[10px]",
                isLight ? "border-slate-100 text-slate-500" : "border-[#282C34] text-slate-400",
              )}
            >
              {hoveredPoint.label || `T-${hoveredPoint.timestamp}`}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="font-bold text-emerald-500">
                Rx: {hoveredPoint.rx} {unit}
              </span>
              <span className="font-bold text-blue-500">
                Tx: {hoveredPoint.tx} {unit}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Legend & Metrics footer */}
      <div
        className={cn(
          "mt-3 grid grid-cols-2 gap-2 border-t pt-3 font-mono text-[11px] sm:grid-cols-4",
          isLight ? "border-slate-100" : "border-[#282C34]",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: rxColor }} />
          <span className="text-slate-400">{rxLabel}:</span>
          <span className={cn("font-semibold", isLight ? "text-slate-900" : "text-white")}>
            {curRx} {unit}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: txColor }} />
          <span className="text-slate-400">{txLabel}:</span>
          <span className={cn("font-semibold", isLight ? "text-slate-900" : "text-white")}>
            {curTx} {unit}
          </span>
        </div>

        <div className="text-slate-400">
          Max:{" "}
          <span className={isLight ? "font-semibold text-slate-700" : "text-slate-200"}>
            {maxRx.toFixed(1)} / {maxTx.toFixed(1)} {unit}
          </span>
        </div>

        <div className="text-slate-400">
          Avg:{" "}
          <span className={isLight ? "font-semibold text-slate-700" : "text-slate-200"}>
            {avgRx} / {avgTx} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
