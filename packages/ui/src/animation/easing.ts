export type EasingFunction = (t: number) => number;

export interface SpringOptions {
  mass?: number;
  stiffness?: number;
  damping?: number;
  velocity?: number;
}

export interface SpringResult {
  ease: EasingFunction;
  duration: number;
}

function easeOutBounceHelper(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) {
    return n1 * t * t;
  }
  if (t < 2 / d1) {
    const t1 = t - 1.5 / d1;
    return n1 * t1 * t1 + 0.75;
  }
  if (t < 2.5 / d1) {
    const t1 = t - 2.25 / d1;
    return n1 * t1 * t1 + 0.9375;
  }
  const t1 = t - 2.625 / d1;
  return n1 * t1 * t1 + 0.984375;
}

// ─── STANDARD PENNER EASING CURVES ──────────────────────────────────────────
const penner: Record<string, EasingFunction> = {
  linear: (t: number) => t,

  // Quad
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => {
    const t1 = t - 1;
    return t1 * t1 * t1 + 1;
  },
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  // Quart
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => {
    const t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
  },
  easeInOutQuart: (t: number) => {
    const t1 = t - 1;
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
  },

  // Quint
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => {
    const t1 = t - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
  },
  easeInOutQuint: (t: number) => {
    const t1 = t - 1;
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
  },

  // Sine
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => 0.5 * (1 - Math.cos(Math.PI * t)),

  // Expo
  easeInExpo: (t: number) => (t === 0 ? 0 : 2 ** (10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5 ? 0.5 * 2 ** (20 * t - 10) : 1 - 0.5 * 2 ** (-20 * t + 10);
  },

  // Circ
  easeInCirc: (t: number) => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t: number) => Math.sqrt(1 - (t - 1) ** 2),
  easeInOutCirc: (t: number) =>
    t < 0.5 ? 0.5 * (1 - Math.sqrt(1 - 4 * t * t)) : 0.5 * (Math.sqrt(1 - (-2 * t + 2) ** 2) + 1),

  // Back (Overshoot)
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const t1 = t - 1;
    return 1 + c3 * t1 * t1 * t1 + c1 * t1 * t1;
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    const t2 = t * 2;
    const t2Sub = t2 - 2;
    return t < 0.5 ? (t2 ** 2 * ((c2 + 1) * t2 - c2)) / 2 : (t2Sub ** 2 * ((c2 + 1) * t2Sub + c2) + 2) / 2;
  },

  // Elastic
  easeInElastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return -(2 ** (10 * (t - 1))) * Math.sin(((t - 1.1) * 2 * Math.PI) / 0.4);
  },
  easeOutElastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return 2 ** (-10 * t) * Math.sin(((t - 0.1) * 2 * Math.PI) / 0.4) + 1;
  },
  easeInOutElastic: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const t2 = t * 2;
    return t2 < 1
      ? -0.5 * 2 ** (10 * (t2 - 1)) * Math.sin(((t2 - 1.1) * 2 * Math.PI) / 0.4)
      : 0.5 * 2 ** (-10 * (t2 - 1)) * Math.sin(((t2 - 1.1) * 2 * Math.PI) / 0.4) + 1;
  },

  // Bounce
  easeOutBounce: easeOutBounceHelper,
  easeInBounce: (t: number) => 1 - easeOutBounceHelper(1 - t),
  easeInOutBounce: (t: number) =>
    t < 0.5 ? 0.5 * (1 - easeOutBounceHelper(1 - 2 * t)) : 0.5 * (1 + easeOutBounceHelper(2 * t - 1)),
};

// ─── CUBIC BEZIER SOLVER (Newton-Raphson) ────────────────────────────────────
export function cubicBezier(mX1: number, mY1: number, mX2: number, mY2: number): EasingFunction {
  if (mX1 === mY1 && mX2 === mY2) return (t: number) => t;

  return (x: number): number => {
    if (x === 0 || x === 1) return x;
    let t = x;
    // 5 iterations of Newton's method
    for (let i = 0; i < 5; i++) {
      const currentSlope = 3 * (1 - 3 * mX2 + 3 * mX1) * t * t + 2 * (3 * mX2 - 6 * mX1) * t + 3 * mX1;
      if (currentSlope === 0) break;
      const currentX = ((1 - 3 * mX2 + 3 * mX1) * t + (3 * mX2 - 6 * mX1)) * t * t + 3 * mX1 * t - x;
      t -= currentX / currentSlope;
    }
    return ((1 - 3 * mY2 + 3 * mY1) * t + (3 * mY2 - 6 * mY1)) * t * t + 3 * mY1 * t;
  };
}

// ─── STEPPED EASING ─────────────────────────────────────────────────────────
export function steps(n: number): EasingFunction {
  const count = Math.max(1, Math.round(n));
  return (t: number) => Math.min(1, Math.floor(t * count) / count);
}

// ─── PHYSICAL SPRING GENERATOR ──────────────────────────────────────────────
export function spring(options: SpringOptions = {}): SpringResult {
  const mass = options.mass ?? 1;
  const stiffness = options.stiffness ?? 100;
  const damping = options.damping ?? 10;
  const initialVelocity = options.velocity ?? 0;

  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;

  // Approximate settling time (tolerance 0.001)
  const settlingSecs = zeta < 1 ? -Math.log(0.001) / (zeta * w0) : 1;
  const duration = Math.min(Math.max(settlingSecs * 1000, 250), 4000);

  const ease: EasingFunction = (progress: number) => {
    if (progress >= 1) return 1;
    const t = (progress * duration) / 1000;
    if (zeta < 1) {
      const envelope = Math.exp(-zeta * w0 * t);
      const pos = 1 - envelope * (Math.cos(wd * t) + ((zeta * w0 - initialVelocity) / wd) * Math.sin(wd * t));
      return pos;
    }
    // Over-damped / critically damped
    const envelope = Math.exp(-w0 * t);
    return 1 - envelope * (1 + (w0 - initialVelocity) * t);
  };

  return { ease, duration };
}

// ─── RESOLVE EASING HELPER ──────────────────────────────────────────────────
export function resolveEasing(ease: string | EasingFunction | SpringOptions | undefined): {
  fn: EasingFunction;
  duration?: number;
} {
  const defaultEase = penner.easeOutQuad ?? ((t: number) => t);
  if (!ease) return { fn: defaultEase };
  if (typeof ease === "function") return { fn: ease };
  if (typeof ease === "object") {
    const s = spring(ease);
    return { fn: s.ease, duration: s.duration };
  }

  const str = ease.trim();
  const found = penner[str];
  if (found) {
    return { fn: found };
  }

  // Parse cubic-bezier(x1, y1, x2, y2)
  const cbMatch = str.match(/^cubic-?bezier\s*\(\s*([\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*([\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/i);
  if (cbMatch?.[1] && cbMatch[2] && cbMatch[3] && cbMatch[4]) {
    return {
      fn: cubicBezier(parseFloat(cbMatch[1]), parseFloat(cbMatch[2]), parseFloat(cbMatch[3]), parseFloat(cbMatch[4])),
    };
  }

  // Parse steps(n)
  const stepMatch = str.match(/^steps\s*\(\s*(\d+)\s*\)$/i);
  if (stepMatch?.[1]) {
    return { fn: steps(parseInt(stepMatch[1], 10)) };
  }

  // Parse spring(mass, stiffness, damping, velocity)
  const springMatch = str.match(/^spring\s*\(\s*([\d.]+)?\s*,?\s*([\d.]+)?\s*,?\s*([\d.]+)?\s*,?\s*(-?[\d.]+)?\s*\)$/i);
  if (springMatch) {
    const s = spring({
      mass: springMatch[1] ? parseFloat(springMatch[1]) : 1,
      stiffness: springMatch[2] ? parseFloat(springMatch[2]) : 100,
      damping: springMatch[3] ? parseFloat(springMatch[3]) : 10,
      velocity: springMatch[4] ? parseFloat(springMatch[4]) : 0,
    });
    return { fn: s.ease, duration: s.duration };
  }

  return { fn: defaultEase };
}

export const easings = penner;
