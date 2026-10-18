import { Children, cloneElement, isValidElement, type ReactNode, useEffect, useRef, useState } from "react";
import { animate } from "../../../animation/tween";

export interface AnimatePresenceProps {
  children?: ReactNode;
}

export function AnimatePresence({ children }: AnimatePresenceProps) {
  const [renderedChildren, setRenderedChildren] = useState<Array<any>>([]);
  const exitingKeys = useRef<Set<string | number>>(new Set());

  useEffect(() => {
    const currentList = Children.toArray(children).filter(isValidElement);

    setRenderedChildren((prevList) => {
      // If a child in prevList is missing from currentList, retain it and trigger exit
      const nextList = [...currentList];

      prevList.forEach((oldChild) => {
        const key = oldChild.key;
        if (key && !currentList.some((c) => c.key === key) && !exitingKeys.current.has(key)) {
          exitingKeys.current.add(key);

          // Clone with exit flag or trigger exit animation
          const exitChild = cloneElement(oldChild as any, {
            ref: (node: HTMLElement | null) => {
              if (!node) return;
              const exitProps = oldChild.props.exit || { opacity: 0, translateY: 15 };
              animate(node, {
                ...exitProps,
                duration: oldChild.props.transition?.duration ?? 300,
                easing: "easeOutCubic",
                onComplete: () => {
                  exitingKeys.current.delete(key);
                  setRenderedChildren((latest) => latest.filter((c) => c.key !== key));
                },
              });
            },
          });

          nextList.push(exitChild);
        }
      });

      return nextList;
    });
  }, [children]);

  return <>{renderedChildren}</>;
}
