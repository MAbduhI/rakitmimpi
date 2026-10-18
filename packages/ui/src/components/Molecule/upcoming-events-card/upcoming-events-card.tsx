import { type HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

export type EventCategory = "MEETING" | "ONE_ON_ONE" | "INTERVIEW" | "HOLIDAY" | "TRAINING";

export interface ScheduleEventItem {
  id: string;
  title: string;
  category: EventCategory;
  dateStr: string; // e.g. "2026-09-24"
  timeStr: string; // e.g. "10:00 - 11:30 WIB"
  hostOrPerson?: string;
  locationOrPlatform?: string;
}

export interface UpcomingEventsCardProps extends HTMLAttributes<HTMLDivElement> {
  events: ScheduleEventItem[];
  title?: string;
  onAddEvent?: () => void;
  emptyMessage?: string;
}

const CATEGORY_STYLES: Record<EventCategory, { label: string; badge: string; icon: string }> = {
  MEETING: { label: "Rapat Internal", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "" },
  ONE_ON_ONE: { label: "Sesi 1-on-1", badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: "" },
  INTERVIEW: { label: "Interview Pelamar", badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: "" },
  HOLIDAY: { label: "Hari Libur Nasional", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: "" },
  TRAINING: { label: "Pelatihan & Workshop", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "" },
};

export function UpcomingEventsCard({
  events = [],
  title = "Agenda & Jadwal Mendatang",
  onAddEvent,
  emptyMessage = "Tidak ada agenda rapat atau kegiatan terdekat.",
  className,
  ...props
}: UpcomingEventsCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-md bg-white dark:bg-[#111315] border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between space-y-4",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base"></span>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h3>
        </div>

        {onAddEvent && (
          <button
            type="button"
            onClick={onAddEvent}
            className="px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1"
          >
            <span>+</span> Tambah Jadwal
          </button>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
        {events.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500 italic">
            {emptyMessage}
          </div>
        ) : (
          events.map((evt) => {
            const style = CATEGORY_STYLES[evt.category] ?? CATEGORY_STYLES.MEETING;

            return (
              <div
                key={evt.id}
                className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Date Box */}
                <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center shrink-0 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    {evt.dateStr.toUpperCase().includes("SEP") ? "SEP" : "AGT"}
                  </span>
                  <span className="text-sm font-black  text-slate-900 dark:text-white leading-none">
                    {evt.dateStr.match(/\d+/)?.[0] || "25"}
                  </span>
                </div>

                {/* Event Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={cn(
                        "text-[9px]  font-bold px-1.5 py-0.2 rounded border shrink-0",
                        style.badge
                      )}
                    >
                      {style.label}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {evt.title}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                    <span className=" text-emerald-400/90 font-semibold">
                       {evt.timeStr}
                    </span>
                    {evt.hostOrPerson && (
                      <span> {evt.hostOrPerson}</span>
                    )}
                    {evt.locationOrPlatform && (
                      <span className="truncate"> {evt.locationOrPlatform}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
        Semua jadwal disinkronkan secara otomatis dengan kalender perusahaan.
      </div>
    </div>
  );
}

export default UpcomingEventsCard;
