// Installed from the iuvui canonical source. This copy belongs to your project.
import "@iuvui/styles";

import {
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  forwardRef,
} from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@iuvui/utils";
import type { InteractiveState, PressEvent, StateClassName } from "./types";

export type ButtonVariant =
  "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
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

function pointerTypeFromClick(
  event: MouseEvent<HTMLElement>,
): PressEvent["pointerType"] {
  const native = event.nativeEvent;
  if (typeof PointerEvent !== "undefined" && native instanceof PointerEvent) {
    if (
      native.pointerType === "mouse" ||
      native.pointerType === "pen" ||
      native.pointerType === "touch"
    ) {
      return native.pointerType;
    }
  }
  if (event.detail === 0) return "keyboard";
  return "mouse";
}

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
    variant = "default",
    ...props
  },
  ref,
) {
  const domProps = props as {
    href?: string;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
    onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
    onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp?: (event: PointerEvent<HTMLElement>) => void;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  };
  const [focused, setFocused] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const interactiveState: InteractiveState = {
    isDisabled,
    isFocusVisible: focusVisible,
    isFocused: focused,
    isHovered: hovered,
    isPending,
    isPressed: pressed,
  };
  const common = {
    "aria-disabled": isPending ? true : undefined,
    "data-focused": focused || undefined,
    "data-focus-visible": focusVisible || undefined,
    "data-full-width": fullWidth || undefined,
    "data-hovered": hovered || undefined,
    "data-icon-only": isIconOnly || undefined,
    "data-pending": isPending || undefined,
    "data-pressed": pressed || undefined,
    "data-radius": radius,
    "data-size": size,
    "data-slot": "button",
    "data-ui-root": "",
    "data-variant": variant,
    className: cn(
      "ui-button",
      typeof className === "function" ? className(interactiveState) : className,
    ),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      domProps.onBlur?.(event);
      setFocused(false);
      setFocusVisible(false);
      setPressed(false);
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (isPending) {
        event.preventDefault();
        return;
      }
      onPress?.({ pointerType: pointerTypeFromClick(event) });
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      domProps.onFocus?.(event);
      setFocused(true);
      setFocusVisible(event.currentTarget.matches(":focus-visible"));
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      domProps.onKeyDown?.(event);
      if (event.key === "Enter" || event.key === " ") setPressed(true);
    },
    onKeyUp: (event: KeyboardEvent<HTMLElement>) => {
      domProps.onKeyUp?.(event);
      setPressed(false);
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      domProps.onPointerDown?.(event);
      if (event.button === 0) setPressed(true);
    },
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      domProps.onPointerEnter?.(event);
      setHovered(true);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      domProps.onPointerLeave?.(event);
      setHovered(false);
      setPressed(false);
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      domProps.onPointerUp?.(event);
      setPressed(false);
    },
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
    const { href, ...anchorProps } = props;
    return (
      <BaseButton
        {...(anchorProps as unknown as ComponentPropsWithoutRef<
          typeof BaseButton
        >)}
        {...common}
        disabled={isDisabled}
        nativeButton={false}
        ref={ref}
        render={(elementProps) => {
          const rest = { ...elementProps };
          delete rest.role;
          return <a {...rest} href={href} />;
        }}
      />
    );
  }

  const buttonProps = props as NativeButtonProps;
  return (
    <BaseButton
      {...buttonProps}
      {...common}
      disabled={isDisabled}
      ref={ref}
      {...(domProps.type
        ? {
            type:
              isPending && domProps.type === "submit"
                ? "button"
                : domProps.type,
          }
        : {})}
    />
  );
});
