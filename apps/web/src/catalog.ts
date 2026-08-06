import type {
  ButtonRadius,
  ButtonSize,
  ButtonVariant,
  SeparatorOrientation,
} from "@iuvui/react";

export type ComponentId = "button" | "dialog" | "separator" | "text-field";

export interface ComponentCatalogItem {
  category: "actions" | "forms" | "layout" | "overlays";
  id: ComponentId;
  packagePath: string;
  registryPath?: string;
  version: string;
}

export const componentCatalog = [
  {
    category: "actions",
    id: "button",
    packagePath: "@iuvui/react/button",
    registryPath: "/r/button.json",
    version: "0.0.1",
  },
  {
    category: "forms",
    id: "text-field",
    packagePath: "@iuvui/react/text-field",
    version: "0.0.1",
  },
  {
    category: "overlays",
    id: "dialog",
    packagePath: "@iuvui/react/dialog",
    version: "0.0.1",
  },
  {
    category: "layout",
    id: "separator",
    packagePath: "@iuvui/react/separator",
    registryPath: "/r/separator.json",
    version: "0.0.1",
  },
] as const satisfies readonly ComponentCatalogItem[];

export const buttonVariants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const satisfies readonly ButtonVariant[];

export const buttonSizes = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly ButtonSize[];

export const buttonRadii = [
  "sm",
  "md",
  "lg",
  "full",
] as const satisfies readonly ButtonRadius[];

export const separatorOrientations = [
  "horizontal",
  "vertical",
] as const satisfies readonly SeparatorOrientation[];

export const styleExports = [
  { group: "foundation", path: "@iuvui/styles" },
  { group: "foundation", path: "@iuvui/styles/theme.css" },
  { group: "foundation", path: "@iuvui/styles/base.css" },
  { group: "component", path: "@iuvui/styles/components/button.css" },
  { group: "component", path: "@iuvui/styles/components/text-field.css" },
  { group: "component", path: "@iuvui/styles/components/dialog.css" },
  { group: "component", path: "@iuvui/styles/components/separator.css" },
] as const;

export function matchesCatalogQuery(
  item: ComponentCatalogItem,
  query: string,
  localizedText: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  return [item.id, item.category, item.packagePath, localizedText]
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}
