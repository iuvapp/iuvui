export const tokenNames = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "radius",
  "radius-sm",
  "radius-md",
  "radius-lg",
  "radius-xl",
  "shadow-sm",
  "shadow-md",
  "font-sans",
] as const;

export type TokenName = (typeof tokenNames)[number];
export type TokenVariable = `--ui-${TokenName}`;
export type ThemeOverrides = Partial<Record<TokenVariable, string>>;

export const tokenVariable = <Name extends TokenName>(
  name: Name,
): `--ui-${Name}` => `--ui-${name}`;
