import { type EasingFunction, resolveEasing, type SpringOptions } from "./easing";
import {
  buildTransformString,
  defaultUnitForProperty,
  interpolateColor,
  isTransformProperty,
  parseColor,
  parseValue,
  resolveRelativeValue,
} from "./interpolator";
import { globalTicker } from "./ticker";

export type AnimationTarget = string | HTMLElement | SVGElement | Record<string, any> | Array<any> | NodeListOf<any>;

export interface AnimationParams {
  duration?: number;
  delay?: number | ((target: any, index: number, total: number) => number);
  endDelay?: number;
  easing?: string | EasingFunction | SpringOptions;
  loop?: boolean | number;
  direction?: "normal" | "reverse" | "alternate";
  autoplay?: boolean;
  keyframes?: Array<Record<string, any>>;
  onBegin?: (anim: AnimationInstance) => void;
  onUpdate?: (anim: AnimationInstance) => void;
  onRender?: (anim: AnimationInstance) => void;
  onLoop?: (anim: AnimationInstance) => void;
  onComplete?: (anim: AnimationInstance) => void;
  [property: string]: any;
}

interface TargetPropertyTrack {
  target: any;
  isDOM: boolean;
  property: string;
  isTransform: boolean;
  isColor: boolean;
  startValue: number;
  endValue: number;
  startColor?: string;
  endColor?: string;
  unit: string;
  delay: number;
  duration: number;
  easing: EasingFunction;
}

export class AnimationInstance {
  public targets: Array<any> = [];
  public duration = 1000;
  public delay = 0;
  public endDelay = 0;
  public loop: number | boolean = 1;
  public direction: "normal" | "reverse" | "alternate" = "normal";
  public currentTime = 0;
  public progress = 0;
  public paused = true;
  public completed = false;
  public began = false;
  public loopCount = 0;

  // 1:1 with Anime.js: await animation.finished
  public finished: Promise<AnimationInstance>;
  private resolveFinished?: (value: AnimationInstance) => void;

  private tracks: Array<TargetPropertyTrack> = [];
  private params: AnimationParams;
  private isReversedDirection = false;
  private tickerUnsub: (() => void) | null = null;
  private transformsByTarget = new Map<any, Map<string, { value: number; unit: string }>>();

  constructor(targets: AnimationTarget, params: AnimationParams) {
    this.params = params;
    this.resolveTargets(targets);
    this.finished = new Promise<AnimationInstance>((resolve) => {
      this.resolveFinished = resolve;
    });

    this.initTracks();

    if (params.autoplay !== false) {
      this.play();
    }
  }

  private resolveTargets(targets: AnimationTarget): void {
    if (typeof targets === "string") {
      if (typeof document !== "undefined") {
        this.targets = Array.from(document.querySelectorAll(targets));
      } else {
        this.targets = [];
      }
    } else if (targets instanceof NodeList) {
      this.targets = Array.from(targets);
    } else if (Array.isArray(targets)) {
      this.targets = targets.flatMap((t) =>
        typeof t === "string" && typeof document !== "undefined" ? Array.from(document.querySelectorAll(t)) : t,
      );
    } else if (targets) {
      this.targets = [targets];
    }
  }

  private initTracks(): void {
    const totalTargets = this.targets.length;
    let maxTotalDuration = 0;

    const baseEasingResult = resolveEasing(this.params.easing);
    const defaultDuration = this.params.duration ?? baseEasingResult.duration ?? 1000;

    this.targets.forEach((target, index) => {
      const isDOM =
        typeof HTMLElement !== "undefined" && (target instanceof HTMLElement || target instanceof SVGElement);

      if (isDOM) {
        // Anti-slop GPU acceleration promotion
        target.style.willChange = "transform, opacity";
        if (!this.transformsByTarget.has(target)) {
          this.transformsByTarget.set(target, new Map());
        }
      }

      // Compute item delay (supports stagger function or numeric)
      let itemDelay = 0;
      if (typeof this.params.delay === "function") {
        itemDelay = this.params.delay(target, index, totalTargets);
      } else if (typeof this.params.delay === "number") {
        itemDelay = this.params.delay;
      }

      const itemEndDelay = this.params.endDelay ?? 0;

      // Extract animated properties
      for (const [key, value] of Object.entries(this.params)) {
        if (
          [
            "duration",
            "delay",
            "endDelay",
            "easing",
            "loop",
            "direction",
            "autoplay",
            "keyframes",
            "onBegin",
            "onUpdate",
            "onRender",
            "onLoop",
            "onComplete",
          ].includes(key)
        ) {
          continue;
        }

        const isTransform = isTransformProperty(key);
        let startVal = 0;
        let endVal = 0;
        let unit = defaultUnitForProperty(key);
        let isColor = false;
        let startColor: string | undefined;
        let endColor: string | undefined;

        // Check if value is color string
        if (typeof value === "string" && parseColor(value)) {
          isColor = true;
          endColor = value;
          startColor = isDOM ? getComputedStyle(target)[key as any] || "#ffffff" : "#ffffff";
        } else {
          // Read initial starting value
          if (isDOM) {
            if (key === "opacity") {
              const comp = parseFloat(getComputedStyle(target).opacity || "1");
              startVal = Number.isNaN(comp) ? 1 : comp;
            } else if (!isTransform) {
              const styleVal = getComputedStyle(target)[key as any] ?? "0";
              const comp = parseFloat(styleVal);
              startVal = Number.isNaN(comp) ? 0 : comp;
            }
          } else if (typeof target[key] === "number") {
            startVal = target[key];
          }

          // Parse target end value
          let targetRawVal: any = value;
          if (Array.isArray(value)) {
            if (value.length === 2) {
              const pStart = parseValue(value[0] ?? 0);
              startVal = pStart.num;
              targetRawVal = value[1];
            }
          }

          const parsedEnd = parseValue(targetRawVal ?? 0);
          if (parsedEnd.unit) unit = parsedEnd.unit;
          endVal = resolveRelativeValue(startVal, parsedEnd);
        }

        const trackDuration = defaultDuration;
        const totalTrackTime = itemDelay + trackDuration + itemEndDelay;
        if (totalTrackTime > maxTotalDuration) {
          maxTotalDuration = totalTrackTime;
        }

        this.tracks.push({
          target,
          isDOM,
          property: key,
          isTransform,
          isColor,
          startValue: startVal,
          endValue: endVal,
          startColor,
          endColor,
          unit,
          delay: itemDelay,
          duration: trackDuration,
          easing: baseEasingResult.fn,
        });
      }
    });

    this.duration = maxTotalDuration;
    this.direction = this.params.direction ?? "normal";
    this.loop = this.params.loop ?? 1;
    this.endDelay = this.params.endDelay ?? 0;
  }

  public play(): this {
    if (!this.paused) return this;
    this.paused = false;

    if (!this.began) {
      this.began = true;
      this.params.onBegin?.(this);
    }

    this.tickerUnsub = globalTicker.subscribe((delta) => {
      this.tick(delta);
    });
    return this;
  }

  public pause(): this {
    if (this.paused) return this;
    this.paused = true;
    if (this.tickerUnsub) {
      this.tickerUnsub();
      this.tickerUnsub = null;
    }
    return this;
  }

  public restart(): this {
    this.pause();
    this.currentTime = 0;
    this.progress = 0;
    this.loopCount = 0;
    this.completed = false;
    this.began = false;
    this.isReversedDirection = false;
    this.seek(0);
    return this.play();
  }

  public reverse(): this {
    this.isReversedDirection = !this.isReversedDirection;
    return this;
  }

  public seek(timeMs: number): this {
    this.currentTime = Math.max(0, Math.min(timeMs, this.duration));
    this.progress = this.duration > 0 ? this.currentTime / this.duration : 1;
    this.render();

    if (this.currentTime >= this.duration && !this.completed) {
      this.completed = true;
      this.pause();
      this.cleanup();
      this.params.onComplete?.(this);
      this.resolveFinished?.(this);
    }

    return this;
  }

  public setProgress(ratio: number): this {
    return this.seek(ratio * this.duration);
  }

  public tick(deltaTime: number): void {
    if (this.completed) return;

    if (this.isReversedDirection) {
      this.currentTime -= deltaTime;
    } else {
      this.currentTime += deltaTime;
    }

    const isOverEnd = this.currentTime >= this.duration;
    const isBeforeStart = this.currentTime <= 0;

    if (isOverEnd || (this.isReversedDirection && isBeforeStart)) {
      this.loopCount++;
      this.params.onLoop?.(this);

      const isInfinite = this.loop === true;
      const hasMoreLoops = isInfinite || (typeof this.loop === "number" && this.loopCount < this.loop);

      if (hasMoreLoops) {
        if (this.direction === "alternate") {
          this.isReversedDirection = !this.isReversedDirection;
          this.currentTime = this.isReversedDirection ? this.duration : 0;
        } else {
          this.currentTime = 0;
        }
      } else {
        this.currentTime = this.isReversedDirection ? 0 : this.duration;
        this.completed = true;
        this.render();
        this.pause();
        this.cleanup();
        this.params.onComplete?.(this);
        this.resolveFinished?.(this);
        return;
      }
    }

    this.progress = this.duration > 0 ? Math.max(0, Math.min(1, this.currentTime / this.duration)) : 1;
    this.render();
    this.params.onUpdate?.(this);
  }

  private render(): void {
    // Phase 2: Pure render & write pass with zero DOM layout reads
    this.tracks.forEach((track) => {
      const elapsed = this.currentTime - track.delay;
      let ratio = 0;

      if (elapsed <= 0) {
        ratio = 0;
      } else if (elapsed >= track.duration) {
        ratio = 1;
      } else {
        ratio = elapsed / track.duration;
      }

      const easedRatio = track.easing(ratio);

      if (track.isColor && track.startColor && track.endColor) {
        const colorVal = interpolateColor(track.startColor, track.endColor, easedRatio);
        if (track.isDOM) {
          track.target.style[track.property] = colorVal;
        } else {
          track.target[track.property] = colorVal;
        }
      } else {
        const currentVal = track.startValue + (track.endValue - track.startValue) * easedRatio;

        if (track.isDOM) {
          if (track.isTransform) {
            const tMap = this.transformsByTarget.get(track.target);
            if (tMap) {
              tMap.set(track.property, { value: currentVal, unit: track.unit });
            }
          } else if (track.property === "opacity") {
            track.target.style.opacity = currentVal.toFixed(4);
          } else {
            track.target.style[track.property] = `${currentVal.toFixed(4)}${track.unit}`;
          }
        } else {
          track.target[track.property] = currentVal;
        }
      }
    });

    // Write all combined 3D transforms in a single composite pass
    this.transformsByTarget.forEach((transformMap, target) => {
      target.style.transform = buildTransformString(transformMap);
    });

    this.params.onRender?.(this);
  }

  private cleanup(): void {
    // Release will-change optimization
    this.targets.forEach((target) => {
      if (typeof HTMLElement !== "undefined" && (target instanceof HTMLElement || target instanceof SVGElement)) {
        target.style.willChange = "";
      }
    });
  }
}

/**
 * 1:1 Anime.js animation factory function.
 */
export function animate(targets: AnimationTarget, params: AnimationParams): AnimationInstance {
  return new AnimationInstance(targets, params);
}
