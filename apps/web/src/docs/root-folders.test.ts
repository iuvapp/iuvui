import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import { describe, expect, it } from "vitest";

import { source } from "./source";

describe("documentation root folders", () => {
  it("exposes the top-level documentation spaces through the layout switcher", () => {
    const tabs = getLayoutTabs(source.getPageTree()).map(({ title, url }) => ({
      title,
      url,
    }));

    expect(tabs).toEqual([
      { title: "Overview", url: "/docs" },
      { title: "Guides", url: "/docs/guides" },
      { title: "Components", url: "/docs/components" },
      { title: "Styles", url: "/docs/styles" },
      { title: "Icons", url: "/docs/icons" },
      { title: "Brand", url: "/docs/brand" },
    ]);
  });

  it("keeps the Components and Guides catalog entries as visible collapsible folders", () => {
    const tree = source.getPageTree();

    for (const [rootName, groupPath, url] of [
      ["Components", "components/(catalog)", "/docs/components"],
      ["Guides", "guides/(guides)", "/docs/guides"],
    ] as const) {
      const root = tree.children.find(
        (node) => node.type === "folder" && node.name === rootName,
      );

      expect(root).toMatchObject({ index: { url } });

      if (!root || root.type !== "folder") {
        throw new Error(`Missing ${rootName} root folder`);
      }

      const group = root.children.find(
        (node) => node.type === "folder" && node.$ref?.folder === groupPath,
      );

      expect(group).toMatchObject({
        collapsible: true,
        defaultOpen: true,
        name: rootName,
        type: "folder",
      });
    }
  });
});
