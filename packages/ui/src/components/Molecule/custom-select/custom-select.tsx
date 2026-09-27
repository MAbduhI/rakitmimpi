"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "../../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: ReactNode;
}

export interface CustomSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
}

export function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi...",
  disabled = false,
  className = "",
  triggerClassName = "",
  menuClassName = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left text-xs", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all duration-150 cursor-pointer",
          "bg-white dark:bg-[#111315] text-slate-800 dark:text-slate-100",
          "border border-slate-200 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500/40",
          "shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500",
          disabled && "opacity-50 cursor-not-allowed",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={cn("truncate font-semibold", !selectedOption && "text-slate-400 font-normal")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <svg
          className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-full min-w-[200px] max-h-60 overflow-y-auto rounded-md p-1.5 shadow-2xl",
            "bg-white dark:bg-[#151719] border border-slate-200 dark:border-white/10",
            "animate-in fade-in zoom-in-95 duration-100 scrollbar-thin",
            menuClassName
          )}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-center text-slate-400 italic text-[11px]">
              Tidak ada opsi
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer",
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <div className="truncate">
                      <div className="truncate text-xs">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-[10px] text-slate-400 font-mono truncate">{opt.sublabel}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
