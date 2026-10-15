import type { ComponentPropsWithoutRef } from "react";

export function StatusBadge({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground ${className ?? ""}`}
      {...props}
    />
  );
}
