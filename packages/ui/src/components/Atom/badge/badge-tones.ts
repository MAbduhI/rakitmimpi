/*
 * The colour half of a Badge variant — border, fill, and text, nothing about
 * shape or size. Kept apart from badge.tsx so other components can dress
 * themselves in the same variant without importing the pill geometry, and
 * without a second copy of the palette drifting out of sync. Toaster uses it
 * for the toast card.
 *
 * Status variants map 1:1 onto the status tokens — never an ad-hoc green or
 * red. Each fill pairs with its own -foreground token, picked per theme to
 * clear 4.5:1 (see docs/theming.mdx for the measured ratios).
 */
export type BadgeTone =
  | "primary"
  | "primary-highlight"
  | "secondary"
  | "outline"
  | "accent"
  | "accent-highlight"
  | "success"
  | "success-highlight"
  | "warning"
  | "warning-highlight"
  | "error"
  | "error-highlight"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-error"
  | "gradient"
  | "tag-success"
  | "tag-warning"
  | "tag-error"
  | "tag-danger"
  | "tag-muted"
  | "tag-primary"
  | "tag-accent";

export const badgeTones: Record<BadgeTone, string> = {
  primary: "border-transparent bg-accent text-accent-foreground",
  "primary-highlight": "border-accent bg-white text-accent",
  secondary: "border-transparent bg-surface-alt text-primary",
  outline: "border-border text-primary",
  accent: "border-transparent bg-accent-secondary text-accent-secondary-foreground",
  "accent-highlight": "border-accent-secondary bg-white text-accent-secondary",
  success: "border-transparent bg-success text-success-foreground",
  "success-highlight": "border-success bg-white text-success",
  warning: "border-transparent bg-warning text-warning-foreground",
  "warning-highlight": "border-warning bg-white text-warning",
  error: "border-transparent bg-error text-error-foreground",
  "error-highlight": "border-error bg-white text-error",
  // Metronic & Creative Tim inspired soft/light variants
  "soft-primary": "border-transparent bg-accent/15 text-accent",
  "soft-secondary": "border-transparent bg-surface-hover text-secondary",
  "soft-success": "border-transparent bg-success/15 text-success",
  "soft-warning": "border-transparent bg-warning/20 text-warning-foreground",
  "soft-error": "border-transparent bg-error/15 text-error",
  gradient: "border-transparent bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground",
  // Swiss Design System Tags (11px mono uppercase, 1px border, 40% opacity, no fill)
  "tag-success": "border border-success/40 bg-transparent text-success font-mono uppercase tracking-wider",
  "tag-warning": "border border-warning/40 bg-transparent text-warning font-mono uppercase tracking-wider",
  "tag-error": "border border-error/40 bg-transparent text-error font-mono uppercase tracking-wider",
  "tag-danger": "border border-error/40 bg-transparent text-error font-mono uppercase tracking-wider",
  "tag-muted": "border border-border bg-transparent text-secondary font-mono uppercase tracking-wider",
  "tag-primary": "border border-accent/40 bg-transparent text-accent font-mono uppercase tracking-wider",
  "tag-accent": "border border-accent-secondary/40 bg-transparent text-accent-secondary font-mono uppercase tracking-wider",
};

export const badgeToneNames = Object.keys(badgeTones) as Array<BadgeTone>;
