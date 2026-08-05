import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { AriaButton, AriaLink } from "@iuvui/internal";
import { cn } from "@iuvui/utils";
import type { InteractiveState, PressEvent, StateClassName } from "./types";

const InternalButton: any = AriaButton;
const InternalLink: any = AriaLink;

export type ButtonVariant = "solid" | "secondary" | "outline" | "ghost";
export type ButtonColor = "accent" | "neutral" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "sm" | "md" | "lg" | "full";

interface ButtonOwnProps {
  children?: ReactNode;
  className?: StateClassName<InteractiveState>;
  color?: ButtonColor;
  endContent?: ReactNode;
  isDisabled?: boolean;
  isPending?: boolean;
  onPress?: (event: PressEvent) => void;
  radius?: ButtonRadius;
  startContent?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof ButtonOwnProps | "onClick" | "disabled"
> & {
  href?: undefined;
};
type NativeLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof ButtonOwnProps | "onClick" | "href"
> & {
  href: string;
};
export type ButtonProps = ButtonOwnProps &
  (NativeButtonProps | NativeLinkProps);

const stateFromRender = (
  state: Record<string, boolean | undefined>,
  pending: boolean,
): InteractiveState => ({
  isDisabled: Boolean(state.isDisabled),
  isFocusVisible: Boolean(state.isFocusVisible),
  isFocused: Boolean(state.isFocused),
  isHovered: Boolean(state.isHovered),
  isPressed: Boolean(state.isPressed),
  isPending: pending,
});

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    children,
    className,
    color = "accent",
    endContent,
    isDisabled = false,
    isPending = false,
    onPress,
    radius = "md",
    size = "md",
    startContent,
    variant = "solid",
    ...props
  },
  ref,
) {
  const common = {
    "data-color": color,
    "data-pending": isPending || undefined,
    "data-radius": radius,
    "data-slot": "button",
    "data-size": size,
    "data-ui-root": "",
    "data-variant": variant,
    isDisabled: isDisabled || isPending,
    isPending,
    onPress: (event: { pointerType: PressEvent["pointerType"] }) => {
      if (!isPending) onPress?.({ pointerType: event.pointerType });
    },
    className: (state: Record<string, boolean | undefined>) =>
      cn(
        "ui-button",
        typeof className === "function"
          ? className(stateFromRender(state, isPending))
          : className,
      ),
    children: (
      <>
        {isPending ? (
          <span
            className="ui-button__spinner"
            data-slot="button-spinner"
            aria-hidden="true"
          />
        ) : (
          startContent
        )}
        <span data-slot="button-label">{children}</span>
        {endContent}
      </>
    ),
  };

  if ("href" in props && props.href) {
    return (
      <InternalLink
        {...(props as NativeLinkProps)}
        {...common}
        ref={ref as Ref<HTMLAnchorElement>}
        href={props.href}
      />
    );
  }
  return (
    <InternalButton
      {...(props as NativeButtonProps)}
      {...common}
      ref={ref as Ref<HTMLButtonElement>}
    />
  );
});
