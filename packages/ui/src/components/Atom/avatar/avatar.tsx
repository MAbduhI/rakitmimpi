import { cva, type VariantProps } from "class-variance-authority";
import { Children, type HTMLAttributes, type ImgHTMLAttributes, isValidElement, useState } from "react";
import { cn } from "../../../utils";

export type AvatarStatus = "online" | "offline" | "busy" | "away";

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-surface-alt font-medium text-secondary",
  {
    variants: {
      size: {
        xs: "size-5 text-[9px]",
        sm: "size-6 text-[10px]",
        md: "size-8 text-xs",
        lg: "size-10 text-sm",
        xl: "size-12 text-base",
        "2xl": "size-16 text-lg",
        "3xl": "size-20 text-xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
        rounded: "rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  },
);

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-secondary",
  busy: "bg-error",
  away: "bg-warning",
};

/** "Rakit Mimpi" → "RM". Falls back to the first character for one word. */
function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "";
  }
  if (words.length === 1) {
    return (words[0] ?? "").slice(0, 2).toUpperCase();
  }
  return `${words[0]?.[0] ?? ""}${words.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLSpanElement>, "src" | "alt">,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  /** Initials fallback, shown when there is no src or the image fails. */
  name?: string;
  status?: AvatarStatus;
  /** Badge text or number overlay (e.g. unread count or symbol badge) */
  badge?: string | number;
}

export function Avatar({ src, alt, name, size, shape, status, badge, className, children, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span className={cn(avatarVariants({ size, shape }), className)} {...props}>
      {showImage ? (
        <img
          alt={alt ?? name ?? ""}
          className="size-full object-cover"
          onError={() => setFailed(true)}
          src={src}
        />
      ) : (
        (children ?? (name ? initialsFrom(name) : null))
      )}
      {status ? (
        <span
          aria-label={status}
          className={cn("absolute right-0 bottom-0 size-1/4 rounded-full ring-2 ring-surface", statusColors[status])}
          role="status"
        />
      ) : null}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-error-foreground ring-2 ring-surface">
          {badge}
        </span>
      )}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatars past this count collapse into a "+N" chip. */
  max?: number;
  size?: AvatarProps["size"];
  /** Hover expand effect (Metronic symbol-hover / Creative Tim stack) */
  hoverExpand?: boolean;
}

export function AvatarGroup({ max, size = "md", hoverExpand = false, className, children, ...props }: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined && max < avatars.length ? avatars.slice(0, max) : avatars;
  const overflow = avatars.length - visible.length;

  return (
    <div
      className={cn(
        "flex items-center -space-x-2.5",
        hoverExpand && "hover:space-x-1 transition-all duration-200",
        className
      )}
      {...props}
    >
      {visible.map((avatar, i) => (
        <div
          key={i}
          className={cn(
            "relative ring-2 ring-surface rounded-full transition-transform duration-200 hover:z-10 hover:scale-110",
            hoverExpand && "hover:translate-y-[-2px]"
          )}
        >
          {avatar}
        </div>
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            avatarVariants({ size, shape: "circle" }),
            "relative ring-2 ring-surface bg-surface-hover font-semibold text-secondary text-xs",
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
