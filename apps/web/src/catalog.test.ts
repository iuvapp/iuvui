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

  it("keeps public Registry links limited to released source items", () => {
    const registryItems = componentCatalog
      .filter((item) => "registryPath" in item)
      .map((item) => item.id);

    expect(registryItems).toEqual(["button", "separator"]);

    const workspaceSourceItems = componentCatalog
      .filter((item) => item.sourceDelivery === "workspace-preview")
      .map((item) => item.id);

    expect(workspaceSourceItems).toEqual([
      "input",
      "label",
      "textarea",
      "card",
    ]);
    expect(
      componentCatalog.some(
        (item) =>
          item.sourceDelivery === "workspace-preview" &&
          "registryPath" in item &&
          item.registryPath !== undefined,
      ),
    ).toBe(false);
  });

  it("labels unpublished workspace components without treating them as npm releases", () => {
    const workspacePreviewIds = componentCatalog
      .filter((item) => item.delivery === "workspace-preview")
      .map((item) => item.id);

    expect(workspacePreviewIds).toEqual(["input", "label", "textarea", "card"]);
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

    const workspaceStylePaths = styleExports
      .filter((item) => item.delivery === "workspace-preview")
      .map((item) => item.path);

    expect(workspaceStylePaths).toEqual([
      "@iuvui/styles/components/card.css",
      "@iuvui/styles/components/input.css",
      "@iuvui/styles/components/label.css",
      "@iuvui/styles/components/textarea.css",
    ]);
  });
});
