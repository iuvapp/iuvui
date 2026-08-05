import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "../src/button";
import { Separator } from "../src/separator";

describe("rendering contracts", () => {
  it("renders on the server without browser globals", () => {
    expect(renderToString(<Button>SSR</Button>)).toContain(
      'data-slot="button"',
    );
  });

  it("hydrates without replacing markup", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Button>Hydrate</Button>);
    const before = container.firstElementChild;
    act(() => {
      hydrateRoot(container, <Button>Hydrate</Button>);
    });
    expect(container.firstElementChild).toBe(before);
  });

  it("renders Separator on the server", () => {
    expect(renderToString(<Separator />)).toContain('data-slot="separator"');
  });
});
