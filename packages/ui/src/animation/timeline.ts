import { type AnimationInstance, type AnimationParams, type AnimationTarget, animate } from "./tween";

export interface TimelineParams {
  defaults?: Partial<AnimationParams>;
  loop?: boolean | number;
  direction?: "normal" | "reverse" | "alternate";
  autoplay?: boolean;
  onBegin?: (tl: Timeline) => void;
  onUpdate?: (tl: Timeline) => void;
  onComplete?: (tl: Timeline) => void;
}

interface TimelineChild {
  instance: AnimationInstance;
  startTime: number;
  duration: number;
}

export class Timeline {
  public duration = 0;
  public currentTime = 0;
  public progress = 0;
  public paused = true;
  public completed = false;
  public finished: Promise<Timeline>;

  private resolveFinished?: (tl: Timeline) => void;
  private children: Array<TimelineChild> = [];
  private labels = new Map<string, number>();
  private params: TimelineParams;
  private isReversed = false;

  constructor(params: TimelineParams = {}) {
    this.params = params;
    this.finished = new Promise<Timeline>((resolve) => {
      this.resolveFinished = resolve;
    });

    if (params.autoplay !== false) {
      this.play();
    }
  }

  public addLabel(label: string, timeOffset: number = this.duration): this {
    this.labels.set(label, timeOffset);
    return this;
  }

  public add(targets: AnimationTarget, params: AnimationParams = {}, timePosition?: number | string): this {
    // Merge with timeline default parameters
    const mergedParams: AnimationParams = {
      ...this.params.defaults,
      ...params,
      autoplay: false, // Timeline governs playback
    };

    const instance = animate(targets, mergedParams);
    const itemDuration = instance.duration;

    // Parse time position (offset, relative, sync, or label)
    let startTime = this.duration;

    if (typeof timePosition === "number") {
      startTime = Math.max(0, timePosition);
    } else if (typeof timePosition === "string") {
      const trimmed = timePosition.trim();
      if (trimmed === "<") {
        // Start aligned with previous child's start
        startTime = this.children.length > 0 ? (this.children[this.children.length - 1]?.startTime ?? 0) : 0;
      } else if (trimmed === ">") {
        // Start aligned with previous child's end
        startTime = this.duration;
      } else if (trimmed.startsWith("+=")) {
        startTime = this.duration + parseFloat(trimmed.slice(2));
      } else if (trimmed.startsWith("-=")) {
        startTime = Math.max(0, this.duration - parseFloat(trimmed.slice(2)));
      } else {
        // Check for label or label with offset (e.g. "marker+=200")
        for (const [lbl, lblTime] of this.labels.entries()) {
          if (trimmed.startsWith(lbl)) {
            const rest = trimmed.slice(lbl.length).trim();
            if (rest.startsWith("+=")) {
              startTime = lblTime + parseFloat(rest.slice(2));
            } else if (rest.startsWith("-=")) {
              startTime = Math.max(0, lblTime - parseFloat(rest.slice(2)));
            } else {
              startTime = lblTime;
            }
            break;
          }
        }
      }
    }

    this.children.push({
      instance,
      startTime,
      duration: itemDuration,
    });

    const endTime = startTime + itemDuration;
    if (endTime > this.duration) {
      this.duration = endTime;
    }

    return this;
  }

  public seek(timeMs: number): this {
    this.currentTime = Math.max(0, Math.min(timeMs, this.duration));
    this.progress = this.duration > 0 ? this.currentTime / this.duration : 1;

    // Step each child to relative local timeline time
    for (const child of this.children) {
      const localTime = this.currentTime - child.startTime;
      child.instance.seek(localTime);
    }

    this.params.onUpdate?.(this);

    if (this.currentTime >= this.duration && !this.completed) {
      this.completed = true;
      this.params.onComplete?.(this);
      this.resolveFinished?.(this);
    }

    return this;
  }

  public play(): this {
    this.paused = false;
    this.params.onBegin?.(this);
    for (const child of this.children) {
      child.instance.play();
    }
    return this;
  }

  public pause(): this {
    this.paused = true;
    for (const child of this.children) {
      child.instance.pause();
    }
    return this;
  }

  public restart(): this {
    this.completed = false;
    this.seek(0);
    return this.play();
  }

  public reverse(): this {
    this.isReversed = !this.isReversed;
    for (const child of this.children) {
      child.instance.reverse();
    }
    return this;
  }
}

export function createTimeline(params: TimelineParams = {}): Timeline {
  return new Timeline(params);
}
