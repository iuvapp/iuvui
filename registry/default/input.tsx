// Installed from the iuvui canonical source. This copy belongs to your project.
import "@iuvui/styles";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@iuvui/utils";

export type InputProps = ComponentPropsWithoutRef<"input">;

// Derived from shadcn/ui Input under the MIT license. Immutable upstream
// provenance and local deviations are recorded in the iuvui Registry item.
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      type={type}
      className={cn("ui-input", className)}
      data-slot="input"
      data-ui-root=""
    />
  );
});
