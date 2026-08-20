import { buttonVariants } from "@heroui/styles";
import { Chip, Link } from "@heroui/react";

import { LanguageToggle } from "./components/language-toggle";
import * as m from "./paraglide/messages.js";

const githubUrl = "https://github.com/iuvapp/iuvui";

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-separator bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-4 sm:px-6">
          <Link
            className="shrink-0 text-lg font-semibold text-foreground"
            href="/"
          >
            iuvui
          </Link>
          <nav
            aria-label={m.web_primary_navigation()}
            className="hidden items-center gap-5 sm:flex"
          >
            <Link href="/docs">{m.web_nav_docs()}</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              className="hidden sm:inline-flex"
              href={githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
              <Link.Icon />
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1">
        <section className="mx-auto flex w-full max-w-6xl items-center px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <Chip color="accent" variant="soft">
              {m.web_home_status()}
            </Chip>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {m.web_slogan()}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              {m.web_summary()}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                className={buttonVariants({ variant: "primary" })}
                href="/docs"
              >
                {m.web_home_docs_action()}
              </Link>
              <Link href={githubUrl} rel="noreferrer" target="_blank">
                GitHub
                <Link.Icon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-separator">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="font-medium text-foreground">iuvui</span>
          <span>{m.web_independence_notice()}</span>
          <span>© 2026 iuvui</span>
        </div>
      </footer>
    </div>
  );
}
