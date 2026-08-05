import { forwardRef } from "react";
import type { IconProps } from "./types";

export const CloseIcon = forwardRef<SVGSVGElement, IconProps>(
  function CloseIcon({ size = 24, title, ...props }, ref) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    );
  },
);
