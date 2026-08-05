# iuvui Web Platform

## Product surfaces

| Domain          | Role                                                             | Access                 |
| --------------- | ---------------------------------------------------------------- | ---------------------- |
| `iuvui.com`     | Brand, components, documentation, pricing, and public content    | Public, frontend-first |
| `app.iuvui.com` | Pro dashboard, entitlements, downloads, teams, and account tools | Authenticated          |

Both applications deploy to Cloudflare Workers with independent code, configuration, secrets, custom domains, and release processes. The public site never holds Pro user data or backend credentials.

## Repository structure

```text
iuvui/                              public repository
├── apps/web/                       iuvui.com
├── packages/site-ui/               public-site presentation primitives
├── packages/react/                 @iuvui/react
├── packages/styles/                @iuvui/styles
├── packages/tokens/                @iuvui/tokens
└── packages/icons/                 @iuvui/icons

iuvui-pro/                          private repository
├── apps/dashboard/                 app.iuvui.com
└── packages/site-ui/               dashboard presentation primitives
```

Each repository owns its application-specific presentation layer. Shared branding may be synchronized deliberately, but the repositories do not use a cross-repository workspace dependency. Public packages and Registry source must never depend on HeroUI or import HeroUI Pro code, styles, assets, or types.

## UI foundation and bootstrap strategy

The initial websites use React 19, Tailwind CSS v4, `@heroui/react`, `@heroui/styles`, and site-specific brand tokens. HeroUI remains the production baseline until iuvui meets its own production requirements. A licensed HeroUI Pro package may later be used only in the application-specific web and dashboard layers, never in public component or Registry implementations.

The minimum self-bootstrap gate includes:

- coverage of every foundational and complex component used by the sites;
- verified keyboard, focus, screen-reader, and automated accessibility contracts;
- production-ready themes, responsive behavior, dark mode, and stable DOM anatomy;
- reliable package delivery, source delivery, variants, and upgrade paths;
- evidence from independent production trials.

After the gate is met, migration proceeds component by component and page by page. HeroUI stays in production until each replacement is verified.

## Localization

Paraglide provides the common i18n foundation. Each repository owns a root `project.inlang` and message catalog, while each Vite application compiles its runtime into its own source tree. This allows the public site and dashboard to release and adopt locale strategies independently without coupling shared UI packages to URL, cookie, header, or storage detection.

English is the canonical source language and the default display language. English and Simplified Chinese (`zh-CN`) are enabled. A user's explicit language selection is persisted locally; browser language does not override the English default. New locales require an explicit product decision, an entry in `project.inlang/settings.json`, and a dedicated `messages/<locale>.json` catalog. Translations must never be embedded directly in application source.

## Cloudflare Workers

```text
iuvui-web       -> iuvui.com
iuvui-dashboard -> app.iuvui.com
```

Each Worker owns its `wrangler.jsonc`, compatibility date, custom domain, preview and production environments, secrets, bindings, deployment, rollback, logs, and observability. Database or storage choices such as D1, R2, KV, or an external service will follow the eventual entitlement, order, Registry, and download data model rather than being selected prematurely.

## Clerk authentication and organizations

`app.iuvui.com` uses Clerk. Authentication and authorization checks belong on protected server and API boundaries, not only in client-side visibility rules.

| Domain                                        | Source of truth  |
| --------------------------------------------- | ---------------- |
| Identity, sign-in methods, sessions           | Clerk            |
| Organizations, membership, invitations, roles | Clerk            |
| Pro plans, licenses, orders, Registry access  | iuvui data layer |
| Downloads, CLI tokens, project associations   | iuvui data layer |

A Clerk Organization maps to an iuvui Team. The active Organization establishes dashboard context. Entitlements may reference Clerk `userId` or `orgId`, but Clerk metadata is never the sole source of truth for billing or licensing.

The first authentication scope includes sign in, sign up, sign out, session restoration, protected routes, account management, organization switching, membership management, organization-role authorization, and distinct signed-out, unauthorized, and unentitled states.

Webhook endpoints remain public but verify signatures, process events idempotently, and support retries. Webhooks are asynchronous and eventually consistent, so synchronous registration or purchase success must not depend on their completion.

Secrets are separated by role:

- The publishable key may enter the client build.
- The Clerk secret key exists only in Worker secrets or protected server build environments.
- The webhook signing secret exists only on the server.

No secret belongs in `wrangler.jsonc`, client bundles, public build logs, or committed files.

## Initial Pro dashboard

- Overview
- Licenses and entitlements
- Downloads and Registry access
- Projects
- Teams and members
- Billing
- Tokens
- Account settings

The first milestone provides the shell, navigation, empty states, authentication, and account entry points. Billing and entitlement workflows follow after their data model is defined.

## HeroUI Pro license boundary

- Use HeroUI OSS until a Pro license is purchased and activated.
- Install Pro through its official licensed workflow; do not copy or transform unlicensed assets.
- Keep local credentials and CI tokens separate.
- Store `HEROUI_AUTH_TOKEN` only in CI or protected Cloudflare build secrets.
- Never expose the token to client code, logs, or the repository.
- Use Pro assets only in the finished website and dashboard, never as input for iuvui component or Registry implementations.

## Delivery phases

1. Public foundation: HeroUI OSS, brand system, landing page, component and documentation entry points, `iuvui.com` Worker.
2. Dashboard shell: Clerk session boundary, organization switching, navigation, empty states, `app.iuvui.com` Worker.
3. Pro features: licensed HeroUI Pro, entitlements, downloads, Registry access, teams, and billing.
4. Product integration: CLI login and tokens, authenticated Pro Registry, project and download history, license seats.
5. Self-bootstrap: audit iuvui against production gates, replace HeroUI incrementally, and make both sites continuous dogfooding and regression consumers.
