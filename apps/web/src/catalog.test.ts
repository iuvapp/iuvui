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
  it("lists each public component once", () => {
    const ids = componentCatalog.map((item) => item.id);

    expect(ids).toEqual(["button", "text-field", "dialog", "separator"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps Registry links limited to generated source items", () => {
    const registryItems = componentCatalog
      .filter((item) => "registryPath" in item)
      .map((item) => item.id);

    expect(registryItems).toEqual(["button", "separator"]);
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
    expect(paths).toContain("@iuvui/styles/components/separator.css");
  });
});
