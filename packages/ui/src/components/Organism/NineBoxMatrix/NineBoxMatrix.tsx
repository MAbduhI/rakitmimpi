"use client";
import CustomSelect from "../../Molecule/custom-select/custom-select";


import { useState, useMemo } from "react";

export interface NineBoxEmployee {
  nik: string;
  name: string;
  department: string;
  position: string;
  job_level: string;
  performance_score: number;
  potential_score: number;
  box_index: number;
  box_name: string;
  box_label: string;
  action_plan: string;
  total_attendances: number;
  late_count: number;
  overtime_hours: number;
}

export interface NineBoxMatrixProps {
  employees: NineBoxEmployee[];
  boxSummary?: Record<string | number, number>;
  selectedDepartment?: string;
  onDepartmentChange?: (dept: string) => void;
  departments?: string[];
  className?: string;
}

interface BoxDefinition {
  index: number;
  name: string;
  tagline: string;
  color: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  bgGrad: string;
}

const DEFAULT_BOX: BoxDefinition = {
  index: 5,
  name: "Core Player",
  tagline: "Karyawan Inti Stabil",
  color: "text-blue-700 dark:text-blue-400",
  border: "border-blue-200 hover:border-blue-400 dark:border-blue-500/40 dark:hover:border-blue-400",
  badgeBg: "bg-blue-100 dark:bg-blue-500/10",
  badgeText: "text-blue-700 dark:text-blue-300",
  bgGrad: "bg-blue-50/40 dark:bg-gradient-to-b dark:from-blue-950/20 dark:to-slate-900/40",
};

const BOX_CONFIGS: Record<number, BoxDefinition> = {
  1: {
    index: 1,
    name: "Star",
    tagline: "Calon Pemimpin / Top Talent",
    color: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-500/40 dark:hover:border-emerald-400",
    badgeBg: "bg-emerald-100 dark:bg-emerald-500/10",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    bgGrad: "bg-emerald-50/40 dark:bg-gradient-to-b dark:from-emerald-950/20 dark:to-slate-900/40",
  },
  2: {
    index: 2,
    name: "High Potential",
    tagline: "Potensi Unggul & Cepat Belajar",
    color: "text-teal-700 dark:text-teal-400",
    border: "border-teal-200 hover:border-teal-400 dark:border-teal-500/40 dark:hover:border-teal-400",
    badgeBg: "bg-teal-100 dark:bg-teal-500/10",
    badgeText: "text-teal-700 dark:text-teal-300",
    bgGrad: "bg-teal-50/40 dark:bg-gradient-to-b dark:from-teal-950/20 dark:to-slate-900/40",
  },
  3: {
    index: 3,
    name: "Enigma / Rough Diamond",
    tagline: "Potensi Tinggi, Butuh Penyelarasan",
    color: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 hover:border-indigo-400 dark:border-indigo-500/40 dark:hover:border-indigo-400",
    badgeBg: "bg-indigo-100 dark:bg-indigo-500/10",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    bgGrad: "bg-indigo-50/40 dark:bg-gradient-to-b dark:from-indigo-950/20 dark:to-slate-900/40",
  },
  4: {
    index: 4,
    name: "High Performer",
    tagline: "Performa Tinggi & Andal",
    color: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-200 hover:border-cyan-400 dark:border-cyan-500/40 dark:hover:border-cyan-400",
    badgeBg: "bg-cyan-100 dark:bg-cyan-500/10",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    bgGrad: "bg-cyan-50/40 dark:bg-gradient-to-b dark:from-cyan-950/20 dark:to-slate-900/40",
  },
  5: DEFAULT_BOX,
  6: {
    index: 6,
    name: "Dilemma",
    tagline: "Performa Kurang, Butuh PIP",
    color: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 hover:border-amber-400 dark:border-amber-500/40 dark:hover:border-amber-400",
    badgeBg: "bg-amber-100 dark:bg-amber-500/10",
    badgeText: "text-amber-700 dark:text-amber-300",
    bgGrad: "bg-amber-50/40 dark:bg-gradient-to-b dark:from-amber-950/20 dark:to-slate-900/40",
  },
  7: {
    index: 7,
    name: "Solid Professional",
    tagline: "Spesialis Teknis Andal",
    color: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 hover:border-sky-400 dark:border-sky-500/40 dark:hover:border-sky-400",
    badgeBg: "bg-sky-100 dark:bg-sky-500/10",
    badgeText: "text-sky-700 dark:text-sky-300",
    bgGrad: "bg-sky-50/40 dark:bg-gradient-to-b dark:from-sky-950/20 dark:to-slate-900/40",
  },
  8: {
    index: 8,
    name: "Effective",
    tagline: "Efektif dengan Arahan Jelas",
    color: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600",
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-700 dark:text-slate-300",
    bgGrad: "bg-slate-50 dark:bg-gradient-to-b dark:from-slate-800/30 dark:to-slate-900/40",
  },
  9: {
    index: 9,
    name: "Risk",
    tagline: "Evaluasi Khusus / Risiko Disiplin",
    color: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 hover:border-rose-400 dark:border-rose-500/40 dark:hover:border-rose-400",
    badgeBg: "bg-rose-100 dark:bg-rose-500/10",
    badgeText: "text-rose-700 dark:text-rose-300",
    bgGrad: "bg-rose-50/40 dark:bg-gradient-to-b dark:from-rose-950/20 dark:to-slate-900/40",
  },
};

const MATRIX_LAYOUT = [
  [3, 2, 1], // Baris Atas (Potensi Tinggi): [Enigma, High Potential, Star]
  [6, 5, 4], // Baris Tengah (Potensi Sedang): [Dilemma, Core Player, High Performer]
  [9, 8, 7], // Baris Bawah (Potensi Rendah): [Risk, Effective, Solid Pro]
];

export function NineBoxMatrix({
  employees,
  selectedDepartment = "ALL",
  onDepartmentChange,
  departments = ["ALL", "TECH", "HR", "FINANCE", "OPERATIONS", "SALES"],
  className = "",
}: NineBoxMatrixProps) {
  const [selectedEmp, setSelectedEmp] = useState<NineBoxEmployee | null>(null);

  const groupedByBox = useMemo(() => {
    const map: Record<number, NineBoxEmployee[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [],
    };
    (Array.isArray(employees) ? employees : []).forEach((emp) => {
      const target = map[emp.box_index];
      if (target) {
        target.push(emp);
      }
    });
    return map;
  }, [employees]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header & Department Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl"></span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              9-Box Talent & Performance Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Matriks evaluasi bakat otomatis berdasarkan tingkat presensi, ketepatan waktu, dan pencapaian target kerja.
          </p>
        </div>

        {onDepartmentChange && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Filter Dept:</label>
            <CustomSelect
              value={selectedDepartment || "ALL"}
              onChange={(val) => onDepartmentChange(val)}
              options={(Array.isArray(departments) ? departments : []).map((d) => ({
                value: d,
                label: d === "ALL" ? "Semua Divisi (ALL)" : d,
                badge: d,
              }))}
              className="min-w-[170px]"
            />
          </div>
        )}
      </div>

      {/* Matrix Container with Axis Labels */}
      <div className="relative bg-slate-50/50 dark:bg-slate-950/80 p-4 sm:p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl">
        {/* Clean Axis Description Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-sm bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-4 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-slate-400 uppercase text-[10px] font-bold">Sumbu Y (Vertikal):</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Tingkat Potensi & Disiplin (Potential)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 uppercase text-[10px] font-bold">Sumbu X (Horisontal):</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Pencapaian Target & Kinerja (Performance)</span>
          </div>
        </div>

        {/* 3x3 CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {MATRIX_LAYOUT.flat().map((boxIndex) => {
            const cfg = BOX_CONFIGS[boxIndex] ?? DEFAULT_BOX;
            const emps = groupedByBox[boxIndex] ?? [];

            return (
              <div
                key={boxIndex}
                className="flex flex-col justify-between p-4 rounded-md bg-white dark:bg-[#111315] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs hover:shadow-sm transition-all duration-150 min-h-[160px]"
              >
                {/* Header Sel */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-2.5">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                        {cfg.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {cfg.tagline}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-sans tabular-nums font-bold px-2 py-0.5 rounded-sm border ${cfg.badgeBg} ${cfg.badgeText}`}
                  >
                    {emps.length}
                  </span>
                </div>

                {/* Daftar Karyawan di dalam Kuadran */}
                <div className="py-2.5 space-y-1.5 overflow-y-auto max-h-[140px] pr-1 scrollbar-thin">
                  {emps.length === 0 ? (
                    <span className="text-[11px] text-slate-400 dark:text-slate-600 italic block text-center py-4">
                      Kosong
                    </span>
                  ) : (
                    emps.map((emp) => (
                      <button
                        key={emp.nik}
                        onClick={() => setSelectedEmp(emp)}
                        className="w-full text-left flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/60 dark:border-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                            {(emp.name || emp.nik || "K").charAt(0)}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block truncate">
                              {emp.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-sans tabular-nums block">
                              {emp.position}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-sans tabular-nums font-semibold text-slate-500 dark:text-slate-400">
                            X:{emp.performance_score} Y:{emp.potential_score}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer Keterangan Kuadran */}
                <div className="text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 pt-1 flex justify-between items-center">
                  <span>Kuadran #{boxIndex}</span>
                  <span className="font-semibold truncate max-w-[150px]">{cfg.tagline}</span>
                </div>
              </div>
            );
          })}
        </div>


      </div>

      {/* Modal Detail Evaluasi Karyawan */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-md max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-sans tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedEmp.nik} • {selectedEmp.department}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedEmp.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedEmp.position} ({selectedEmp.job_level})
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                Box #{selectedEmp.box_index}: {selectedEmp.box_name}
              </span>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Skor Kinerja (X)</span>
                <span className="text-base font-sans tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedEmp.performance_score}/100
                </span>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Skor Potensi (Y)</span>
                <span className="text-base font-sans tabular-nums font-bold text-cyan-600 dark:text-cyan-400">
                  {selectedEmp.potential_score}/100
                </span>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total Hadir</span>
                <span className="font-sans tabular-nums font-bold text-slate-800 dark:text-slate-200">
                  {selectedEmp.total_attendances} Hari
                </span>
              </div>
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Jumlah Terlambat</span>
                <span className={`font-sans tabular-nums font-bold ${selectedEmp.late_count > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {selectedEmp.late_count} Kali
                </span>
              </div>
            </div>

            {/* Action Plan Guidance */}
            <div className="p-3 rounded-sm bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block">
                 Rekomendasi Tindak Lanjut HR:
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                {selectedEmp.action_plan}
              </p>
            </div>

            {/* Modal Footer */}
            <button
              onClick={() => setSelectedEmp(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-sm transition"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NineBoxMatrix;
