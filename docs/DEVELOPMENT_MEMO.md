# Development Memo

This document is the durable execution record for the public iuvui repository.
It separates implemented code, local verification, external deployment, and npm
publication so that one cannot be mistaken for another.

Dashboard implementation and deployment state are deliberately excluded. The
private `iuvapp/iuvui-pro` repository is the sole operational authority for
`@iuvui/dashboard`, `@iuvui/dashboard-ui`, Clerk, Pro assets,
`iuvui.iuvdev.com`, and `app.iuvui.com`. This memo records only the public
integration boundary with that system.

Last verified: 2026-08-06.

## Decision baseline

- The product shorthand is "Use shadcn like HeroUI": shadcn/ui is the design,
  source, and ecosystem baseline; HeroUI is the maintained-package and product
  experience reference; React Aria Components remain replaceable behavior behind
  iuvui-owned adapters. Reference products do not supply copied implementation
  code.
- `iuvapp/iuvui` is the canonical public repository for components, public npm
  packages, the CLI, Registry output, public documentation, Storybook, and the
  public website.
- iuvui intentionally targets React. Package mode consumes `@iuvui/react`;
  source mode uses the public `iuvui` CLI to install the same canonical component
  implementation under `components/iuv-ui`. The CLI supports both `pnpm dlx`
  and global-install workflows.
- Every component remains free, including complex components. Base styles, base
  variants, semantic tokens, accessibility behavior, and the public icon
  foundation remain free.
- Selected premium Style Packs, visual variants, animation configuration, and
  motion presets may require Pro entitlement. Protected assets remain outside
  this repository and its public npm packages.
- Free CLI workflows remain anonymous. Login is requested only for an explicitly
  protected artifact or service.
- MCP remains a free public documentation and capability-discovery surface. It
  may describe and label Pro capabilities, but it never distributes paid assets
  or performs entitlement decisions.
- English is the canonical and default locale. English and Simplified Chinese
  (`zh-CN`) are enabled through Paraglide catalogs; translated copy is not
  embedded directly in source files.
- All public package and Registry releases remain in `0.0.x` until `0.1.0` is
  explicitly unlocked.

## Status rules

- A phase is complete only when every exit criterion is satisfied.
- A successful local build or commit is not a deployment.
- A successful package build or pack check is not an npm release.
- An anonymous Cloudflare Access redirect verifies the access boundary, not the
  protected application content.
- Public and private repositories are validated, committed, deployed, and
  released independently.
- No npm publication occurs without explicit authorization for the exact
  release.
- A development deployment does not authorize or imply a production promotion.

## Verified delivery snapshot

### Public npm packages

The following runtime packages are publicly available at `0.0.1`:

- `@iuvui/tokens`
- `@iuvui/utils`
- `@iuvui/icons`
- `@iuvui/styles`
- `@iuvui/react`

Their local builds, declarations, tarball contents, Apache License 2.0 metadata,
exact internal release ranges, and independent consumer installation have been
verified. `@iuvui/cli` is also versioned locally at `0.0.1`, but it has not been
published to npm. Package mode is therefore public; the complete public
`pnpm dlx @iuvui/cli` source-delivery path is not yet available. A pending patch
Changeset records the canonical GitHub organization migration for the next
`0.0.x` package set; it does not authorize publication.

### Registry and CLI

Button and Separator Registry artifacts are versioned at `0.0.1`, carry content
integrity, and preserve exact canonical and upstream provenance. A clean
consumer can install the packed local CLI, add either component to
`components/iuv-ui`, verify `iuvui.lock`, and type-check the installed source.

The production Registry at `iuvui.com` serves a valid `0.0.1` catalog and
component artifacts. Its provenance still uses the legacy `iuv-tech/iuvui` URL,
which redirects to the canonical repository. The current development Worker
contains the migrated `iuvapp/iuvui` provenance. Production was intentionally
left unchanged in this development-only deployment. Public npm runtime
installation is available, but a clean public `pnpm dlx` smoke remains blocked
by the unpublished CLI package.

### Public website

The public website has separate TanStack Start builds and Cloudflare Workers for
development and production:

- `iuvui-web-dev` serves `ui.iuvdev.com`;
- `iuvui-web-prod` serves `iuvui.com`.

Worker version `2d0053f0-727c-4945-a938-37e4ffd2a959` was deployed to
`iuvui-web-dev` on 2026-08-06. Anonymous requests to the development root and
Registry routes return `302` redirects to Cloudflare Access, which confirms that
the development access policy is active. Authenticated application and Registry
smoke testing remains separate.

The production website and Registry remain on Worker version
`0455c0ad-4e2a-4853-bda0-ff965faa28f0` and serve the verified English-first site
and valid `0.0.1` Registry output. Their repository links and provenance retain
the legacy GitHub organization until a separately authorized production
promotion. This development deployment did not change production.

### Storybook

The Storybook build and five Playwright contract tests pass, covering keyboard,
focus, theme, and axe behavior. Worker version
`81b9a987-cd69-40b5-87f9-1241858f6dc4` remains deployed at
`storybook.iuvui.com` with Button and Separator documentation and contract
stories.

### Dashboard boundary

The public repository contains only the dashboard link and public CLI, MCP, and
commercial integration contracts. It contains no dashboard application, Clerk
dependency, dashboard Worker configuration, credentials, business logic, or
paid assets. Free and Pro users share the private dashboard; verified server
entitlements control paid capabilities. Detailed dashboard status belongs only
in the private development memo.

### MCP

The public MCP purpose, security boundary, and proposed Cloudflare architecture
are documented. The separate `iuvapp/iuvui-mcp` repository and deployment are
planned but do not yet exist as a verified delivery surface.

## Minimum delivery paths

Package mode is available through public npm:

1. install `@iuvui/react`, `@iuvui/styles`, and their public dependencies;
2. import the precompiled style entry point;
3. build and type-check an independent consumer.

Source mode has a verified local path:

1. build versioned Registry artifacts;
2. initialize a clean consumer project with the packed CLI;
3. install Button or Separator source into `components/iuv-ui`;
4. verify Registry integrity and record canonical and upstream provenance in
   `iuvui.lock`;
5. install the exact public runtime dependencies from npm;
6. compile and test the clean consumer project.

The remaining public source-mode step is to publish `@iuvui/cli` and repeat the
same flow through `pnpm dlx` against the production Registry.

## Phase 1 — Public foundation

Status: **In progress**.

Completed:

- HeroUI OSS website baseline and English-first localized landing page;
- TanStack Start SSR and separate dev and prod Cloudflare environments;
- Button and Separator package and Registry outputs;
- five public runtime packages at `0.0.1`;
- production website and Registry verification;
- Access-protected development deployment at the Worker version recorded above;
- public Storybook deployment with component contract coverage;
- local language, formatting, lint, type, test, build, Registry, provenance,
  package, and independent consumer checks.

Exit criteria still open:

- complete authenticated SSR, locale, navigation, and Registry content checks on
  `ui.iuvdev.com`;
- add first-class component and documentation routes instead of relying only on
  landing-page anchors and external repository links;
- publish and smoke-test `@iuvui/cli` when that exact npm release is explicitly
  authorized;
- keep every package and deployed Registry item in `0.0.x` while the release gate
  remains active.

## Phase 2 (external) — Dashboard shell

Dashboard implementation, validation, credentials, and deployments are owned and
tracked exclusively by the private `iuvui-pro` repository. The public repository
has only these responsibilities at the boundary:

- link users to the correct development or production dashboard without
  embedding dashboard code;
- keep free CLI behavior usable without authentication;
- define public contracts for authenticated protected delivery without
  containing Clerk server credentials, business rules, or paid assets;
- ensure public MCP documentation describes Pro capabilities without becoming
  an alternate protected-content delivery path.

No dashboard operational status or checklist is duplicated here.

## Phase 3 boundary — Pro features

The private repository owns product data, Clerk and Convex integration,
entitlements, protected styles, premium variants, animation presets, licenses,
downloads, teams, and billing workflows. The public repository may own open
schemas, validators, integration adapters, and compatibility tests, but never
the protected assets or private business logic. Phase status and deployment
evidence remain in the private memo.

## Phase 4 — Product integration

Status in the public CLI: **Planned**.

The current CLI provides project initialization and verified Button and
Separator installation. The planned integration scope includes login, identity,
logout, organization-aware entitlement verification, protected artifact
delivery, project tokens, integrity verification, and non-secret provenance.
Free commands and free component access must remain usable without an account.

## Phase 5 — Self-bootstrap

Status: **Not started**.

The self-bootstrap phase will audit iuvui components against the production
accessibility and compatibility gates, replace HeroUI incrementally, and use the
public site, private dashboard, Storybook, and examples as continuous dogfooding
consumers. HeroUI OSS remains in production until each replacement satisfies the
contracts already exercised by those surfaces.

## `0.0.x` release gate

The initial runtime package set is published at `0.0.1`; the CLI portion remains
open. Before considering that public source-delivery release complete:

1. keep Apache License 2.0 and third-party notices consistent in every artifact;
2. preserve exact package ranges, Registry integrity, and immutable upstream
   provenance;
3. apply the pending patch Changeset and publish the resulting `0.0.x` package
   set, including `@iuvui/cli`, only with explicit authorization and successful
   npm account verification;
4. run the clean public npm and `pnpm dlx` consumer smoke against the production
   Registry;
5. record the verified result here without changing production merely to match a
   development deployment.

Every later public release must use a patch Changeset and remain below `0.1.0`
until the user explicitly unlocks that version.

## Immediate next milestone

1. Complete the authenticated development website and Registry smoke through
   Cloudflare Access.
2. Keep the current production website and Registry unchanged unless a separate
   production promotion is explicitly requested; that promotion will migrate
   public GitHub links and Registry provenance from `iuv-tech` to `iuvapp`.
3. Publish and verify the CLI only when the exact release is authorized and npm
   verification can complete.
4. Add first-class public component and documentation routes.
5. Expand the component catalog through versioned shadcn provenance, package and
   Registry parity, contract tests, and patch-only release metadata.

Dashboard and Convex execution continue independently in `iuvui-pro`; the
private memo remains the only authority for their detailed state.
