import { describe, expect, it, vi } from "vitest";
import { animate } from "./tween";

describe("Core Tween Engine (1:1 with Anime.js)", () => {
  it("animates plain JavaScript objects", () => {
    const obj = { count: 0 };
    const anim = animate(obj, {
      count: 100,
      duration: 1000,
      autoplay: false,
      easing: "linear",
    });

    expect(anim.duration).toBe(1000);
    expect(obj.count).toBe(0);

    // Step 500ms
    anim.seek(500);
    expect(obj.count).toBeCloseTo(50, 1);

    // Complete
    anim.seek(1000);
    expect(obj.count).toBe(100);
  });

  it("animates DOM element opacity and 3D transforms", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const anim = animate(el, {
      opacity: 0.5,
      translateX: 120,
      rotate: 45,
      duration: 1000,
      autoplay: false,
      easing: "linear",
    });

    anim.seek(500);
    expect(parseFloat(el.style.opacity)).toBeCloseTo(0.75, 1);
    expect(el.style.transform).toContain("translate3d(60.0000px, 0px, 0px)");
    expect(el.style.transform).toContain("rotate(22.5000deg)");

    anim.seek(1000);
    expect(parseFloat(el.style.opacity)).toBeCloseTo(0.5, 2);
    expect(el.style.transform).toContain("translate3d(120.0000px, 0px, 0px)");
    expect(el.style.transform).toContain("rotate(45.0000deg)");

    document.body.removeChild(el);
  });

  it("resolves .finished promise when completed (1:1 with Anime.js)", async () => {
    const obj = { val: 0 };
    const onComplete = vi.fn();

    const anim = animate(obj, {
      val: 50,
      duration: 100,
      autoplay: false,
      onComplete,
    });

    // Manually complete via seek
    anim.seek(100);
    const result = await anim.finished;

    expect(onComplete).toHaveBeenCalled();
    expect(result.completed).toBe(true);
  });
});
