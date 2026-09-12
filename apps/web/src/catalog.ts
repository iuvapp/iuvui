import type {
  ButtonRadius,
  ButtonSize,
  ButtonVariant,
  SeparatorOrientation,
} from "@iuvui/react";

export type ComponentId =
  | "button"
  | "card"
  | "dialog"
  | "input"
  | "label"
  | "separator"
  | "text-field"
  | "textarea";

export type ComponentDelivery = "published" | "workspace-preview";
export type SourceDelivery = ComponentDelivery | "package-only";

export interface ComponentCatalogItem {
  category: "actions" | "forms" | "layout" | "overlays";
  delivery: ComponentDelivery;
  id: ComponentId;
  packagePath: string;
  registryPath?: string;
  sourceDelivery: SourceDelivery;
  version: string;
}

export const componentCatalog = [
  {
    category: "actions",
    delivery: "published",
    id: "button",
    packagePath: "@iuvui/react/button",
    registryPath: "/r/button.json",
    sourceDelivery: "published",
    version: "0.0.1",
  },
  {
    category: "forms",
    delivery: "published",
    id: "input",
    packagePath: "@iuvui/react/input",
    registryPath: "/r/input.json",
    sourceDelivery: "published",
    version: "0.0.1",
  },
  {
    category: "forms",
    delivery: "published",
    id: "label",
    packagePath: "@iuvui/react/label",
    registryPath: "/r/label.json",
    sourceDelivery: "published",
    version: "0.0.1",
  },
  {
    category: "forms",
    delivery: "published",
    id: "textarea",
    packagePath: "@iuvui/react/textarea",
    registryPath: "/r/textarea.json",
    sourceDelivery: "published",
    version: "0.0.1",
  },
  {
    category: "forms",
    delivery: "published",
    id: "text-field",
    packagePath: "@iuvui/react/text-field",
    sourceDelivery: "package-only",
    version: "0.0.1",
  },
  {
    category: "layout",
    delivery: "published",
    id: "card",
    packagePath: "@iuvui/react/card",
    registryPath: "/r/card.json",
    sourceDelivery: "published",
    version: "0.0.1",
  },
  {
    category: "overlays",
    delivery: "published",
    id: "dialog",
    packagePath: "@iuvui/react/dialog",
    sourceDelivery: "package-only",
    version: "0.0.1",
  },
  {
    category: "layout",
    delivery: "published",
    id: "separator",
    packagePath: "@iuvui/react/separator",
    registryPath: "/r/separator.json",
    sourceDelivery: "published",
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
  { delivery: "published", group: "foundation", path: "@iuvui/styles" },
  {
    delivery: "published",
    group: "foundation",
    path: "@iuvui/styles/theme.css",
  },
  {
    delivery: "published",
    group: "foundation",
    path: "@iuvui/styles/base.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/button.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/card.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/text-field.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/dialog.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/input.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/label.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/separator.css",
  },
  {
    delivery: "published",
    group: "component",
    path: "@iuvui/styles/components/textarea.css",
  },
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
