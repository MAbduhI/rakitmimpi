export interface MotionProperties {
  opacity?: number;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotate?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  skewX?: number | string;
  skewY?: number | string;
  filter?: string;
  backgroundColor?: string;
  color?: string;
  [key: string]: any;
}

export interface TransitionConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  loop?: boolean | number;
  direction?: "normal" | "reverse" | "alternate";
}

export interface MotionVariant {
  initial?: MotionProperties;
  animate: MotionProperties;
  exit?: MotionProperties;
  transition?: TransitionConfig;
  whileHover?: MotionProperties;
  whileTap?: MotionProperties;
}

export type PresetName =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "pop"
  | "zoom-in"
  | "zoom-out"
  | "flip-x"
  | "flip-y"
  | "rotate-in"
  | "blur-in"
  | "elastic-up"
  | "bounce-in"
  | "float"
  | "pulse"
  | "shake";

export const motionPresets: Record<PresetName, MotionVariant> = {
  // ─── FADE FAMILY ──────────────────────────────────────────────────────────
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 350, easing: "easeOutQuad" },
  },
  "fade-up": {
    initial: { opacity: 0, translateY: 24 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: -20 },
    transition: { duration: 400, easing: "easeOutCubic" },
  },
  "fade-down": {
    initial: { opacity: 0, translateY: -24 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: 20 },
    transition: { duration: 400, easing: "easeOutCubic" },
  },
  "fade-left": {
    initial: { opacity: 0, translateX: 24 },
    animate: { opacity: 1, translateX: 0 },
    exit: { opacity: 0, translateX: -20 },
    transition: { duration: 400, easing: "easeOutCubic" },
  },
  "fade-right": {
    initial: { opacity: 0, translateX: -24 },
    animate: { opacity: 1, translateX: 0 },
    exit: { opacity: 0, translateX: 20 },
    transition: { duration: 400, easing: "easeOutCubic" },
  },

  // ─── SLIDE FAMILY ─────────────────────────────────────────────────────────
  "slide-up": {
    initial: { translateY: "100%" },
    animate: { translateY: "0%" },
    exit: { translateY: "100%" },
    transition: { duration: 450, easing: "easeOutCubic" },
  },
  "slide-down": {
    initial: { translateY: "-100%" },
    animate: { translateY: "0%" },
    exit: { translateY: "-100%" },
    transition: { duration: 450, easing: "easeOutCubic" },
  },
  "slide-left": {
    initial: { translateX: "100%" },
    animate: { translateX: "0%" },
    exit: { translateX: "100%" },
    transition: { duration: 450, easing: "easeOutCubic" },
  },
  "slide-right": {
    initial: { translateX: "-100%" },
    animate: { translateX: "0%" },
    exit: { translateX: "-100%" },
    transition: { duration: 450, easing: "easeOutCubic" },
  },

  // ─── SCALE & ZOOM FAMILY ──────────────────────────────────────────────────
  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 },
    transition: { duration: 350, easing: "easeOutBack" },
  },
  "zoom-in": {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    transition: { duration: 400, easing: "easeOutExpo" },
  },
  "zoom-out": {
    initial: { opacity: 0, scale: 1.25 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.15 },
    transition: { duration: 400, easing: "easeOutCubic" },
  },

  // ─── 3D ROTATE & FLIP FAMILY ──────────────────────────────────────────────
  "flip-x": {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
    transition: { duration: 500, easing: "easeOutCubic" },
  },
  "flip-y": {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
    transition: { duration: 500, easing: "easeOutCubic" },
  },
  "rotate-in": {
    initial: { opacity: 0, rotate: -180, scale: 0.7 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 180, scale: 0.7 },
    transition: { duration: 500, easing: "easeOutBack" },
  },

  // ─── BLUR & FILTER FAMILY ─────────────────────────────────────────────────
  "blur-in": {
    initial: { opacity: 0, filter: "blur(12px)", scale: 0.95 },
    animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
    exit: { opacity: 0, filter: "blur(10px)", scale: 0.95 },
    transition: { duration: 450, easing: "easeOutCubic" },
  },

  // ─── SPRING & BOUNCE FAMILY ───────────────────────────────────────────────
  "elastic-up": {
    initial: { opacity: 0, translateY: 45 },
    animate: { opacity: 1, translateY: 0 },
    exit: { opacity: 0, translateY: 30 },
    transition: { duration: 800, easing: "easeOutElastic" },
  },
  "bounce-in": {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.3 },
    transition: { duration: 750, easing: "easeOutBounce" },
  },

  // ─── ATTENTION & LOOP FAMILY ──────────────────────────────────────────────
  float: {
    animate: { translateY: -12 },
    transition: { duration: 1800, loop: true, direction: "alternate", easing: "easeInOutSine" },
  },
  pulse: {
    animate: { scale: 1.06, opacity: 0.9 },
    transition: { duration: 900, loop: true, direction: "alternate", easing: "easeInOutQuad" },
  },
  shake: {
    animate: { translateX: [-6, 6, -4, 4, -2, 2, 0] as any },
    transition: { duration: 500, easing: "easeInOutQuad" },
  },
};

export function getPresetVariant(name: PresetName): MotionVariant {
  return motionPresets[name] || motionPresets.fade;
}
