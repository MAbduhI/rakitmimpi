"use client";

import { useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export interface WorkTimerCardProps extends HTMLAttributes<HTMLDivElement> {
  hasClockedIn: boolean;
  hasClockedOut: boolean;
  clockInTime?: string;
  shiftName?: string;
  shiftTime?: string;
  targetHours?: number; // default 8
  onClockIn?: () => void;
  onClockOut?: () => void;
  loading?: boolean;
  geofenceStatus?: string;
}

export function WorkTimerCard({
  hasClockedIn,
  hasClockedOut,
  clockInTime,
  shiftName = "Shift Reguler",
  shiftTime = "08:30 - 17:30 WIB",
  targetHours = 8,
  onClockIn,
  onClockOut,
  loading = false,
  geofenceStatus = "Terverifikasi dalam radius kantor",
  className,
  ...props
}: WorkTimerCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );

      if (hasClockedIn && !hasClockedOut && clockInTime) {
        const start = new Date(clockInTime).getTime();
        const diff = Math.max(0, Math.floor((now.getTime() - start) / 1000));
        setElapsedSeconds(diff);
      } else if (!hasClockedIn) {
        setElapsedSeconds(0);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [hasClockedIn, hasClockedOut, clockInTime]);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  const totalTargetSeconds = targetHours * 3600;
  const progressPct = Math.min(100, Math.max(0, (elapsedSeconds / totalTargetSeconds) * 100));

  return (
    <div
      className={cn(
        "p-6 rounded-md bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm dark:shadow-xl flex flex-col justify-between space-y-4",
        className
      )}
      {...props}
    >
      {/* Header with Digital Clock */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Presensi Mandiri Karyawan
          </span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
            {shiftName} ({shiftTime})
          </h3>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-emerald-400 block">
            {currentTime || "00:00:00 WIB"}
          </span>
          <span className="text-[10px] text-slate-500">Waktu Indonesia Barat</span>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="text-center py-2 space-y-2">
        <span className="text-xs text-slate-400 font-medium">
          {hasClockedIn && !hasClockedOut
            ? "Durasi Jam Kerja Berjalan Hari Ini"
            : hasClockedOut
            ? "Sesi Kerja Hari Ini Telah Selesai"
            : "Belum Melakukan Check-In Hari Ini"}
        </span>

        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
          <span>{String(hours).padStart(2, "0")}</span>
          <span className="text-emerald-500 animate-pulse">:</span>
          <span>{String(minutes).padStart(2, "0")}</span>
          <span className="text-emerald-500 animate-pulse">:</span>
          <span className="text-slate-400 text-3xl sm:text-4xl">{String(seconds).padStart(2, "0")}</span>
        </div>

        {/* Progress Towards 8-Hour Goal */}
        <div className="space-y-1 max-w-xs mx-auto pt-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Target: {targetHours} Jam</span>
            <span>{progressPct.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Geofence & Location Note */}
      <div className="p-2.5 rounded-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span className="text-emerald-400 text-sm">📍</span>
        <span className="text-[11px] truncate">{geofenceStatus}</span>
      </div>

      {/* Quick Action Button */}
      <div>
        {!hasClockedIn ? (
          <button
            type="button"
            disabled={loading}
            onClick={onClockIn}
            className="w-full py-3 rounded-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <span>▶</span> {loading ? "Mencatat Presensi..." : "Tap Masuk (Clock-In)"}
          </button>
        ) : !hasClockedOut ? (
          <button
            type="button"
            disabled={loading}
            onClick={onClockOut}
            className="w-full py-3 rounded-sm bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            <span>⏹</span> {loading ? "Mencatat Pulang..." : "Tap Pulang (Clock-Out)"}
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-sm bg-slate-800/80 text-slate-400 text-xs font-semibold text-center border border-slate-700">
            ✓ Presensi Hari Ini Lengkap
          </div>
        )}
      </div>
    </div>
  );
}
