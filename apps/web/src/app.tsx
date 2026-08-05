import { Button, Card, Chip, Link } from "@heroui/react";
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
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-secondary px-4 py-2">
      <code className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        {command}
      </code>
      <Button size="sm" variant="ghost" onPress={() => void copy()}>
        {copied ? m.common_copied() : m.common_copy()}
      </Button>
    </div>
  );
}

function Capability({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        <Card.Description>{children}</Card.Description>
      </Card.Header>
    </Card>
  );
}

export function App() {
  function scrollToModel() {
    document.querySelector("#model")?.scrollIntoView({ behavior: "smooth" });
  }

  function openGitHub() {
    window.open("https://github.com/iuv-tech/iuvui", "_blank", "noreferrer");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-divider bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link className="text-lg font-semibold text-foreground" href="#top">
            iuvui
          </Link>
          <nav
            aria-label={m.web_primary_navigation()}
            className="hidden items-center gap-6 sm:flex"
          >
            <Link href="#model">{m.web_nav_model()}</Link>
            <Link href="#system">{m.web_nav_system()}</Link>
            <Link
              href="https://github.com/iuv-tech/iuvui"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="https://app.iuvui.com">{m.web_dashboard()}</Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="flex flex-col items-start justify-center">
            <Chip color="accent" variant="soft">
              {m.web_status()}
            </Chip>
            <p className="mt-8 text-sm font-medium text-muted">
              {m.web_eyebrow()}
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
              {m.web_slogan()}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {m.web_summary()}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onPress={scrollToModel}>{m.web_primary_action()}</Button>
              <Button variant="secondary" onPress={openGitHub}>
                {m.web_secondary_action()}
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <Card>
              <Card.Header>
                <Card.Title>{m.web_package_mode()}</Card.Title>
                <Card.Description>
                  {m.web_package_mode_description()}
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <CopyCommand command={packageCommand} />
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>{m.web_source_mode()}</Card.Title>
                <Card.Description>
                  {m.web_source_mode_description()}
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <CopyCommand command={sourceCommand} />
              </Card.Content>
            </Card>
          </div>
        </section>

        <section
          className="border-y border-divider bg-surface-secondary"
          id="model"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-muted">
                {m.web_model_eyebrow()}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {m.web_model_title()}
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Card variant="secondary">
                <Card.Header>
                  <Card.Title>{m.web_canonical_source()}</Card.Title>
                  <Card.Description>
                    {m.web_canonical_source_description()}
                  </Card.Description>
                </Card.Header>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>{m.web_npm_package()}</Card.Title>
                  <Card.Description>
                    {m.web_npm_package_description()}
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <code>@iuvui/react</code>
                </Card.Content>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title>{m.web_registry_source()}</Card.Title>
                  <Card.Description>
                    {m.web_registry_source_description()}
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <code>components/iuv-ui</code>
                </Card.Content>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20" id="system">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted">
              {m.web_system_eyebrow()}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {m.web_system_title()}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Capability title={m.web_styles_title()}>
              {m.web_styles_description()}
            </Capability>
            <Capability title={m.web_icons_title()}>
              {m.web_icons_description()}
            </Capability>
            <Capability title={m.web_lifecycle_title()}>
              {m.web_lifecycle_description()}
            </Capability>
          </div>

          <Card className="mt-12" variant="secondary">
            <Card.Header>
              <Card.Title>{m.web_promise_title()}</Card.Title>
              <Card.Description>{m.web_promise_description()}</Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className="grid gap-3 text-sm text-muted sm:grid-cols-2">
                <li>{m.web_promise_api()}</li>
                <li>{m.web_promise_contracts()}</li>
                <li>{m.web_promise_variants()}</li>
                <li>{m.web_promise_core()}</li>
              </ul>
            </Card.Content>
          </Card>
        </section>
      </main>

      <footer className="border-t border-divider">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-foreground">iuvui</span>
            <span>{m.web_footer_description()}</span>
            <span>© 2026 iuvui</span>
          </div>
          <p className="mt-4 text-xs">{m.web_independence_notice()}</p>
        </div>
      </footer>
    </div>
  );
}
