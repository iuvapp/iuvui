# iuvui Web Platform

## Product surfaces

| Domain                | Role                                                          | Access                    |
| --------------------- | ------------------------------------------------------------- | ------------------------- |
| `ui.iuvdev.com`       | Development build of the public website                       | Cloudflare Access         |
| `iuvui.com`           | Brand, components, documentation, pricing, and public content | Public, frontend-first    |
| `iuvui.iuvdev.com`    | Development dashboard for Free and Pro users                  | Cloudflare Access + Clerk |
| `app.iuvui.com`       | Production dashboard for Free and Pro users                   | Clerk-authenticated       |
| `storybook.iuvui.com` | Component development and contract reference                  | Public                    |
| `mcp.iuvui.com`       | Planned documentation and capability discovery over MCP       | Public, no login          |

Each application deploys from its owning repository with independent code,
configuration, secrets, custom domains, and release processes. The public site
never holds Pro user data or backend credentials.

## Repository structure

```text
iuv-tech/iuvui                       public repository
├── apps/web/                        ui.iuvdev.com and iuvui.com
├── apps/storybook/                  storybook.iuvui.com
├── packages/cli/                    @iuvui/cli; `iuvui` executable
├── packages/site-ui/                public-site presentation primitives
├── packages/react/                  @iuvui/react
├── packages/styles/                 @iuvui/styles
├── packages/tokens/                 @iuvui/tokens
├── packages/icons/                  @iuvui/icons
└── registry/                        public source-delivery artifacts

iuv-tech/iuvui-pro                   private repository
├── apps/dashboard/                  @iuvui/dashboard; dev and prod dashboard
└── packages/site-ui/                @iuvui/dashboard-ui

iuv-tech/iuvui-mcp                   planned separate public repository
└── src/                              mcp.iuvui.com Worker
```

Each repository owns its application-specific presentation layer. Shared
branding may be synchronized deliberately, but the repositories do not use a
cross-repository workspace dependency. Public packages and Registry source must
never depend on HeroUI or import HeroUI Pro code, styles, assets, or types. The
private dashboard may consume public packages through released versions, but
the public repository must never import the private dashboard or paid assets.

## UI foundation and bootstrap strategy

The initial websites use React 19, Tailwind CSS v4, `@heroui/react`,
and `@heroui/styles`. HeroUI OSS default components, semantic tokens, system
typography, restrained surfaces, and documentation information patterns remain
the application baseline until iuvui meets its own production requirements. The
public site is a documentation and discovery surface for real components,
variants, styles, icons, Registry artifacts, and releases; it is not currently a
Dashboard promotion surface.

The documentation structure was reviewed against the official HeroUI v3 OSS
repository at immutable commit
`82e8db281f94457a6d72e046645123b698576757`. This reference informs navigation,
catalog grouping, search, and content hierarchy only. HeroUI Pro source and
licensed assets must not be committed to the public repository. Any future
application-layer integration must comply with the purchased license, keep
protected credentials outside source control, and remain isolated from public
component and Registry implementations.

Actual iuvui package components may be rendered inside documentation previews so
the catalog never presents a HeroUI component as an iuvui implementation. The
surrounding website chrome remains on HeroUI until the self-bootstrap gate is
met. Catalog content must reflect current repository exports and Registry
availability rather than planned or invented capabilities.

The minimum self-bootstrap gate includes:

- coverage of every foundational and complex component used by the sites;
- verified keyboard, focus, screen-reader, and automated accessibility contracts;
- production-ready themes, responsive behavior, dark mode, and stable DOM anatomy;
- reliable package delivery, source delivery, variants, and upgrade paths;
- evidence from independent production trials.

After the gate is met, migration proceeds component by component and page by page. HeroUI stays in production until each replacement is verified.

## Application frameworks and data

The public website uses TanStack Start on Cloudflare Workers so documentation can use server rendering, route-level data loading, and metadata without maintaining a separate backend framework. TanStack packages are adopted when their capability is needed; the project does not install every package merely to claim a full-stack label.

The private dashboard remains a client application because its account surface
is authenticated. Free and Pro users share the same application. TanStack Router
owns its route model, Clerk owns identity and organizations, and Convex owns
product data such as projects, entitlements, usage, and audit records.
PostgreSQL and Drizzle are not part of this architecture. Convex functions must
derive tenant identity from verified Clerk claims rather than accept a
client-supplied organization identifier.

The planned public MCP server is a separate stateless Cloudflare Worker and
repository. It serves free documentation and capability metadata over
Streamable HTTP. It never requires Clerk, connects to the Pro data layer, or
returns paid styles, variants, animations, entitlement tokens, or protected
download URLs. Pro authentication and delivery remain CLI responsibilities.

## Localization

Paraglide provides the common i18n foundation. Each repository owns a root `project.inlang` and message catalog, while each Vite application compiles its runtime into its own source tree. This allows the public site and dashboard to release and adopt locale strategies independently without coupling shared UI packages to URL, cookie, header, or storage detection.

English is the canonical source language and the default display language. English and Simplified Chinese (`zh-CN`) are enabled. A user's explicit language selection is persisted locally; browser language does not override the English default. New locales require an explicit product decision, an entry in `project.inlang/settings.json`, and a dedicated `messages/<locale>.json` catalog. Translations must never be embedded directly in application source.

## Cloudflare Workers

```text
iuvui repository:
iuvui-web-dev   -> ui.iuvdev.com
iuvui-web-prod  -> iuvui.com
iuvui-storybook -> storybook.iuvui.com

iuvui-pro repository:
iuvui-dashboard-dev  -> iuvui.iuvdev.com
iuvui-dashboard-prod -> app.iuvui.com
```

The public website is built separately for the `dev` and `prod` Cloudflare
environments before deployment. The Vite plugin selects the environment at build
time and produces the flattened Wrangler deployment configuration. Storybook has
one production Worker. Each Worker owns its custom domain, deployment, rollback,
logs, and observability. The dashboard uses Convex for application data, so
Cloudflare D1 is not a parallel source of truth. R2 or KV may still be introduced
later for immutable asset delivery or edge caching when a concrete requirement
exists.

Development deploys precede production promotion. An anonymous `302` response
from a Cloudflare Access-protected hostname verifies only that the access policy
is active; authenticated SSR, navigation, locale, and Registry checks require an
authorized session. A development deployment never implies that production was
promoted.

Only the first three Workers are configured or deployed from this repository.
Dashboard Worker configuration and operations exist exclusively in `iuvui-pro`.

### Manual deployment

Authenticate Wrangler once from the repository root:

```bash
pnpm --filter @iuvui/web exec wrangler login
```

Deploy the development website first:

```bash
pnpm web:deploy:dev
```

After independent verification and an explicit production decision, promote the
public website or deploy Storybook with their separate commands:

```bash
pnpm web:deploy:prod
pnpm storybook:deploy
```

The deployment commands build each application before deploying it. No prebuilt output needs to be committed.

## Clerk authentication and organizations

This section defines the public product integration contract. The implementation
and operational runbook are maintained only in `iuvui-pro`.

The dashboards at `iuvui.iuvdev.com` and `app.iuvui.com` use Clerk.
Authentication and authorization checks belong on protected server and API
boundaries, not only in client-side visibility rules. Dashboard implementation,
credentials, deployment commands, and verification state are documented only in
the private `iuvui-pro` repository.

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

## Initial dashboard

Free and Pro users share the same dashboard. Authentication grants access to the
account workspace; server-side entitlements decide which protected assets and
commercial capabilities are available.

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
- Do not commit HeroUI Pro source or licensed assets to this public repository.
- Never use Pro assets as input for iuvui component or Registry implementations.

## Delivery phases

1. Public foundation: HeroUI OSS, brand system, landing page, component and documentation entry points, `iuvui.com` Worker.
2. Dashboard shell: Clerk session boundary, organization switching, navigation,
   and empty states in the private `iuvui-pro` repository; development precedes
   any `app.iuvui.com` production deployment.
3. Pro features: licensed HeroUI Pro, entitlements, downloads, Registry access, teams, and billing.
4. Product integration: CLI login and tokens, authenticated Pro Registry, project and download history, license seats.
5. Self-bootstrap: audit iuvui against production gates, replace HeroUI incrementally, and make both sites continuous dogfooding and regression consumers.
