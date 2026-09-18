import { type SVGAttributes, useEffect, useRef } from "react";
import { setDashoffset } from "../../../animation/svg";
import { animate } from "../../../animation/tween";
import { cn } from "../../../utils/cn";

export interface SvgDrawProps extends SVGAttributes<SVGSVGElement> {
  path: string;
  duration?: number;
  delay?: number;
  easing?: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  autoPlay?: boolean;
  title?: string;
}

export function SvgDraw({
  path,
  duration = 1500,
  delay = 0,
  easing = "easeInOutCubic",
  stroke = "currentColor",
  strokeWidth = 2,
  fill = "none",
  autoPlay = true,
  title = "Vector Drawing",
  className,
  ...props
}: SvgDrawProps) {
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    const length = setDashoffset(el);

    if (autoPlay) {
      const anim = animate(el, {
        strokeDashoffset: [length, 0],
        duration,
        delay,
        easing,
      });

      return () => {
        anim.pause();
      };
    }
  }, [duration, delay, easing, autoPlay]);

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-24 w-24", className)}
      {...props}
    >
      <title>{title}</title>
      <path
        ref={pathRef}
        d={path}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill}
      />
    </svg>
  );
}
