// Installed from the iuvui canonical source. This copy belongs to your project.
import "@iuvui/styles";

import { forwardRef, type ComponentProps, type HTMLAttributes } from "react";
import { Separator as AriaSeparator } from "react-aria-components";
import { cn } from "@iuvui/utils";

const InternalSeparator = AriaSeparator;

export type SeparatorOrientation = "horizontal" | "vertical";
export interface SeparatorProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className"
> {
  className?: string;
  elementType?: "div" | "hr";
  orientation?: SeparatorOrientation;
}

// Derived from shadcn/ui Separator under the MIT license. Immutable upstream
// provenance and local deviations are recorded in the iuvui Registry item.
export const Separator = forwardRef<HTMLElement, SeparatorProps>(
  function Separator({ className, orientation = "horizontal", ...props }, ref) {
    return (
      <InternalSeparator
        {...(props as ComponentProps<typeof InternalSeparator>)}
        ref={ref}
        className={cn("ui-separator", className)}
        data-orientation={orientation}
        data-slot="separator"
        data-ui-root=""
        orientation={orientation}
      />
    );
  },
);
