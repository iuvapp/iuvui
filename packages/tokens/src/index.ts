export const tokenNames = [
  "background",
  "foreground",
  "surface",
  "surface-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "danger",
  "danger-foreground",
  "border",
  "focus-ring",
  "radius-sm",
  "radius-md",
  "radius-lg",
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
