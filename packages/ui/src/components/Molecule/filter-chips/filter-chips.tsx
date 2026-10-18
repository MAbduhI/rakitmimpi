import { useState, type ReactNode } from "react";
import { cn } from "../../../utils";
import { Icon } from "../../Atom/icon";

export interface FilterChipItem<T extends string = string> {
  value: T;
  label: ReactNode;
  count?: number;
}

export interface FilterChipsProps<T extends string = string> {
  items: FilterChipItem<T>[];
  selectedValues?: T[];
  defaultValues?: T[];
  onChange?: (selectedValues: T[]) => void;
  multiple?: boolean;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}

export function FilterChips<T extends string = string>({
  items,
  selectedValues,
  defaultValues = [],
  onChange,
  multiple = true,
  size = "md",
  className,
  disabled = false,
}: FilterChipsProps<T>) {
  const [internalValues, setInternalValues] = useState<T[]>(defaultValues);

  const activeValues = selectedValues !== undefined ? selectedValues : internalValues;

  const handleToggle = (value: T) => {
    if (disabled) return;
    let next: T[];
    if (multiple) {
      next = activeValues.includes(value)
        ? activeValues.filter((v) => v !== value)
        : [...activeValues, value];
    } else {
      next = activeValues.includes(value) ? [] : [value];
    }

    if (selectedValues === undefined) {
      setInternalValues(next);
    }
    onChange?.(next);
  };

  const handleClearAll = () => {
    if (disabled || activeValues.length === 0) return;
    if (selectedValues === undefined) {
      setInternalValues([]);
    }
    onChange?.([]);
  };

  const sizeClasses = {
    sm: "h-7 px-2.5 text-xs gap-1",
    md: "h-8.5 px-3 text-xs font-medium gap-1.5",
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => {
        const isSelected = activeValues.includes(item.value);

        return (
          <button
            key={item.value}
            type="button"
            disabled={disabled}
            onClick={() => handleToggle(item.value)}
            className={cn(
              "inline-flex items-center rounded-full border transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              sizeClasses[size],
              isSelected
                ? "bg-accent text-accent-foreground border-accent shadow-2xs"
                : "bg-surface text-secondary border-border hover:border-input hover:text-primary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-bold leading-none",
                  isSelected
                    ? "bg-white/20 text-accent-foreground"
                    : "bg-surface-alt text-secondary"
                )}
              >
                {item.count}
              </span>
            )}
            {isSelected && (
              <Icon name="check" className="size-3.5 stroke-[2.5] ml-0.5" />
            )}
          </button>
        );
      })}

      {activeValues.length > 0 && (
        <button
          type="button"
          disabled={disabled}
          onClick={handleClearAll}
          className="text-xs text-secondary hover:text-primary underline ml-1 font-medium transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
