import { IconCrosshair, IconShieldCheck, IconWifi } from "@tabler/icons-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";
import { StatusChip } from "../../Atom/status-chip";

export type CameraHUDTheme = "dark" | "light" | "transparent";

export interface CameraViewfinderHUDProps extends HTMLAttributes<HTMLDivElement> {
  timestamp?: string;
  coordinates?: string;
  altitude?: string;
  accuracy?: string;
  deviceSerial?: string;
  /** @deprecated Use deviceSerial */
  kitSerial?: string;
  signalQuality?: number | string;
  /** @deprecated Use signalQuality */
  dishSnr?: number | string;
  speedLabel?: number | string;
  /** @deprecated Use speedLabel */
  dishSpeed?: number | string;
  gpsLocked?: boolean;
  mockGpsDetected?: boolean;
  alignmentValid?: boolean;
  /** @deprecated Use alignmentValid */
  pitchValid?: boolean;
  lineOfSightClear?: boolean;
  /** @deprecated Use lineOfSightClear */
  obstructionClear?: boolean;
  theme?: CameraHUDTheme;
  reticleColor?: string;
  shutterSlot?: ReactNode;
}

export function CameraViewfinderHUD({
  children,
  className,
  timestamp = "2026-10-18 07:15:22 WIB",
  coordinates = "-6.3982° S, 106.8342° E",
  altitude = "98m",
  accuracy = "±3m",
  deviceSerial,
  kitSerial,
  signalQuality,
  dishSnr,
  speedLabel,
  dishSpeed,
  gpsLocked = true,
  mockGpsDetected = false,
  alignmentValid,
  pitchValid,
  lineOfSightClear,
  obstructionClear,
  theme = "dark",
  reticleColor,
  shutterSlot,
  ...props
}: CameraViewfinderHUDProps) {
  const isLight = theme === "light";
  const activeDeviceSerial = deviceSerial || kitSerial || "DEV-0429188";
  const activeSignal = signalQuality ?? dishSnr ?? "Good (12.4 dB)";
  const activeSpeed = speedLabel ?? dishSpeed ?? "184 Mbps";
  const isAlignmentOk = alignmentValid ?? pitchValid ?? true;
  const isClearLOS = lineOfSightClear ?? obstructionClear ?? true;

  const defaultReticleColor = reticleColor || (isLight ? "border-indigo-600" : "border-sky-400");
  const crosshairDotColor = isLight ? "bg-indigo-600" : "bg-sky-400";
  const crosshairRingColor = isLight ? "border-indigo-600/40" : "border-sky-400/40";

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full max-w-sm select-none overflow-hidden rounded-xl border shadow-2xl transition-colors",
        theme === "dark" && "border-white/10 bg-slate-950 text-white",
        theme === "light" && "border-slate-200 bg-white text-slate-800 shadow-lg",
        theme === "transparent" && "border-transparent bg-transparent text-white shadow-none",
        className,
      )}
      {...props}
    >
      {/* Background / Video Feed Area */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          isLight
            ? "bg-gradient-to-b from-slate-100/70 via-slate-200/30 to-slate-100/90"
            : "bg-gradient-to-b from-slate-900/60 via-slate-950/20 to-slate-950/80",
        )}
      >
        {children}
      </div>

      {/* Viewfinder Target Reticle Frame */}
      <div className="pointer-events-none absolute inset-6 z-10 flex flex-col justify-between">
        {/* Top Corners */}
        <div className="flex justify-between">
          <div className={cn("size-6 rounded-tl-sm border-t-2 border-l-2", defaultReticleColor)} />
          <div className={cn("size-6 rounded-tr-sm border-t-2 border-r-2", defaultReticleColor)} />
        </div>

        {/* Center Target Crosshair */}
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className={cn("size-16 rounded-full border", crosshairRingColor)} />
            <div className={cn("absolute size-2 rounded-full", crosshairDotColor)} />
            <div className={cn("absolute h-6 w-0.5", isLight ? "bg-indigo-600/40" : "bg-sky-400/40")} />
            <div className={cn("absolute h-0.5 w-6", isLight ? "bg-indigo-600/40" : "bg-sky-400/40")} />
          </div>
        </div>

        {/* Bottom Corners */}
        <div className="flex justify-between">
          <div className={cn("size-6 rounded-bl-sm border-b-2 border-l-2", defaultReticleColor)} />
          <div className={cn("size-6 rounded-br-sm border-r-2 border-b-2", defaultReticleColor)} />
        </div>
      </div>

      {/* HUD Top Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 backdrop-blur-xs">
        <StatusChip
          status={gpsLocked ? (mockGpsDetected ? "down" : "up") : "warn"}
          label={gpsLocked ? (mockGpsDetected ? "FAKE GPS DETECTED" : "GPS LOCKED") : "ACQUIRING..."}
          pulse={!mockGpsDetected && gpsLocked}
          size="xs"
        />

        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] backdrop-blur-sm",
            isLight
              ? "border-slate-200 bg-white/80 text-slate-700 shadow-xs"
              : "border-white/10 bg-black/60 text-slate-300",
          )}
        >
          <IconWifi className="size-3 text-emerald-500 dark:text-emerald-400" />
          <span>{activeSpeed}</span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeSignal}</span>
        </div>
      </div>

      {/* Validation Checklist Overlay */}
      <div className="relative z-20 space-y-1 px-4">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px]",
            isLight ? "border-slate-200 bg-white/80 text-slate-700" : "border-white/5 bg-black/50 text-slate-300",
          )}
        >
          <IconShieldCheck
            className={cn(
              "size-3",
              !mockGpsDetected ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400",
            )}
          />
          <span>Anti-Mock GPS: {!mockGpsDetected ? "PASSED" : "FAILED"}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span
            className={cn(
              isAlignmentOk ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
            )}
          >
            {isAlignmentOk ? "✓ Alignment OK" : "⚠ Adjust Alignment"}
          </span>
          <span className="text-slate-400">•</span>
          <span
            className={cn(isClearLOS ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}
          >
            {isClearLOS ? "✓ Line of Sight Clear" : "⚠ Obstructed"}
          </span>
        </div>
      </div>

      {/* Bottom HUD Watermark & Controls */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 space-y-3 p-4",
          isLight
            ? "bg-gradient-to-t from-white via-white/85 to-transparent text-slate-800"
            : "bg-gradient-to-t from-black via-black/80 to-transparent text-slate-300",
        )}
      >
        {/* Monospace Telemetry Watermark */}
        <div
          className={cn(
            "rounded border p-2 font-mono text-[10px] leading-relaxed shadow-sm",
            isLight ? "border-slate-200 bg-white/95 text-slate-700" : "border-white/10 bg-black/70 text-slate-300",
          )}
        >
          <div className="flex justify-between">
            <span className={isLight ? "text-slate-500" : "text-slate-400"}>{timestamp}</span>
            <span className={cn("font-bold", isLight ? "text-indigo-600" : "text-sky-300")}>{activeDeviceSerial}</span>
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <span
              className={cn("flex items-center gap-1 font-semibold", isLight ? "text-emerald-700" : "text-emerald-400")}
            >
              <IconCrosshair className="size-3" />
              {coordinates}
            </span>
            <span className={isLight ? "text-slate-500" : "text-slate-400"}>
              {altitude} ({accuracy})
            </span>
          </div>
        </div>

        {/* Shutter Button Slot */}
        {shutterSlot && <div className="flex justify-center pt-1">{shutterSlot}</div>}
      </div>
    </div>
  );
}
