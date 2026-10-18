import { IconAlertTriangle, IconDeviceMobile, IconLock, IconX } from "@tabler/icons-react";
import type { HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";
import { Button } from "../../Atom/button";

export interface ActiveDeviceInfo {
  deviceName: string;
  os?: string;
  ipAddress: string;
  location?: string;
  sessionId?: string;
  lastActive: string;
}

export interface SessionTakeoverModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTakeover: () => void;
  device: ActiveDeviceInfo;
  isTakingOver?: boolean;
  theme?: "dark" | "light";
  title?: string;
  description?: string;
  warningMessage?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function SessionTakeoverModal({
  className,
  isOpen,
  onClose,
  onConfirmTakeover,
  device,
  isTakingOver = false,
  theme = "dark",
  title = "Sesi Aktif Ditemukan",
  description = "Akun ini sedang aktif di perangkat lain.",
  warningMessage = "Melanjutkan di perangkat ini akan mengakhiri sesi aktif di perangkat sebelumnya demi keamanan akun Anda.",
  cancelLabel = "Batal",
  confirmLabel = "Ambil Alih Sesi",
  ...props
}: SessionTakeoverModalProps) {
  if (!isOpen) return null;

  const isLight = theme === "light";

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200">
      <div
        className={cn(
          "relative w-full max-w-md select-none rounded-lg border p-6 shadow-2xl transition-colors",
          isLight ? "border-slate-200 bg-white text-slate-800" : "border-[#282C34] bg-[#1D2127] text-[#ECEFF4]",
          className,
        )}
        {...props}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 rounded p-1 transition-colors",
            isLight ? "text-slate-400 hover:text-slate-800" : "text-slate-400 hover:text-white",
          )}
          disabled={isTakingOver}
        >
          <IconX className="size-4" />
        </button>

        {/* Header with warning icon */}
        <div className={cn("flex items-center gap-3 border-b pb-4", isLight ? "border-slate-100" : "border-[#282C34]")}>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-rose-500/20 bg-rose-500/10 text-rose-500">
            <IconAlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className={cn("font-sans font-semibold text-base", isLight ? "text-slate-900" : "text-white")}>
              {title}
            </h3>
            <p className="font-sans text-slate-500 text-xs">{description}</p>
          </div>
        </div>

        {/* Device Details Card */}
        <div
          className={cn(
            "mt-4 space-y-2 rounded-md border p-3 text-xs",
            isLight ? "border-slate-200 bg-slate-50 text-slate-700" : "border-[#282C34] bg-[#181A1F] text-slate-300",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between border-b pb-2",
              isLight ? "border-slate-200" : "border-[#282C34]",
            )}
          >
            <div className="flex items-center gap-2 font-medium">
              <IconDeviceMobile className="size-4 text-sky-500" />
              <span>{device.deviceName}</span>
            </div>
            {device.os && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-[10px]",
                  isLight ? "bg-slate-200 text-slate-700" : "bg-black/30 text-slate-400",
                )}
              >
                {device.os}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[11px]">
            <span className="text-slate-400">IP Address:</span>
            <span className="text-right font-medium">{device.ipAddress}</span>

            {device.location && (
              <>
                <span className="text-slate-400">Lokasi:</span>
                <span className="text-right">{device.location}</span>
              </>
            )}

            {device.sessionId && (
              <>
                <span className="text-slate-400">Session ID:</span>
                <span className="truncate pl-2 text-right">{device.sessionId}</span>
              </>
            )}

            <span className="text-slate-400">Terakhir Aktif:</span>
            <span className="text-right font-medium text-amber-500">{device.lastActive}</span>
          </div>
        </div>

        {/* Warning callout */}
        <div className="mt-4 flex items-start gap-2.5 rounded-sm border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-700 text-xs dark:text-amber-300">
          <IconLock className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <p className="leading-snug">{warningMessage}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-2">
          <Button variant="secondary" size="sm" shape="sm" onClick={onClose} disabled={isTakingOver}>
            {cancelLabel}
          </Button>

          <Button variant="destructive" size="sm" shape="sm" loading={isTakingOver} onClick={onConfirmTakeover}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
