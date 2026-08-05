// Installed from the iuvui canonical source. This copy belongs to your project.
import type { CSSProperties } from "react";

export type DataAttributes = {
  [Key in `data-${string}`]?: string | number | boolean | undefined;
};
export type AriaAttributes = {
  [Key in `aria-${string}`]?: string | number | boolean | undefined;
};

export interface InteractiveState {
  isDisabled: boolean;
  isFocusVisible: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isPending: boolean;
}

export type StateClassName<State> = string | ((state: State) => string);

export interface PartStyleProps<State = never>
  extends DataAttributes, AriaAttributes {
  className?: [State] extends [never] ? string : StateClassName<State>;
  style?: CSSProperties;
  "data-slot"?: string;
}

export interface PressEvent {
  pointerType: "keyboard" | "mouse" | "pen" | "touch" | "virtual";
}
