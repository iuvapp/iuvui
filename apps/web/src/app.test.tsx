import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { App } from "./app";
import * as m from "./paraglide/messages.js";

describe("public homepage", () => {
  it("keeps the landing page focused on the documentation entry point", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('href="/docs"');
    expect(markup).toContain(m.web_home_docs_action());
    expect(markup).not.toContain(m.web_components_title());
    expect(markup).not.toContain(m.web_variants_title());
    expect(markup).not.toContain(m.web_styles_title());
  });
});
