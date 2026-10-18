import {
  type ChangeEvent,
  Children,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../../utils";
import { Icon, type IconName } from "../icon";

export interface SelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: Array<SelectOption>;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Options as data. Pass `children` instead for grouped `<optgroup>`s. */
  options?: Array<SelectOption>;
  /** Rendered as a disabled first option, the way a native select does it. */
  placeholder?: string;
  leftIcon?: IconName;
  containerClassName?: string;
  menuClassName?: string;
  /** Force browser native picker without custom styled popover */
  native?: boolean;
}

export function Select({
  options,
  placeholder,
  leftIcon,
  className,
  containerClassName,
  menuClassName,
  children,
  defaultValue,
  value,
  onChange,
  disabled,
  native = false,
  ...props
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Controlled or uncontrolled internal value
  const initialValue = value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : "";
  const [internalValue, setInternalValue] = useState<string>(initialValue);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(String(value));
    }
  }, [value]);

  // Extract flat options and groups from props or children
  const parsedGroups: Array<SelectGroup> = [];
  const parsedOptions: Array<SelectOption> = [];

  if (options && options.length > 0) {
    parsedOptions.push(...options);
  } else if (children) {
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const element = child as ReactElement<{
        label?: string;
        children?: ReactNode;
        value?: string | number;
        disabled?: boolean;
      }>;

      if (element.type === "optgroup") {
        const groupLabel = element.props.label || "";
        const groupOpts: Array<SelectOption> = [];

        Children.forEach(element.props.children, (optChild) => {
          if (!isValidElement(optChild)) return;
          const optElem = optChild as ReactElement<{
            value?: string | number;
            children?: ReactNode;
            disabled?: boolean;
          }>;
          if (optElem.type === "option") {
            const opt = {
              label: optElem.props.children,
              value: String(optElem.props.value ?? ""),
              disabled: optElem.props.disabled,
            };
            groupOpts.push(opt);
            parsedOptions.push(opt);
          }
        });

        parsedGroups.push({ label: groupLabel, options: groupOpts });
      } else if (element.type === "option") {
        parsedOptions.push({
          label: element.props.children,
          value: String(element.props.value ?? ""),
          disabled: element.props.disabled,
        });
      }
    });
  }

  // Find effective value (matches native <select> defaulting to first option when no placeholder)
  const effectiveValue =
    internalValue !== ""
      ? internalValue
      : !placeholder && parsedOptions.length > 0
        ? (parsedOptions[0]?.value ?? "")
        : "";

  // Find currently selected label
  const selectedOption = parsedOptions.find((o) => String(o.value) === String(effectiveValue));
  const _displayLabel = selectedOption
    ? selectedOption.label
    : placeholder && effectiveValue === ""
      ? placeholder
      : effectiveValue;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle native select change (from tests or programmatic input)
  const handleNativeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  // Select value from custom menu
  const handleSelectOption = (optValue: string) => {
    setInternalValue(optValue);
    setIsOpen(false);

    if (selectRef.current) {
      selectRef.current.value = optValue;
      const event = new Event("change", { bubbles: true });
      selectRef.current.dispatchEvent(event);
    }
  };

  // Keyboard navigation on select
  const handleKeyDown = (e: KeyboardEvent<HTMLSelectElement>) => {
    if (disabled || native) return;

    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      const enabledOptions = parsedOptions.filter((o) => !o.disabled);
      if (enabledOptions.length === 0) return;

      const currentIndex = enabledOptions.findIndex((o) => String(o.value) === String(internalValue));

      let nextIndex = 0;
      if (e.key === "ArrowDown") {
        nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
      }

      const nextOption = enabledOptions[nextIndex];
      if (nextOption) {
        handleSelectOption(nextOption.value);
      }
    }
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLSelectElement>) => {
    if (disabled || native) return;
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", containerClassName)}>
      {leftIcon ? (
        <Icon
          className={cn(
            "pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-secondary",
            disabled && "opacity-50",
          )}
          name={leftIcon}
        />
      ) : null}

      {/* 
        Native select element remains mounted for:
        1. Accessibility and form submit (name/required/etc.)
        2. Test assertions (getByRole("combobox"), getAllByRole("option"))
        On desktop click, preventDefault() intercepts and opens the custom styled menu.
      */}
      <select
        ref={selectRef}
        className={cn(
          "flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-surface px-3 py-2 text-primary text-sm",
          "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          "transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          leftIcon && "pl-10",
          "pr-10",
          isOpen && "border-ring ring-2 ring-ring/20",
          className,
        )}
        value={internalValue}
        onChange={handleNativeChange}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...props}
      >
        {placeholder ? (
          <option disabled value="" className="bg-surface text-secondary dark:bg-[#1D2127]">
            {placeholder}
          </option>
        ) : null}
        {options?.map((option) => (
          <option
            key={option.value}
            disabled={option.disabled}
            value={option.value}
            className="bg-surface py-1.5 text-primary dark:bg-[#1D2127] dark:text-[#ECEFF4]"
          >
            {option.label}
          </option>
        ))}
        {children}
      </select>

      {/* Styled Chevron Icon */}
      <Icon
        className={cn(
          "pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-secondary transition-transform duration-200",
          isOpen && "rotate-180",
          disabled && "opacity-50",
        )}
        name="chevron-down"
        size="sm"
      />

      {/* 
        Custom Styled Dropdown Popover:
        Renders with custom design tokens, dark mode surface (#1D2127 / #282C34),
        hover highlight, padding, checkmarks, and optgroup headings.
      */}
      {isOpen && (
        <div
          tabIndex={-1}
          className={cn(
            "absolute right-0 left-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-md border border-input bg-surface p-1 text-primary shadow-xl",
            "dark:border-[#282C34] dark:bg-[#1D2127] dark:text-[#ECEFF4]",
            "fade-in zoom-in-95 scrollbar-thin animate-in select-none duration-100",
            menuClassName,
          )}
        >
          {parsedGroups.length > 0
            ? parsedGroups.map((group, gIdx) => (
                <div key={group.label || gIdx} className="space-y-0.5">
                  {group.label && (
                    <div className="px-2.5 py-1 font-semibold text-[11px] text-secondary uppercase tracking-wider dark:text-slate-400">
                      {group.label}
                    </div>
                  )}
                  {group.options.map((opt) => {
                    const isSelected = String(effectiveValue) === String(opt.value);
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        disabled={opt.disabled}
                        onClick={() => !opt.disabled && handleSelectOption(opt.value)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-accent/10 font-semibold text-accent dark:bg-[#61AFEF]/15 dark:text-[#61AFEF]"
                            : "text-primary hover:bg-surface-hover/80 dark:hover:bg-white/5",
                          opt.disabled && "pointer-events-none cursor-not-allowed opacity-40",
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Icon name="check" size="sm" className="size-4 shrink-0 text-accent dark:text-[#61AFEF]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            : parsedOptions.map((opt) => {
                const isSelected = String(effectiveValue) === String(opt.value);
                return (
                  <button
                    type="button"
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => !opt.disabled && handleSelectOption(opt.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-accent/10 font-semibold text-accent dark:bg-[#61AFEF]/15 dark:text-[#61AFEF]"
                        : "text-primary hover:bg-surface-hover/80 dark:hover:bg-white/5",
                      opt.disabled && "pointer-events-none cursor-not-allowed opacity-40",
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Icon name="check" size="sm" className="size-4 shrink-0 text-accent dark:text-[#61AFEF]" />
                    )}
                  </button>
                );
              })}
        </div>
      )}
    </div>
  );
}
