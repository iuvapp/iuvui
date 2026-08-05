import { Button, Link } from "@heroui/react";
import { ActionLink, BrandLockup, CheckIcon, GridIcon } from "@iuvui/site-ui";
import { useState } from "react";

import * as m from "./paraglide/messages.js";
import { getLocale, setLocale } from "./paraglide/runtime.js";

const packageCommand = "pnpm add @iuvui/react @iuvui/styles";
const sourceCommand = "pnpm dlx @iuvui/cli add button";

function LanguageToggle() {
  const nextLocale = getLocale() === "en" ? "zh-CN" : "en";

  return (
    <Button
      aria-label={m.common_switch_language()}
      size="sm"
      variant="ghost"
      onPress={() => void setLocale(nextLocale)}
    >
      {nextLocale === "en" ? "EN" : "ZH"}
    </Button>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="command-line">
      <code>{command}</code>
      <Button size="sm" variant="ghost" onPress={() => void copy()}>
        {copied ? m.common_copied() : m.common_copy()}
      </Button>
    </div>
  );
}

function Capability({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="capability-card">
      <span className="capability-index">{index}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

export function App() {
  return (
    <div className="site-frame">
      <header className="site-header">
        <Link href="#top" aria-label="iuvui home" className="brand-link">
          <BrandLockup />
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="#model">Model</Link>
          <Link href="#system">System</Link>
          <Link
            href="https://github.com/tcitry/iuvui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
        </nav>
        <div className="header-actions">
          <ActionLink
            href="https://app.iuvui.com"
            arrow
            className="header-console-link"
          >
            Pro console
          </ActionLink>
          <LanguageToggle />
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-kicker">
            <span className="status-light" />
            {m.web_status()}
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{m.web_eyebrow()}</p>
              <h1>
                {m.web_headline_first()}
                <br />
                <em>{m.web_headline_second()}</em>
              </h1>
              <p className="hero-summary">{m.web_summary()}</p>
              <div className="hero-actions">
                <ActionLink href="#model" arrow className="primary-action">
                  {m.web_primary_action()}
                </ActionLink>
                <ActionLink
                  href="https://github.com/tcitry/iuvui"
                  className="quiet-action"
                >
                  {m.web_secondary_action()}
                </ActionLink>
              </div>
            </div>

            <div className="hero-console" aria-label="Installation examples">
              <div className="console-topline">
                <span>01 / two delivery modes</span>
                <GridIcon aria-hidden="true" />
              </div>
              <div className="console-mode">
                <span className="mode-label">Package mode</span>
                <h2>Ship on the maintained runtime.</h2>
                <CopyCommand command={packageCommand} />
              </div>
              <div className="console-mode is-accent">
                <span className="mode-label">Source mode</span>
                <h2>Bring the component home.</h2>
                <CopyCommand command={sourceCommand} />
              </div>
            </div>
          </div>
          <div className="hero-ticker" aria-hidden="true">
            <span>Accessible behavior</span>
            <span>Stable anatomy</span>
            <span>Owned variants</span>
            <span>Managed updates</span>
          </div>
        </section>

        <section className="model-section" id="model">
          <div className="section-heading">
            <p className="eyebrow">Not another component pile</p>
            <h2>One specification. Two ways to work.</h2>
          </div>
          <div className="model-diagram">
            <div className="model-source">
              <span>Canonical component source</span>
              <strong>Behavior · anatomy · variants · contracts</strong>
            </div>
            <div className="model-branches" aria-hidden="true">
              <span />
              <span />
            </div>
            <div className="model-output">
              <span>npm package</span>
              <strong>@iuvui/react</strong>
              <small>Maintained by iuvui</small>
            </div>
            <div className="model-output is-source">
              <span>Registry source</span>
              <strong>components/ui</strong>
              <small>Owned by your team</small>
            </div>
          </div>
        </section>

        <section className="system-section" id="system">
          <div className="section-heading compact">
            <p className="eyebrow">A complete working layer</p>
            <h2>Consistency without captivity.</h2>
          </div>
          <div className="capability-grid">
            <Capability index="A" title="Styles">
              Precompiled foundations, semantic variables and component recipes
              that do not depend on scanning node_modules.
            </Capability>
            <Capability index="B" title="Icons">
              A coherent visual language with typed React exports and precise
              subpath imports.
            </Capability>
            <Capability index="C" title="Lifecycle">
              Registry provenance, semantic diffs and upgrade paths that respect
              locally owned variants.
            </Capability>
          </div>
        </section>

        <section className="manifesto-section">
          <div>
            <p className="eyebrow">The promise</p>
            <h2>Your product should outlive its UI dependencies.</h2>
          </div>
          <ul>
            {[
              "Public APIs do not leak implementation primitives",
              "Package and source modes share the same contracts",
              "User-owned variants are never silently overwritten",
              "Pro products extend the system without closing the core",
            ].map((item) => (
              <li key={item}>
                <CheckIcon aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <BrandLockup />
        <p>Built in public. Designed for long-lived products.</p>
        <span>© 2026 iuvui</span>
      </footer>
    </div>
  );
}
