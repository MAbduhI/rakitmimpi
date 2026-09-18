export type TickerSubscriber = (deltaTime: number, currentTime: number) => void;

export class Ticker {
  private subscribers: Array<TickerSubscriber> = [];
  private rafId: number | null = null;
  private lastTime = 0;
  private isRunning = false;
  public timeScale = 1.0;

  // Maximum delta threshold (64ms ~ 15fps) to prevent tab-switch teleportation / slop
  private readonly maxDelta = 64;

  public subscribe(fn: TickerSubscriber): () => void {
    this.subscribers.push(fn);
    if (!this.isRunning) {
      this.start();
    }
    return () => {
      this.unsubscribe(fn);
    };
  }

  public unsubscribe(fn: TickerSubscriber): void {
    const idx = this.subscribers.indexOf(fn);
    if (idx !== -1) {
      this.subscribers.splice(idx, 1);
    }
    if (this.subscribers.length === 0) {
      this.stop();
    }
  }

  public getSubscriberCount(): number {
    return this.subscribers.length;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    this.loop = this.loop.bind(this);
    if (typeof requestAnimationFrame !== "undefined") {
      this.rafId = requestAnimationFrame(this.loop);
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Allow manual stepping for test suites and headless environments
  public step(customDelta?: number, customTime?: number): void {
    const currentTime = customTime ?? (typeof performance !== "undefined" ? performance.now() : Date.now());
    const rawDelta = customDelta ?? (this.lastTime ? currentTime - this.lastTime : 16.6667);
    const delta = Math.min(rawDelta, this.maxDelta) * this.timeScale;
    this.lastTime = currentTime;

    const subs = [...this.subscribers];
    for (const sub of subs) {
      sub(delta, currentTime);
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;
    const rawDelta = this.lastTime ? currentTime - this.lastTime : 16.6667;
    const delta = Math.min(rawDelta, this.maxDelta) * this.timeScale;
    this.lastTime = currentTime;

    const subs = [...this.subscribers];
    for (const sub of subs) {
      sub(delta, currentTime);
    }

    if (this.subscribers.length > 0 && typeof requestAnimationFrame !== "undefined") {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      this.stop();
    }
  }
}

export const globalTicker = new Ticker();
