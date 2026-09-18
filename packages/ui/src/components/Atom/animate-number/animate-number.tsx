import { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { type AnimationInstance, animate } from "../../../animation/tween";
import { cn } from "../../../utils/cn";

export interface AnimateNumberProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  from?: number;
  duration?: number;
  easing?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
}

export function AnimateNumber({
  value,
  from,
  duration = 1200,
  easing = "easeOutExpo",
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
  ...props
}: AnimateNumberProps) {
  const [displayValue, setDisplayValue] = useState(from ?? value);
  const stateRef = useRef({ current: from ?? 0 });
  const animRef = useRef<AnimationInstance | null>(null);

  useEffect(() => {
    animRef.current?.pause();
    animRef.current = animate(stateRef.current, {
      current: value,
      duration,
      easing,
      onUpdate: () => {
        setDisplayValue(stateRef.current.current);
      },
    });

    return () => {
      animRef.current?.pause();
    };
  }, [value, duration, easing]);

  let formatted = "";
  if (format) {
    formatted = format(displayValue);
  } else if (decimals > 0) {
    formatted = displayValue.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } else {
    formatted = Math.round(displayValue).toLocaleString();
  }

  return (
    <span className={cn("tabular-nums", className)} {...props}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
