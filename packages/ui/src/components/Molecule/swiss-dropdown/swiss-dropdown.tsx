import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../../utils/cn";

export interface SwissSelectOption {
  value: string;
  label?: string;
  meta?: string;
  disabled?: boolean;
}

export interface SwissSelectProps {
  value: string;
  options: Array<SwissSelectOption>;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export type SwissMenuItem =
  | {
      label: string;
      hint?: string;
      danger?: boolean;
      onSelect: () => void;
    }
  | "divider";

export interface SwissMenuProps {
  trigger: ReactNode;
  header?: ReactNode;
  items: Array<SwissMenuItem>;
  className?: string;
  align?: "left" | "right";
}

export function useDropdown(count: number, onPick: (index: number) => void) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + count) % count);
    }
    if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      onPick(active);
      setOpen(false);
    }
  };

  return { open, setOpen, active, setActive, ref, onKeyDown };
}

const menuClass =
  "absolute z-50 mt-1.5 min-w-full bg-card border border-border rounded-sm shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] py-1 origin-top animate-in fade-in zoom-in-95 duration-100";

export function SwissSelect({
  value,
  options,
  onChange,
  label = "Select option",
  placeholder = "Pilih...",
  className,
}: SwissSelectProps) {
  const idx = options.findIndex((o) => o.value === value);
  const d = useDropdown(options.length, (i) => {
    const opt = options[i];
    if (opt && !opt.disabled) {
      onChange(opt.value);
    }
  });

  const selectedOpt = options.find((o) => o.value === value);

  return (
    <div ref={d.ref} className={cn("relative", className)} onKeyDown={d.onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={d.open}
        aria-label={label}
        onClick={() => {
          d.setActive(Math.max(idx, 0));
          d.setOpen(!d.open);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-3 bg-background border rounded-sm px-3 py-1.5 text-xs text-left transition-colors cursor-pointer",
          d.open
            ? "border-ring"
            : "border-border hover:border-muted-foreground text-foreground"
        )}
      >
        <span className="truncate">
          {selectedOpt ? selectedOpt.label || selectedOpt.value : placeholder}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={cn(
            "text-muted-foreground transition-transform duration-150 shrink-0",
            d.open && "rotate-180"
          )}
        >
          <path
            d="M2 4.5 6 8.5 10 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {d.open && (
        <ul role="listbox" className={menuClass}>
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => d.setActive(i)}
                onClick={() => {
                  if (!o.disabled) {
                    onChange(o.value);
                    d.setOpen(false);
                  }
                }}
                className={cn(
                  "flex items-center justify-between gap-4 px-3 py-1.5 cursor-pointer text-xs transition-colors",
                  i === d.active && "bg-muted",
                  o.disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className={cn(isSelected && "font-semibold text-foreground")}>
                  {o.label || o.value}
                </span>
                <div className="flex items-center gap-2">
                  {o.meta && (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {o.meta}
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-primary font-bold text-xs">✓</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SwissMenu({
  trigger,
  header,
  items,
  className,
  align = "right",
}: SwissMenuProps) {
  const actions = items.filter(
    (i): i is Exclude<SwissMenuItem, "divider"> => i !== "divider"
  );
  const d = useDropdown(actions.length, (i) => actions[i]?.onSelect());
  let actionIdx = -1;

  return (
    <div ref={d.ref} className={cn("relative inline-block", className)} onKeyDown={d.onKeyDown}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={d.open}
        onClick={() => {
          d.setActive(0);
          d.setOpen(!d.open);
        }}
        className={cn(
          "flex items-center gap-1.5 border rounded-sm px-2 py-1 text-xs transition-colors cursor-pointer",
          d.open
            ? "border-ring bg-muted text-foreground"
            : "border-border hover:bg-muted text-foreground"
        )}
      >
        {trigger}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          className={cn(
            "text-muted-foreground transition-transform duration-150 shrink-0",
            d.open && "rotate-180"
          )}
        >
          <path
            d="M2 4.5 6 8.5 10 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {d.open && (
        <div
          role="menu"
          className={cn(
            menuClass,
            align === "right" ? "right-0 w-60" : "left-0 w-60"
          )}
        >
          {header && (
            <div className="px-3 py-2 border-b border-border mb-1 text-xs">
              {header}
            </div>
          )}
          {items.map((it, k) => {
            if (it === "divider") {
              return (
                <hr
                  key={`sep-${k}`}
                  className="my-1 border-0 border-t border-border"
                />
              );
            }
            const currentIdx = ++actionIdx;
            return (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                onMouseEnter={() => d.setActive(currentIdx)}
                onClick={() => {
                  it.onSelect();
                  d.setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer",
                  currentIdx === d.active && "bg-muted",
                  it.danger ? "text-danger hover:bg-danger/10" : "text-foreground"
                )}
              >
                <span>{it.label}</span>
                {it.hint && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {it.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
