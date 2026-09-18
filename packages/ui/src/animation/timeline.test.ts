import { describe, expect, it } from "vitest";
import { createTimeline } from "./timeline";

describe("Timeline Sequencer (1:1 with Anime.js)", () => {
  it("chains animations sequentially by default", () => {
    const obj1 = { x: 0 };
    const obj2 = { y: 0 };

    const tl = createTimeline({ autoplay: false });
    tl.add(obj1, { x: 100, duration: 500, easing: "linear" });
    tl.add(obj2, { y: 200, duration: 500, easing: "linear" });

    expect(tl.duration).toBe(1000);

    // At 250ms: obj1 is 50%, obj2 is 0%
    tl.seek(250);
    expect(obj1.x).toBeCloseTo(50, 1);
    expect(obj2.y).toBe(0);

    // At 750ms: obj1 is 100%, obj2 is 50%
    tl.seek(750);
    expect(obj1.x).toBe(100);
    expect(obj2.y).toBeCloseTo(100, 1);

    // At 1000ms: both 100%
    tl.seek(1000);
    expect(obj1.x).toBe(100);
    expect(obj2.y).toBe(200);
  });

  it("supports relative offset position strings (-=200)", () => {
    const obj1 = { a: 0 };
    const obj2 = { b: 0 };

    const tl = createTimeline({ autoplay: false });
    tl.add(obj1, { a: 10, duration: 500 });
    // Starts 200ms before obj1 ends -> starts at 300ms
    tl.add(obj2, { b: 20, duration: 400 }, "-=200");

    expect(tl.duration).toBe(700); // 300 + 400 = 700
  });

  it("supports sync marker '<' (start with previous)", () => {
    const obj1 = { a: 0 };
    const obj2 = { b: 0 };

    const tl = createTimeline({ autoplay: false });
    tl.add(obj1, { a: 10, duration: 600 });
    tl.add(obj2, { b: 20, duration: 600 }, "<");

    expect(tl.duration).toBe(600); // both run in parallel from 0 to 600
  });

  it("supports timeline labels", () => {
    const obj1 = { a: 0 };
    const obj2 = { b: 0 };

    const tl = createTimeline({ autoplay: false });
    tl.add(obj1, { a: 10, duration: 300 });
    tl.addLabel("step2");
    tl.add(obj2, { b: 20, duration: 400 }, "step2+=100");

    expect(tl.duration).toBe(800); // 300 + 100 + 400 = 800
  });
});
