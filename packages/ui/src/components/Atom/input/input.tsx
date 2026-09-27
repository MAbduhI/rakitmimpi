import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils";
import { Icon, type IconName } from "../icon";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icon rendered inside the field, before the text. */
  leftIcon?: IconName;
  /** Icon rendered inside the field, after the text. */
  rightIcon?: IconName;
  /** Addon element rendered before input (e.g. "https://", "+62", currency prefix) */
  addonBefore?: ReactNode;
  /** Addon element rendered after input (e.g. ".com", "USD", button addon) */
  addonAfter?: ReactNode;
  /** Floating label text (Bootstrap floating-label / Metronic form-floating pattern) */
  floatingLabel?: string;
  /** Visual variant: outline (default), flush (borderless bottom-line only), filled */
  variant?: "outline" | "flush" | "filled";
  /** Size variant */
  inputSize?: "sm" | "md" | "lg";
  /** Classes for the wrapper — className still styles the input itself. */
  containerClassName?: string;
}

export function Input({
  className,
  leftIcon,
  rightIcon,
  addonBefore,
  addonAfter,
  floatingLabel,
  variant = "outline",
  inputSize = "md",
  containerClassName,
  id,
  placeholder,
  ...props
}: InputProps) {
  const iconClass = cn(
    "-translate-y-1/2 pointer-events-none absolute top-1/2 text-secondary",
    props.disabled && "opacity-50",
  );

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  const variantClasses = {
    outline: "border border-input bg-surface rounded-md focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
    flush: "border-b border-input bg-transparent rounded-none px-0 focus-visible:border-accent focus-visible:outline-none",
    filled: "border-0 bg-surface-alt rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  };

  const inputId = id ?? (floatingLabel ? `floating-input-${Math.random().toString(36).substring(2, 9)}` : undefined);

  // If floating label is used
  if (floatingLabel) {
    return (
      <div className={cn("relative w-full", containerClassName)}>
        <input
          id={inputId}
          placeholder={placeholder ?? " "}
          className={cn(
            "peer flex w-full border border-input bg-surface px-3 text-primary text-sm pt-5 pb-1 rounded-md placeholder-transparent focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[inputSize],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className,
          )}
          {...props}
        />
        {leftIcon ? <Icon className={cn(iconClass, "left-3")} name={leftIcon} /> : null}
        {rightIcon ? <Icon className={cn(iconClass, "right-3")} name={rightIcon} /> : null}
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-3 top-1 text-[11px] font-medium text-secondary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-accent",
            leftIcon && "left-10 peer-placeholder-shown:left-10 peer-focus:left-10",
          )}
        >
          {floatingLabel}
        </label>
      </div>
    );
  }

  // If addons are present
  if (addonBefore || addonAfter) {
    return (
      <div className={cn("flex w-full items-stretch rounded-md border border-input bg-surface focus-within:outline-2 focus-within:outline-ring focus-within:outline-offset-2 overflow-hidden", containerClassName)}>
        {addonBefore && (
          <div className="flex items-center px-3 bg-surface-alt border-r border-input text-secondary text-sm select-none shrink-0 font-medium">
            {addonBefore}
          </div>
        )}
        <div className="relative flex-1">
          {leftIcon ? <Icon className={cn(iconClass, "left-3")} name={leftIcon} /> : null}
          <input
            id={inputId}
            placeholder={placeholder}
            className={cn(
              "flex w-full bg-transparent px-3 py-2 text-primary text-sm placeholder:text-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            {...props}
          />
          {rightIcon ? <Icon className={cn(iconClass, "right-3")} name={rightIcon} /> : null}
        </div>
        {addonAfter && (
          <div className="flex items-center px-3 bg-surface-alt border-l border-input text-secondary text-sm select-none shrink-0 font-medium">
            {addonAfter}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", containerClassName)}>
      {leftIcon ? <Icon className={cn(iconClass, "left-3")} name={leftIcon} /> : null}
      <input
        id={inputId}
        placeholder={placeholder}
        className={cn(
          "flex w-full text-primary placeholder:text-secondary disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[inputSize],
          variantClasses[variant],
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          className,
        )}
        {...props}
      />
      {rightIcon ? <Icon className={cn(iconClass, "right-3")} name={rightIcon} /> : null}
    </div>
  );
}
