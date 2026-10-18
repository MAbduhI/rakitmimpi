import { IconBarcode, IconCheck } from "@tabler/icons-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";
import { StatusChip } from "../../Atom/status-chip";

export type BarcodeLaserColor = "cyan" | "emerald" | "amber" | "rose" | "indigo" | "primary";
export type BarcodeTheme = "dark" | "light" | "transparent";

export interface BarcodeScannerReticleProps extends HTMLAttributes<HTMLDivElement> {
  scannedCode?: string;
  guideText?: string;
  scanning?: boolean;
  theme?: BarcodeTheme;
  laserColor?: BarcodeLaserColor;
  cornerColor?: string;
  actionSlot?: ReactNode;
}

export function BarcodeScannerReticle({
  children,
  className,
  scannedCode,
  guideText = "Arahkan kamera ke QR / Barcode",
  scanning = true,
  theme = "dark",
  laserColor = "cyan",
  cornerColor,
  actionSlot,
  ...props
}: BarcodeScannerReticleProps) {
  const isLight = theme === "light";

  const laserGradients: Record<BarcodeLaserColor, string> = {
    cyan: "from-cyan-500/0 via-cyan-400 to-cyan-500/0",
    emerald: "from-emerald-500/0 via-emerald-400 to-emerald-500/0",
    amber: "from-amber-500/0 via-amber-400 to-amber-500/0",
    rose: "from-rose-500/0 via-rose-400 to-rose-500/0",
    indigo: "from-indigo-500/0 via-indigo-400 to-indigo-500/0",
    primary: "from-accent/0 via-accent to-accent/0",
  };

  const defaultCornerColor = cornerColor || (isLight ? "border-indigo-600" : "border-cyan-400");

  return (
    <div
      className={cn(
        "relative flex aspect-square w-full max-w-xs select-none flex-col items-center justify-between overflow-hidden rounded-xl border p-6 shadow-xl transition-colors",
        theme === "dark" && "border-white/10 bg-slate-950 text-white",
        theme === "light" && "border-slate-200 bg-white text-slate-800 shadow-md",
        theme === "transparent" && "border-transparent bg-transparent text-white shadow-none",
        className,
      )}
      {...props}
    >
      {/* Background slot (video feed / placeholder) */}
      <div className="absolute inset-0 z-0 bg-slate-500/5">{children}</div>

      {/* Target Reticle Box */}
      <div className="relative z-10 flex size-48 flex-col justify-between p-1">
        {/* Top Corners */}
        <div className="flex justify-between">
          <div className={cn("size-6 rounded-tl-sm border-t-3 border-l-3", defaultCornerColor)} />
          <div className={cn("size-6 rounded-tr-sm border-t-3 border-r-3", defaultCornerColor)} />
        </div>

        {/* Center Laser Beam Scan Line */}
        {scanning && (
          <div className="pointer-events-none absolute inset-x-2 top-0 bottom-0 flex items-center justify-center">
            <div className={cn("h-0.5 w-full animate-pulse bg-gradient-to-r shadow-lg", laserGradients[laserColor])} />
          </div>
        )}

        {/* Center Target Icon / Dim watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
          <IconBarcode className={cn("size-20", isLight ? "text-slate-400" : "text-white")} />
        </div>

        {/* Bottom Corners */}
        <div className="flex justify-between">
          <div className={cn("size-6 rounded-bl-sm border-b-3 border-l-3", defaultCornerColor)} />
          <div className={cn("size-6 rounded-br-sm border-r-3 border-b-3", defaultCornerColor)} />
        </div>
      </div>

      {/* Guidance and Scanned status */}
      <div className="relative z-10 w-full space-y-2 pt-2 text-center">
        {scannedCode ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 font-mono text-emerald-600 text-xs dark:text-emerald-300">
            <IconCheck className="size-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="font-bold">{scannedCode}</span>
          </div>
        ) : (
          <StatusChip status="pending" label="SCANNING" pulse size="xs" />
        )}

        <p className={cn("font-sans text-[11px] tracking-wide", isLight ? "text-slate-600" : "text-slate-300")}>
          {guideText}
        </p>

        {actionSlot && <div className="pt-1">{actionSlot}</div>}
      </div>
    </div>
  );
}
