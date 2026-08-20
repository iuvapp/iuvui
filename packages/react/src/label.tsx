import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@iuvui/utils";

export type LabelProps = ComponentPropsWithoutRef<"label">;

// Derived from shadcn/ui Label under the MIT license. Immutable upstream
// provenance and local deviations are recorded in the iuvui Registry item.
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <label
      {...props}
      ref={ref}
      className={cn("ui-label", className)}
      data-slot="label"
      data-ui-root=""
    />
  );
});
