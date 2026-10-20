import { Button, type ButtonProps } from "@iuvui/react";
import type { ReactNode } from "react";

import { ArrowUpRightIcon } from "./icons";

export interface ActionLinkProps extends Omit<
  Extract<ButtonProps, { href: string }>,
  "children" | "className"
> {
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

export function ActionLink({
  arrow = false,
  children,
  className,
  ...props
}: ActionLinkProps) {
  return (
    <Button
      variant="link"
      {...(className === undefined ? {} : { className })}
      {...(arrow
        ? {
            endContent: (
              <ArrowUpRightIcon aria-hidden="true" width={16} height={16} />
            ),
          }
        : {})}
      {...props}
    >
      {children}
    </Button>
  );
}
