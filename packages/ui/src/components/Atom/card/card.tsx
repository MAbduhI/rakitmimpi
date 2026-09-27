import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../../utils/cn";

const cardVariants = cva("rounded-md text-primary transition-all", {
  variants: {
    variant: {
      default: "border border-border bg-surface shadow-xs",
      bordered: "border border-border bg-surface shadow-none",
      flush: "border-0 bg-transparent shadow-none",
      elevated: "border border-border/50 bg-surface shadow-md hover:shadow-lg",
      dashed: "border border-dashed border-border bg-surface shadow-none",
      stretched: "h-full flex flex-col border border-border bg-surface shadow-xs",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "none",
  },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
  );
}

export interface CardExtensionProps extends HTMLAttributes<HTMLDivElement> {
  devider?: boolean;
  divider?: boolean;
}

export function CardHeader({ className, devider = false, divider = false, ...props }: CardExtensionProps) {
  const hasDivider = devider || divider;
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-6",
        hasDivider && "border-b border-border",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold text-lg leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-secondary text-sm", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0 flex-1", className)} {...props} />;
}

export function CardFooter({ devider = false, divider = false, className, ...props }: CardExtensionProps) {
  const hasDivider = devider || divider;
  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0 mt-auto",
        hasDivider && "border-t border-border pt-4",
        className
      )}
      {...props}
    />
  );
}
