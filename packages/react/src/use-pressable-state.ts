import {
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

export function usePressableState() {
  const [focused, setFocused] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return {
    dataProps: {
      "data-focused": focused || undefined,
      "data-focus-visible": focusVisible || undefined,
      "data-hovered": hovered || undefined,
      "data-pressed": pressed || undefined,
    },
    listeners: {
      onBlur: () => {
        setFocused(false);
        setFocusVisible(false);
        setPressed(false);
      },
      onFocus: (event: FocusEvent<HTMLElement>) => {
        setFocused(true);
        setFocusVisible(event.currentTarget.matches(":focus-visible"));
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") setPressed(true);
      },
      onKeyUp: () => {
        setPressed(false);
      },
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (event.button === 0) setPressed(true);
      },
      onPointerEnter: () => {
        setHovered(true);
      },
      onPointerLeave: () => {
        setHovered(false);
        setPressed(false);
      },
      onPointerUp: () => {
        setPressed(false);
      },
    },
  };
}

export function chainEvent<EventType>(
  theirHandler: ((event: EventType) => void) | undefined,
  ourHandler: (event: EventType) => void,
) {
  return (event: EventType) => {
    theirHandler?.(event);
    ourHandler(event);
  };
}
