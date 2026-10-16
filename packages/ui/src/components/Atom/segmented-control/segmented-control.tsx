import { useState, type ReactNode } from "react";
import { cn } from "../../../utils";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  fullWidth = false,
  className,
  disabled = false,
}: SegmentedControlProps<T>) {
  const [internalValue, setInternalValue] = useState<T>(
    defaultValue ?? (options[0]?.value as T)
  );

  const activeValue = value !== undefined ? value : internalValue;

  const handleSelect = (val: T) => {
    if (disabled) return;
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const sizeClasses = {
    sm: "h-8 p-0.5 text-xs",
    md: "h-9.5 p-1 text-sm",
    lg: "h-11 p-1 text-sm font-medium",
  };

  const itemSizeClasses = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1",
    lg: "px-4 py-1.5",
  };

  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center rounded-lg bg-surface-alt border border-border/80 select-none shadow-2xs",
        sizeClasses[size],
        fullWidth && "w-full",
        disabled && "opacity-50 pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === activeValue;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10",
              itemSizeClasses[size],
              fullWidth && "flex-1",
              isSelected
                ? "bg-surface text-primary shadow-xs font-semibold"
                : "text-secondary hover:text-primary hover:bg-surface-hover/50",
              isDisabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
