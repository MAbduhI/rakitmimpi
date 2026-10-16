import { useState, type HTMLAttributes } from "react";
import { cn } from "../../../utils";
import { Icon } from "../icon";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Maximum number of stars (default 5) */
  max?: number;
  /** Current rating value */
  value?: number;
  /** Default value for uncontrolled mode */
  defaultValue?: number;
  /** Callback fired when rating value changes */
  onChange?: (value: number) => void;
  /** Read-only display mode (e.g. for eCommerce reviews) */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Rating star size */
  size?: "sm" | "md" | "lg";
  /** Optional review count / helper text */
  reviewCount?: number | string;
}

export function Rating({
  max = 5,
  value,
  defaultValue = 0,
  onChange,
  readOnly = false,
  disabled = false,
  size = "md",
  reviewCount,
  className,
  ...props
}: RatingProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const activeValue = hoverValue !== null ? hoverValue : currentValue;

  const handleClick = (starIndex: number) => {
    if (readOnly || disabled) return;
    if (value === undefined) {
      setInternalValue(starIndex);
    }
    onChange?.(starIndex);
  };

  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        disabled && "opacity-50 pointer-events-none cursor-not-allowed",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= activeValue;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={readOnly || disabled}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => !readOnly && !disabled && setHoverValue(starIndex)}
              onMouseLeave={() => !readOnly && !disabled && setHoverValue(null)}
              className={cn(
                "p-0.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm",
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
                isFilled ? "text-amber-400" : "text-border hover:text-amber-200"
              )}
              aria-label={`Rate ${starIndex} of ${max}`}
            >
              <Icon
                name={isFilled ? "star-filled" : "star"}
                className={cn(sizeClasses[size], "transition-transform")}
              />
            </button>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-secondary text-xs font-medium ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
