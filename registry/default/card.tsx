// Installed from the iuvui canonical source. This copy belongs to your project.
import "@iuvui/styles";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@iuvui/utils";

export type CardProps = ComponentPropsWithoutRef<"div">;
export type CardHeaderProps = ComponentPropsWithoutRef<"div">;
export type CardTitleProps = ComponentPropsWithoutRef<"div">;
export type CardDescriptionProps = ComponentPropsWithoutRef<"div">;
export type CardActionProps = ComponentPropsWithoutRef<"div">;
export type CardContentProps = ComponentPropsWithoutRef<"div">;
export type CardFooterProps = ComponentPropsWithoutRef<"div">;

// Derived from shadcn/ui Card under the MIT license. Immutable upstream
// provenance and local deviations are recorded in the iuvui Registry item.
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn("ui-card", className)}
      data-slot="card"
      data-ui-root=""
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-card__header", className)}
        data-slot="card-header"
      />
    );
  },
);

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-card__title", className)}
        data-slot="card-title"
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLDivElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-card__description", className)}
        data-slot="card-description"
      />
    );
  },
);

export const CardAction = forwardRef<HTMLDivElement, CardActionProps>(
  function CardAction({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-card__action", className)}
        data-slot="card-action"
      />
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-card__content", className)}
        data-slot="card-content"
      />
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cn("ui-card__footer", className)}
        data-slot="card-footer"
      />
    );
  },
);
