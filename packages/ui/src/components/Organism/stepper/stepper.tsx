import { type ReactNode } from "react";
import { cn } from "../../../utils";
import { Icon } from "../../Atom/icon";

export interface StepItem {
  id?: string | number;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps {
  /** List of steps */
  steps: StepItem[];
  /** Zero-indexed active step */
  activeStep: number;
  /** Callback fired when a step is clicked (if interactive) */
  onStepClick?: (stepIndex: number) => void;
  /** Stepper layout: horizontal or vertical */
  orientation?: "horizontal" | "vertical";
  /** Style variant: default (numbers/check), pills (Metronic rounded badges), minimal (dots) */
  variant?: "default" | "pills" | "minimal";
  /** Container custom classes */
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  onStepClick,
  orientation = "horizontal",
  variant = "default",
  className,
}: StepperProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "w-full",
        isHorizontal ? "flex items-center justify-between" : "flex flex-col space-y-6",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCurrent = index === activeStep;
        const isCompleted = index < activeStep;
        const isClickable = Boolean(onStepClick);

        return (
          <div
            key={step.id ?? index}
            className={cn(
              "flex-1 flex",
              isHorizontal ? "items-center" : "items-start",
              !isHorizontal && index !== steps.length - 1 && "relative pb-6"
            )}
          >
            {/* Step trigger / content */}
            <div
              onClick={() => isClickable && onStepClick?.(index)}
              className={cn(
                "flex items-center gap-3.5 group select-none",
                isClickable && "cursor-pointer",
                !isClickable && "cursor-default"
              )}
            >
              {/* Step indicator circle / badge */}
              <div
                className={cn(
                  "relative flex size-10 shrink-0 items-center justify-center rounded-md font-semibold text-sm transition-all duration-200 shadow-2xs",
                  variant === "pills" && "rounded-full",
                  isCompleted && "bg-success text-success-foreground",
                  isCurrent && "bg-accent text-accent-foreground ring-4 ring-accent/15",
                  !isCompleted && !isCurrent && "bg-surface-alt text-secondary border border-border group-hover:border-input"
                )}
              >
                {step.icon ? (
                  step.icon
                ) : isCompleted ? (
                  <Icon name="check" className="size-5 stroke-[2.5]" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Title & Subtitle */}
              <div className="flex flex-col text-left">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors leading-tight",
                    isCurrent && "text-primary",
                    isCompleted && "text-primary/80",
                    !isCurrent && !isCompleted && "text-secondary"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-secondary text-xs mt-0.5 leading-snug">
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connecting line between steps */}
            {index < steps.length - 1 && (
              isHorizontal ? (
                <div
                  className={cn(
                    "mx-4 h-0.5 flex-1 transition-all duration-300",
                    index < activeStep ? "bg-accent" : "bg-border dashed border-t border-border"
                  )}
                />
              ) : (
                <div
                  className={cn(
                    "absolute left-5 top-10 bottom-0 w-0.5 -translate-x-1/2 transition-all duration-300",
                    index < activeStep ? "bg-accent" : "bg-border border-l border-dashed border-border"
                  )}
                />
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
