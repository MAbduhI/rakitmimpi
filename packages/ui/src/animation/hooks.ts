import { useEffect, useRef, useState } from "react";
import { type SpringOptions, spring } from "./easing";
import { createTimeline, type Timeline, type TimelineParams } from "./timeline";
import { type AnimationInstance, type AnimationParams, animate } from "./tween";

/**
 * useAnimate hook: provides ref and controls to trigger animations on an element.
 */
export function useAnimate<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const animRef = useRef<AnimationInstance | null>(null);

  const startAnimation = (params: AnimationParams) => {
    if (!ref.current) return null;
    animRef.current?.pause();
    const inst = animate(ref.current, params);
    animRef.current = inst;
    return inst;
  };

  useEffect(() => {
    return () => {
      animRef.current?.pause();
    };
  }, []);

  return {
    ref,
    animate: startAnimation,
    instance: animRef.current,
  };
}

/**
 * useTimeline hook: builds and manages a timeline attached to the component lifecycle.
 */
export function useTimeline(params: TimelineParams = {}) {
  const tlRef = useRef<Timeline | null>(null);

  if (!tlRef.current) {
    tlRef.current = createTimeline({ ...params, autoplay: false });
  }

  useEffect(() => {
    return () => {
      tlRef.current?.pause();
    };
  }, []);

  return tlRef.current;
}

/**
 * useSpring hook: smoothly interpolates a numerical state value using analytical spring physics.
 */
export function useSpring(targetValue: number, options: SpringOptions = {}) {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const stateRef = useRef({ val: targetValue });

  useEffect(() => {
    const s = spring(options);
    const inst = animate(stateRef.current, {
      val: targetValue,
      duration: s.duration,
      easing: s.ease,
      onUpdate: () => {
        setCurrentValue(stateRef.current.val);
      },
    });

    return () => {
      inst.pause();
    };
  }, [targetValue, options.mass, options.stiffness, options.damping, options]);

  return currentValue;
}

/**
 * useInViewAnimate hook: triggers an animation when target enters the viewport.
 */
export function useInViewAnimate<T extends HTMLElement = HTMLDivElement>(
  params: AnimationParams,
  options: IntersectionObserverInit = { threshold: 0.1 },
) {
  const ref = useRef<T | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          animate(el, params);
        }
      });
    }, options);

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [params, options]);

  return ref;
}
