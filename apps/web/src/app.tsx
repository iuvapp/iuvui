import { ActionLink, StatusBadge } from "@iuvui/site-ui";

import { LanguageToggle } from "./components/language-toggle";
import * as m from "./paraglide/messages.js";

const githubUrl = "https://github.com/iuvapp/iuvui";

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-4 sm:px-6">
          <ActionLink
            className="shrink-0 text-lg font-semibold text-foreground"
            href="/"
          >
            iuvui
          </ActionLink>
          <nav
            aria-label={m.web_primary_navigation()}
            className="hidden items-center gap-5 sm:flex"
          >
            <ActionLink href="/docs">{m.web_nav_docs()}</ActionLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ActionLink
              arrow
              className="hidden sm:inline-flex"
              href={githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </ActionLink>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1">
        <section className="mx-auto flex w-full max-w-6xl items-center px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <StatusBadge>{m.web_home_status()}</StatusBadge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {m.web_slogan()}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {m.web_summary()}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ActionLink variant="default" href="/docs">
                {m.web_home_docs_action()}
              </ActionLink>
              <ActionLink
                arrow
                href={githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </ActionLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-medium text-foreground">iuvui</span>
          <span>{m.web_independence_notice()}</span>
          <span>© 2026 iuvui</span>
        </div>
      </footer>
    </div>
  );
}
