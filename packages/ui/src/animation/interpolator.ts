export interface ParsedValue {
  num: number;
  unit: string;
  operator?: "+=" | "-=" | "*=";
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const TRANSFORM_PROPERTIES = new Set([
  "translateX",
  "translateY",
  "translateZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "skew",
  "skewX",
  "skewY",
  "perspective",
]);

// ─── VALUE & UNIT PARSER ───────────────────────────────────────────────────
export function parseValue(raw: string | number): ParsedValue {
  if (typeof raw === "number") {
    return { num: raw, unit: "" };
  }

  const str = String(raw).trim();

  // Check for relative operators: +=, -=, *=
  let operator: "+=" | "-=" | "*=" | undefined;
  let cleanStr = str;

  if (str.startsWith("+=")) {
    operator = "+=";
    cleanStr = str.slice(2);
  } else if (str.startsWith("-=")) {
    operator = "-=";
    cleanStr = str.slice(2);
  } else if (str.startsWith("*=")) {
    operator = "*=";
    cleanStr = str.slice(2);
  }

  const match = cleanStr.match(/^(-?[\d.]+)(.*)$/);
  if (match && match[1] !== undefined) {
    return {
      num: parseFloat(match[1]),
      unit: (match[2] ?? "").trim(),
      operator,
    };
  }

  return { num: 0, unit: cleanStr, operator };
}

// ─── RELATIVE VALUE RESOLVER ────────────────────────────────────────────────
export function resolveRelativeValue(current: number, parsed: ParsedValue): number {
  if (!parsed.operator) {
    return parsed.num;
  }
  switch (parsed.operator) {
    case "+=":
      return current + parsed.num;
    case "-=":
      return current - parsed.num;
    case "*=":
      return current * parsed.num;
  }
}

// ─── COLOR PARSING & INTERPOLATION ──────────────────────────────────────────
export function parseColor(colorStr: string): RGBA | null {
  const c = colorStr.trim().toLowerCase();

  // Hex: #rgb or #rrggbb
  if (c.startsWith("#")) {
    const hex = c.slice(1);
    if (hex.length === 3 && hex[0] && hex[1] && hex[2]) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
  }

  // RGB / RGBA
  const rgbaMatch = c.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgbaMatch?.[1] && rgbaMatch[2] && rgbaMatch[3]) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }

  return null;
}

export function interpolateColor(start: string, end: string, progress: number): string {
  const c1 = parseColor(start);
  const c2 = parseColor(end);
  if (!c1 || !c2) return progress >= 1 ? end : start;

  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);
  const a = (c1.a + (c2.a - c1.a) * progress).toFixed(3);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ─── HARDWARE-ACCELERATED TRANSFORM COMPOSER ────────────────────────────────
export function buildTransformString(transforms: Map<string, { value: number; unit: string }>): string {
  const parts: Array<string> = [];

  // 1. Translation in 3D for GPU composition
  const tx = transforms.get("translateX");
  const ty = transforms.get("translateY");
  const tz = transforms.get("translateZ");
  if (tx || ty || tz) {
    const x = tx ? `${tx.value.toFixed(4)}${tx.unit || "px"}` : "0px";
    const y = ty ? `${ty.value.toFixed(4)}${ty.unit || "px"}` : "0px";
    const z = tz ? `${tz.value.toFixed(4)}${tz.unit || "px"}` : "0px";
    parts.push(`translate3d(${x}, ${y}, ${z})`);
  }

  // 2. Rotations
  const rot = transforms.get("rotate");
  const rx = transforms.get("rotateX");
  const ry = transforms.get("rotateY");
  const rz = transforms.get("rotateZ");
  if (rot) parts.push(`rotate(${rot.value.toFixed(4)}${rot.unit || "deg"})`);
  if (rx) parts.push(`rotateX(${rx.value.toFixed(4)}${rx.unit || "deg"})`);
  if (ry) parts.push(`rotateY(${ry.value.toFixed(4)}${ry.unit || "deg"})`);
  if (rz) parts.push(`rotateZ(${rz.value.toFixed(4)}${rz.unit || "deg"})`);

  // 3. Scaling in 3D
  const s = transforms.get("scale");
  const sx = transforms.get("scaleX");
  const sy = transforms.get("scaleY");
  const sz = transforms.get("scaleZ");
  if (s || sx || sy || sz) {
    const scaleX = sx ? sx.value : s ? s.value : 1;
    const scaleY = sy ? sy.value : s ? s.value : 1;
    const scaleZ = sz ? sz.value : 1;
    parts.push(`scale3d(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)}, ${scaleZ.toFixed(4)})`);
  }

  // 4. Skew
  const sk = transforms.get("skew");
  const skx = transforms.get("skewX");
  const sky = transforms.get("skewY");
  if (sk) parts.push(`skew(${sk.value.toFixed(4)}${sk.unit || "deg"})`);
  if (skx) parts.push(`skewX(${skx.value.toFixed(4)}${skx.unit || "deg"})`);
  if (sky) parts.push(`skewY(${sky.value.toFixed(4)}${sky.unit || "deg"})`);

  // 5. Perspective
  const persp = transforms.get("perspective");
  if (persp) parts.push(`perspective(${persp.value.toFixed(4)}${persp.unit || "px"})`);

  return parts.join(" ");
}

export function isTransformProperty(prop: string): boolean {
  return TRANSFORM_PROPERTIES.has(prop);
}

export function defaultUnitForProperty(prop: string): string {
  if (prop.startsWith("rotate") || prop.startsWith("skew")) return "deg";
  if (prop.startsWith("scale")) return "";
  if (prop.startsWith("translate") || prop === "perspective") return "px";
  if (prop === "opacity") return "";
  return "px";
}
