// Installed from the iuvui canonical source. This copy belongs to your project.
import "@iuvui/styles";

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import {
  Button as AriaButton,
  Link as AriaLink,
  type ButtonRenderProps as AriaButtonRenderProps,
  type LinkRenderProps as AriaLinkRenderProps,
} from "react-aria-components";
import { cn } from "@iuvui/utils";
import type { InteractiveState, PressEvent, StateClassName } from "./types";

const InternalButton = AriaButton;
const InternalLink = AriaLink;

export type ButtonVariant =
  "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "sm" | "md" | "lg" | "full";

interface ButtonOwnProps {
  children?: ReactNode;
  className?: StateClassName<InteractiveState>;
  endContent?: ReactNode;
  fullWidth?: boolean;
  isDisabled?: boolean;
  isIconOnly?: boolean;
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
  state: AriaButtonRenderProps | AriaLinkRenderProps,
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
    endContent,
    fullWidth = false,
    isDisabled = false,
    isIconOnly = false,
    isPending = false,
    onPress,
    radius = "md",
    size = "md",
    startContent,
    variant = "primary",
    ...props
  },
  ref,
) {
  const common = {
    "data-full-width": fullWidth || undefined,
    "data-icon-only": isIconOnly || undefined,
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
    className: (state: AriaButtonRenderProps | AriaLinkRenderProps) =>
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
        ) : startContent ? (
          <span data-slot="button-start-content">{startContent}</span>
        ) : null}
        <span data-slot="button-label">{children}</span>
        {endContent ? (
          <span data-slot="button-end-content">{endContent}</span>
        ) : null}
      </>
    ),
  };

  if ("href" in props && props.href) {
    return (
      <InternalLink
        {...(props as unknown as ComponentProps<typeof InternalLink>)}
        {...common}
        ref={ref as Ref<HTMLAnchorElement>}
        href={props.href}
      />
    );
  }
  return (
    <InternalButton
      {...(props as unknown as ComponentProps<typeof InternalButton>)}
      {...common}
      isDisabled={isDisabled}
      ref={ref as Ref<HTMLButtonElement>}
    />
  );
});
