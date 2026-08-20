import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "../routeTree.gen";

describe("documentation index route", () => {
  it("matches /docs with the explicit index route", () => {
    const router = createRouter({
      history: createMemoryHistory({ initialEntries: ["/docs"] }),
      routeTree,
    });

    const { foundRoute } = router.getMatchedRoutes("/docs");

    expect(foundRoute?.id).toBe("/docs/");
  });
});
