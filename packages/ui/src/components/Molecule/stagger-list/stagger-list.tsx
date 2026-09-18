import { Children, cloneElement, type HTMLAttributes, isValidElement, type ReactNode } from "react";
import { type StaggerOptions, stagger } from "../../../animation/stagger";
import { cn } from "../../../utils/cn";

export interface StaggerListProps extends HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number | [number, number];
  staggerOptions?: StaggerOptions;
  children?: ReactNode;
}

export function StaggerList({ staggerDelay = 60, staggerOptions, className, children, ...props }: StaggerListProps) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const total = childArray.length;
  const delayCalculator = stagger(staggerDelay, staggerOptions);

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {childArray.map((child, index) => {
        const itemDelay = delayCalculator(child, index, total);
        const el = child as React.ReactElement<any>;

        return cloneElement(el, {
          transition: {
            ...(el.props?.transition || {}),
            delay: (el.props?.transition?.delay || 0) + itemDelay,
          },
        });
      })}
    </div>
  );
}
