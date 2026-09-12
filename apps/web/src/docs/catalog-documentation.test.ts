import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { componentCatalog } from "../catalog";

const componentsDirectory = fileURLToPath(
  new URL("../../content/docs/components/(catalog)/", import.meta.url),
);
const componentMeta = JSON.parse(
  readFileSync(`${componentsDirectory}meta.json`, "utf8"),
) as { pages: string[] };
const publicRegistry = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../public/r/registry.json", import.meta.url)),
    "utf8",
  ),
) as { items: Array<{ name: string }> };

describe("catalog documentation", () => {
  it("provides one component page for every catalog item", () => {
    const catalogIds = componentCatalog.map((item) => item.id).sort();

    expect(componentMeta.pages).toEqual(expect.arrayContaining(catalogIds));

    for (const id of catalogIds) {
      expect(existsSync(`${componentsDirectory}${id}.mdx`)).toBe(true);
    }
  });

  it("keeps the public Registry catalog aligned with published source delivery", () => {
    const releasedSourceIds = componentCatalog
      .filter((item) => item.sourceDelivery === "published")
      .map((item) => item.id)
      .sort();
    const registryIds = publicRegistry.items.map((item) => item.name).sort();

    expect(registryIds).toEqual(releasedSourceIds);
  });
});
