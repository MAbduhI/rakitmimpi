import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { type AnimationInstance, animate } from "../../../animation/tween";
import {
  getPresetVariant,
  type MotionProperties,
  type PresetName,
  type TransitionConfig,
} from "../../../animation/variants";
import { cn } from "../../../utils/cn";

export interface MotionBaseProps {
  preset?: PresetName;
  initial?: MotionProperties | boolean;
  animate?: MotionProperties;
  exit?: MotionProperties;
  transition?: TransitionConfig;
  whileHover?: MotionProperties;
  whileTap?: MotionProperties;
  className?: string;
}

export type MotionProps<T extends ElementType> = MotionBaseProps &
  Omit<ComponentPropsWithoutRef<T>, keyof MotionBaseProps> & {
    as?: T;
  };

export const MotionComponent = forwardRef(function MotionComponent<T extends ElementType = "div">(
  {
    as,
    preset,
    initial,
    animate: animateProp,
    exit,
    transition,
    whileHover,
    whileTap,
    className,
    children,
    ...props
  }: MotionProps<T>,
  ref: any,
) {
  const Component = as || "div";
  const internalRef = useRef<HTMLElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current);

  const activeAnimRef = useRef<AnimationInstance | null>(null);

  // Resolve presets
  const presetDef = preset ? getPresetVariant(preset) : null;
  const targetInitial = initial === false ? undefined : initial || presetDef?.initial;
  const targetAnimate = animateProp || presetDef?.animate;
  const targetTransition = transition || presetDef?.transition;

  // Mount animation
  useEffect(() => {
    const el = internalRef.current;
    if (!el || !targetAnimate) return;

    // Apply initial properties immediately
    if (targetInitial) {
      for (const [k, v] of Object.entries(targetInitial)) {
        if (k === "opacity") {
          el.style.opacity = String(v);
        } else if (k.startsWith("translate") || k.startsWith("scale") || k.startsWith("rotate")) {
          // Handled via tween
        } else {
          el.style[k as any] = String(v);
        }
      }
    }

    activeAnimRef.current = animate(el, {
      ...targetAnimate,
      duration: targetTransition?.duration ?? 400,
      delay: targetTransition?.delay ?? 0,
      easing: targetTransition?.easing ?? "easeOutCubic",
      loop: targetTransition?.loop,
      direction: targetTransition?.direction,
    });

    return () => {
      activeAnimRef.current?.pause();
    };
  }, [targetAnimate, targetInitial, targetTransition]);

  // Handle Hover interactions
  const handleMouseEnter = () => {
    const el = internalRef.current;
    if (!el || !whileHover) return;
    activeAnimRef.current?.pause();
    activeAnimRef.current = animate(el, {
      ...whileHover,
      duration: 250,
      easing: "easeOutQuad",
    });
  };

  const handleMouseLeave = () => {
    const el = internalRef.current;
    if (!el || !whileHover || !targetAnimate) return;
    activeAnimRef.current?.pause();
    activeAnimRef.current = animate(el, {
      ...targetAnimate,
      duration: 250,
      easing: "easeOutQuad",
    });
  };

  // Handle Tap / Click interactions
  const handleMouseDown = () => {
    const el = internalRef.current;
    if (!el || !whileTap) return;
    activeAnimRef.current?.pause();
    activeAnimRef.current = animate(el, {
      ...whileTap,
      duration: 150,
      easing: "easeOutQuad",
    });
  };

  const handleMouseUp = () => {
    const el = internalRef.current;
    if (!el || !whileTap || !targetAnimate) return;
    activeAnimRef.current?.pause();
    activeAnimRef.current = animate(el, {
      ...targetAnimate,
      duration: 200,
      easing: "easeOutQuad",
    });
  };

  return (
    <Component
      ref={internalRef as any}
      className={cn(className)}
      onMouseEnter={whileHover ? handleMouseEnter : undefined}
      onMouseLeave={whileHover ? handleMouseLeave : undefined}
      onMouseDown={whileTap ? handleMouseDown : undefined}
      onMouseUp={whileTap ? handleMouseUp : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

// Compound Motion object (e.g. <Motion.div>, <Motion.button>, etc.)
export const Motion = Object.assign(MotionComponent, {
  div: forwardRef<HTMLDivElement, MotionBaseProps & ComponentPropsWithoutRef<"div">>((props, ref) => (
    <MotionComponent as="div" ref={ref} {...props} />
  )),
  span: forwardRef<HTMLSpanElement, MotionBaseProps & ComponentPropsWithoutRef<"span">>((props, ref) => (
    <MotionComponent as="span" ref={ref} {...props} />
  )),
  button: forwardRef<HTMLButtonElement, MotionBaseProps & ComponentPropsWithoutRef<"button">>((props, ref) => (
    <MotionComponent as="button" ref={ref} {...props} />
  )),
  section: forwardRef<HTMLElement, MotionBaseProps & ComponentPropsWithoutRef<"section">>((props, ref) => (
    <MotionComponent as="section" ref={ref} {...props} />
  )),
  p: forwardRef<HTMLParagraphElement, MotionBaseProps & ComponentPropsWithoutRef<"p">>((props, ref) => (
    <MotionComponent as="p" ref={ref} {...props} />
  )),
});
