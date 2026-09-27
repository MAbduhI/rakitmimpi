import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../../utils/cn";
import { Loading, type LoadingVariant } from "../loading";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-all focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:bg-accent/80 active:bg-accent/90",
        secondary: "bg-surface-alt text-primary hover:bg-surface-hover/100 active:bg-surface-hover/80",
        outline: "border border-input bg-transparent text-primary hover:bg-surface-alt/100 active:bg-surface-alt/80",
        ghost: "text-primary hover:bg-surface-alt/100 active:bg-surface-alt/80",
        destructive: "bg-error text-error-foreground hover:bg-error/80 active:bg-error/90",
        soft: "bg-accent/10 text-accent hover:bg-accent/20 active:bg-accent/25 border border-transparent",
        "soft-destructive": "bg-error/10 text-error hover:bg-error/20 active:bg-error/25 border border-transparent",
        "soft-success": "bg-success/10 text-success hover:bg-success/20 active:bg-success/25 border border-transparent",
        "soft-warning": "bg-warning/15 text-warning-foreground hover:bg-warning/25 active:bg-warning/30 border border-transparent",
        gradient: "bg-gradient-to-r from-accent to-accent-secondary text-accent-foreground shadow-sm hover:opacity-95 active:opacity-90",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto font-normal",
        dashed: "border border-dashed border-input bg-transparent text-primary hover:bg-surface-alt/100 active:bg-surface-alt/80",
        flush: "border-0 bg-transparent text-primary p-0 h-auto hover:text-accent",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-sm",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
        "icon-xs": "size-7 p-0",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "default",
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingType?: LoadingVariant;
}

export function Button({
  children,
  className,
  disabled,
  variant,
  size,
  shape,
  type = "button",
  loading = false,
  loadingType = "spinner",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <Loading size={size === "sm" || size === "xs" || size === "icon-xs" ? "sm" : "md"} variant={loadingType} /> : children}
    </button>
  );
}
