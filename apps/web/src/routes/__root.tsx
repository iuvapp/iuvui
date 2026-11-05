import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { ActionLink } from "@iuvui/site-ui";

import { fumadocsI18n } from "../docs/fumadocs-i18n";
import * as m from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import stylesUrl from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: m.web_meta_title() },
      { name: "description", content: m.web_meta_description() },
      { name: "theme-color", content: "#f7f7f7" },
    ],
    links: [{ rel: "stylesheet", href: stylesUrl }],
  }),
  notFoundComponent: NotFoundComponent,
  component: RootComponent,
});

function NotFoundComponent() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12 text-foreground">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {m.web_not_found_title()}
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {m.web_not_found_description()}
        </p>
        <ActionLink className="mt-6" href="/">
          {m.web_not_found_action()}
        </ActionLink>
      </div>
    </main>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootProvider
          i18n={fumadocsI18n()}
          search={{
            enabled: true,
            options: { api: "/api/search" },
          }}
          theme={{ attribute: ["class", "data-theme"], hotKey: false }}
        >
          {children}
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
