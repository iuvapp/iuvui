import { ActionLink } from "@iuvui/site-ui";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { App } from "./app";
import { ButtonVariantExplorer } from "./components/docs/button-variant-explorer";
import { ComponentMeta } from "./components/docs/component-meta";
import { StyleExports } from "./components/docs/style-exports";
import * as m from "./paraglide/messages.js";

describe("public homepage", () => {
  it("keeps the landing page focused on the documentation entry point", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('href="/docs"');
    expect(markup).toContain(m.web_home_docs_action());
    expect(markup).not.toContain(m.web_components_title());
    expect(markup).not.toContain(m.web_variants_title());
    expect(markup).not.toContain(m.web_styles_title());
    expect(markup).toContain(m.web_slogan());
    expect(markup).toContain(m.web_independence_notice());
    expect(markup).toContain('data-variant="default"');
    expect(markup).toContain('aria-label="' + m.common_switch_language() + '"');
  });
});

describe("website chrome", () => {
  it("renders action links with the local button anatomy and native anchor semantics", () => {
    const markup = renderToStaticMarkup(
      <ActionLink
        arrow
        href="https://github.com/iuvapp/iuvui"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </ActionLink>,
    );

    expect(markup).toMatch(/^<a /);
    expect(markup).toContain('href="https://github.com/iuvapp/iuvui"');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noreferrer"');
    expect(markup).toContain('data-slot="button"');
    expect(markup).toContain('data-variant="link"');
    expect(markup).toContain('aria-hidden="true"');
  });

  it("uses local cards without changing package and Registry availability", () => {
    const metadata = renderToStaticMarkup(<ComponentMeta id="button" />);
    const styles = renderToStaticMarkup(<StyleExports />);

    expect(metadata).toContain('data-slot="card"');
    expect(metadata).toContain('data-slot="card-footer"');
    expect(metadata).toContain(m.web_registry_json());
    expect(styles).toContain('data-slot="card-header"');
    expect(styles).toContain(m.web_included());
    expect(styles).toContain(m.web_component_workspace_preview());
  });

  it("gives variant selectors accessible groups and pressed state", () => {
    const markup = renderToStaticMarkup(<ButtonVariantExplorer />);

    expect(markup.match(/<fieldset>/g)).toHaveLength(3);
    expect(markup).toContain(
      `<legend class="mb-2 text-sm font-medium text-foreground">${m.web_variant_label()}</legend>`,
    );
    expect(markup.match(/aria-pressed="true"/g)).toHaveLength(3);
    expect(markup).toContain('aria-pressed="false"');
  });
});
