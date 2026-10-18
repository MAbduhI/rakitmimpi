"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../Atom/icon";

export interface ComboBoxOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  options: Array<ComboBoxOption>;
  value?: string | Array<string>;
  onChange?: (value: string | Array<string>) => void;
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  onSearchChange?: (query: string) => void;
  loading?: boolean;
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  onSearchChange,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onSearchChange?.(val);
  };

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const next = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(next);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const filteredOptions = onSearchChange
    ? options
    : options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase()) ||
          opt.value.toLowerCase().includes(search.toLowerCase()),
      );

  return (
    <div ref={containerRef} className={cn("relative w-full text-sm", className)}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
          } else if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className={cn(
          "flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-surface px-3 py-2 text-primary shadow-xs transition-colors",
          "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {selectedValues.length === 0 && <span className="text-secondary">{placeholder}</span>}
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            const label = opt?.label ?? val;
            return multiple ? (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded bg-surface-alt px-2 py-0.5 font-medium text-primary text-xs"
              >
                {label}
                <button
                  type="button"
                  aria-label={`Remove ${label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(val);
                  }}
                  className="cursor-pointer hover:text-accent focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ) : (
              <span key={val}>{label}</span>
            );
          })}
        </div>
        <Icon name="chevron-down" className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-md">
          <div className="sticky top-0 bg-surface pb-1">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full rounded border border-input bg-surface-alt px-2 py-1 text-primary text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          {loading && <div className="p-2 text-center text-secondary text-xs">Loading suggestions...</div>}
          {!loading && filteredOptions.length === 0 && (
            <div className="p-2 text-center text-secondary text-xs">No results found.</div>
          )}
          {!loading &&
            filteredOptions.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors",
                    isSelected ? "bg-accent/15 font-medium text-accent" : "text-primary hover:bg-surface-alt",
                    opt.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Icon name="check" className="size-3.5" />}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};
