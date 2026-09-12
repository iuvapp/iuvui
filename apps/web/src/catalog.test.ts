import { describe, expect, it } from "vitest";

import {
  buttonRadii,
  buttonSizes,
  buttonVariants,
  componentCatalog,
  matchesCatalogQuery,
  separatorOrientations,
  styleExports,
} from "./catalog";

describe("public catalog", () => {
  it("lists each workspace catalog component once", () => {
    const ids = componentCatalog.map((item) => item.id);

    expect(ids).toEqual([
      "button",
      "input",
      "label",
      "textarea",
      "text-field",
      "card",
      "dialog",
      "separator",
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps public Registry links on the same path as package source items", () => {
    const registryItems = componentCatalog
      .filter((item) => "registryPath" in item)
      .map((item) => item.id);

    expect(registryItems).toEqual([
      "button",
      "input",
      "label",
      "textarea",
      "card",
      "separator",
    ]);

    expect(
      componentCatalog
        .filter((item) => item.sourceDelivery === "published")
        .map((item) => item.id),
    ).toEqual(registryItems);

    expect(
      componentCatalog
        .filter((item) => item.sourceDelivery === "package-only")
        .map((item) => item.id),
    ).toEqual(["text-field", "dialog"]);
  });

  it("puts Card, Input, Label, and Textarea on the published package path", () => {
    const publishedPackageIds = componentCatalog
      .filter((item) => item.delivery === "published")
      .map((item) => item.id);

    expect(publishedPackageIds).toEqual([
      "button",
      "input",
      "label",
      "textarea",
      "text-field",
      "card",
      "dialog",
      "separator",
    ]);
    expect(
      componentCatalog.filter((item) => item.delivery === "workspace-preview"),
    ).toEqual([]);
  });

  it("records the current component variant contracts", () => {
    expect(buttonVariants).toEqual([
      "default",
      "secondary",
      "destructive",
      "outline",
      "ghost",
      "link",
    ]);
    expect(buttonSizes).toEqual(["sm", "md", "lg"]);
    expect(buttonRadii).toEqual(["sm", "md", "lg", "full"]);
    expect(separatorOrientations).toEqual(["horizontal", "vertical"]);
  });

  it("finds components by identifier, package path, and localized copy", () => {
    const button = componentCatalog[0];

    expect(matchesCatalogQuery(button, "button", "Button action")).toBe(true);
    expect(matchesCatalogQuery(button, "@iuvui/react", "Button action")).toBe(
      true,
    );
    expect(matchesCatalogQuery(button, "action", "Button action")).toBe(true);
    expect(matchesCatalogQuery(button, "dialog", "Button action")).toBe(false);
  });

  it("lists unique style exports", () => {
    const paths = styleExports.map((item) => item.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("@iuvui/styles");
    expect(paths).toContain("@iuvui/styles/components/card.css");
    expect(paths).toContain("@iuvui/styles/components/input.css");
    expect(paths).toContain("@iuvui/styles/components/label.css");
    expect(paths).toContain("@iuvui/styles/components/separator.css");
    expect(paths).toContain("@iuvui/styles/components/textarea.css");

    const publishedStylePaths = styleExports
      .filter((item) => item.delivery === "published")
      .map((item) => item.path);

    expect(publishedStylePaths).toEqual(paths);
    expect(
      styleExports.filter((item) => item.delivery === "workspace-preview"),
    ).toEqual([]);
  });
});
