import { Link, type LinkProps } from "@heroui/react";
import type { ReactNode } from "react";

import { ArrowUpRightIcon } from "./icons";

export interface ActionLinkProps extends Omit<
  LinkProps,
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
    <Link className={`iuv-action-link ${className ?? ""}`} {...props}>
      <span>{children}</span>
      {arrow ? <ArrowUpRightIcon aria-hidden="true" /> : null}
    </Link>
  );
}
