import { describe, expect, it, vi } from "vitest";
import { Ticker } from "./ticker";

describe("Ticker", () => {
  it("subscribes and receives delta time on step", () => {
    const ticker = new Ticker();
    const fn = vi.fn();
    const unsub = ticker.subscribe(fn);

    expect(ticker.getSubscriberCount()).toBe(1);
    expect(ticker.getIsRunning()).toBe(true);

    ticker.step(16.6667, 100);
    expect(fn).toHaveBeenCalledWith(16.6667, 100);

    unsub();
    expect(ticker.getSubscriberCount()).toBe(0);
    expect(ticker.getIsRunning()).toBe(false);
  });

  it("clamps large delta times to prevent sleep teleportation", () => {
    const ticker = new Ticker();
    const fn = vi.fn();
    ticker.subscribe(fn);

    // 2000ms delta (simulating inactive tab wake-up)
    ticker.step(2000, 2100);
    // Should be clamped to 64ms max delta
    expect(fn).toHaveBeenCalledWith(64, 2100);
    ticker.stop();
  });

  it("scales delta time by timeScale", () => {
    const ticker = new Ticker();
    ticker.timeScale = 2.0;
    const fn = vi.fn();
    ticker.subscribe(fn);

    ticker.step(20, 100);
    expect(fn).toHaveBeenCalledWith(40, 100);
    ticker.stop();
  });
});
