import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@iuvui/utils";

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

// Derived from shadcn/ui Textarea under the MIT license. Immutable upstream
// provenance and local deviations are recorded in the iuvui Registry item.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={cn("ui-textarea", className)}
        data-slot="textarea"
        data-ui-root=""
      />
    );
  },
);
