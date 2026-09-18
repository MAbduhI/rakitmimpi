import { type HTMLAttributes, useEffect, useRef } from "react";
import { type AnimationInstance, animate } from "../../../animation/tween";
import { cn } from "../../../utils/cn";

export interface MagneticProps extends HTMLAttributes<HTMLDivElement> {
  strength?: number; // Distance pull multiplier (default 0.35)
}

export function Magnetic({ strength = 0.35, className, children, ...props }: MagneticProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationInstance | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: globalThis.MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      animRef.current?.pause();
      animRef.current = animate(el, {
        translateX: deltaX,
        translateY: deltaY,
        duration: 300,
        easing: "easeOutQuad",
      });
    };

    const handleLeave = () => {
      animRef.current?.pause();
      animRef.current = animate(el, {
        translateX: 0,
        translateY: 0,
        duration: 650,
        easing: "easeOutElastic",
      });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      animRef.current?.pause();
    };
  }, [strength]);

  return (
    <div ref={containerRef} className={cn("inline-block", className)} {...props}>
      {children}
    </div>
  );
}
