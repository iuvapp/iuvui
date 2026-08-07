# Development Memo

This document is the durable execution record for the public iuvui repository.
It separates implemented code, local verification, external deployment, and npm
publication so that one cannot be mistaken for another.

Dashboard implementation and deployment state are deliberately excluded. The
private `iuv-tech/iuvui-pro` repository is the sole operational authority for
`@iuvui/dashboard`, `@iuvui/dashboard-ui`, Clerk, Pro assets,
`iuvui.iuvdev.com`, and `app.iuvui.com`. This memo records only the public
integration boundary with that system.

Last verified: 2026-08-07.

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

## Component tooling workstream

Status: **In progress**.

Started: 2026-08-06.

This workstream records the adopted outcomes of an implementation review of
Cloudflare Kumo at commit `e9f8f93e8221b665caa5262bcd05d81dba854be9`
and HeroUI v3 at package version `3.2.3`. Kumo is an engineering reference for
machine-readable component metadata, generated Registry documentation,
source-owned Blocks, design-tool synchronization, and agent guidance. HeroUI
remains the product-experience and styling-boundary reference. Neither project
defines iuvui's public API or supplies unreviewed implementation code.

Adopted decisions:

- preserve the existing React Aria adapter boundary and do not expose or switch
  the public component API to Base UI primitives;
- preserve precompiled `@iuvui/styles` CSS and do not require consumers to scan
  package source with Tailwind `@source` directives;
- introduce a private build-time component contract that records identity,
  anatomy, slots, states, variants, defaults, semantic tokens, examples, and
  Registry delivery metadata without prematurely adding a public React export;
- make Registry output, public component documentation, and future design-tool
  adapters consume that contract instead of maintaining independent inventories;
- keep versioned package components as the canonical implementation while using
  source-owned Blocks only for proven, higher-level product compositions;
- add static contract checks before adding generation, so mismatches between
  TypeScript props, CSS selectors, Storybook contracts, and Registry metadata fail
  visibly rather than being silently accepted;
- treat Figma generation and drift detection as a later consumer of the same
  contract, not as a second source of component truth;
- keep AI and MCP output documentation-only and free of protected assets,
  credentials, entitlement decisions, or signed URLs.

Execution plan:

1. **Contract pilot** — define and validate the private contract format against
   Button and Separator, covering current variants, defaults, stable slots,
   documented states, semantic tokens, package paths, and Registry paths.
2. **Registry and documentation integration** — generate or validate catalog
   descriptions and component reference data from the contract, then extend the
   pilot to Dialog and TextField so every current public component is covered.
3. **Blocks foundation** — define a Registry-compatible, source-owned Block
   contract and prove it with one context-aware composition only after its reuse
   and ownership boundary are documented.
4. **Design synchronization** — add a read-only design export and drift report
   from the component contract before considering any write-capable Figma flow.
5. **Agent and lint integration** — generate concise agent guidance and add
   checks for primitive colors, undocumented states, stale variants, and
   deprecated props where the contract can provide deterministic evidence.

Contract-pilot exit criteria:

- a schema or equivalently strict validator rejects unknown axes, missing
  defaults, duplicate slots, undeclared semantic tokens, and Registry entries
  without a matching component contract;
- Button and Separator contract data matches their public TypeScript APIs,
  emitted `data-*` attributes, precompiled CSS, Storybook contract stories, and
  versioned Registry artifacts;
- `pnpm registry:check`, formatting, language checks, and the affected package
  tests remain green;
- generated or validated artifacts remain reproducible and contain no paid
  assets or repository-private operational data.

Current work log:

- **2026-08-06 — Research and adoption:** inspected Kumo's Base UI wrappers,
  Tailwind token generation, component Registry pipeline, CLI Blocks, JSON UI
  catalog, Figma generators, build packaging, and representative Button, Dialog,
  Select, and Table implementations; compared them with HeroUI v3 React Aria
  components, independent styles package, compound anatomy, semantic themes,
  and agent tooling.
- **2026-08-06 — Repository fit audit:** confirmed that iuvui already has the
  required behavior boundary, precompiled style delivery, stable slots and
  states, versioned Registry provenance, package/source parity, Storybook
  contracts, and Blocks-compatible CLI direction. Identified component contract
  metadata as the missing shared layer; implementation of the Button and
  Separator pilot is the next active slice.

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
`pnpm dlx @iuvui/cli` source-delivery path is not yet available. Repository
metadata uses the canonical `iuvapp/iuvui` origin; this does not authorize a
package publication.

### Registry and CLI

Button and Separator Registry artifacts are versioned at `0.0.1`, carry content
integrity, and preserve exact canonical and upstream provenance. A clean
consumer can install the packed local CLI, add either component to
`components/iuv-ui`, verify `iuvui.lock`, and type-check the installed source.

The production Registry at `iuvui.com` serves a valid `0.0.1` catalog and
component artifacts with canonical `iuvapp/iuvui` provenance. The current
development Worker uses the same canonical provenance. Production was
intentionally left unchanged in this development-only deployment. Public npm
runtime installation is available, but a clean public `pnpm dlx` smoke remains
blocked by the unpublished CLI package.

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
and valid `0.0.1` Registry output with canonical `iuvapp/iuvui` repository
links and provenance. This development deployment did not change production.

The current local, undeployed website revision replaces the marketing landing
page with a HeroUI OSS-style documentation catalog:

- fixed documentation navigation and a responsive contextual sidebar;
- searchable cards for the four actual `@iuvui/react` exports;
- live previews rendered by the real local iuvui components while HeroUI remains
  the application chrome;
- a Button variant matrix and configurable variant, size, and radius preview;
- truthful Separator orientation and `@iuvui/styles` export lists;
- no Dashboard link and no unpublished CLI installation command;
- English-default Paraglide copy with verified Simplified Chinese switching;
- desktop and mobile local browser checks with working search, variant updates,
  Dialog interaction, Registry fetches, no horizontal overflow, and no runtime
  errors.

On 2026-08-07, the local public website added Fumadocs as an embedded
documentation engine without changing its TanStack Start architecture:

- TanStack Start and TanStack Router remain responsible for application routing,
  server rendering, server functions, and the Cloudflare Worker boundary;
- Fumadocs supplies MDX compilation, documentation layout, navigation, table of
  contents, and the public search index;
- `/docs`, component reference pages, style documentation, and `/api/search`
  render through the TanStack Start application;
- interactive Button, TextField, Dialog, Separator, variant, metadata, and style
  examples reuse the real local public packages and catalogs;
- sequential local HTTP smoke checks returned `200` for documentation pages and
  search, and `404` for an unknown documentation path;
- the revision remains local and does not imply a Worker deployment or npm
  publication.

The scoped format, lint, type, test, development build, production build, and
language checks pass. This revision has not been deployed, so the Worker versions
above remain the last verified external website state.

### Storybook

The Storybook build and five Playwright contract tests pass, covering keyboard,
focus, theme, and axe behavior. Worker version
`81b9a987-cd69-40b5-87f9-1241858f6dc4` remains deployed at
`storybook.iuvui.com` with Button and Separator documentation and contract
stories.

### Dashboard boundary

The public homepage does not currently expose a Dashboard link. This repository
contains only public CLI, MCP, and commercial integration contracts at that
boundary; it contains no dashboard application, Clerk dependency, dashboard
Worker configuration, credentials, business logic, or paid assets. Free and Pro
users share the private dashboard; verified server entitlements control paid
capabilities. Detailed dashboard status belongs only in the private development
memo.

### MCP

The public MCP purpose, security boundary, and proposed Cloudflare architecture
are documented. The separate `iuv-tech/iuvui-mcp` repository and deployment are
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

- HeroUI OSS website baseline and an English-first localized documentation
  catalog candidate with actual components, variants, and style exports;
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
- add first-class component detail, styles, icons, releases, installation,
  accessibility, API, and provenance routes beyond the initial catalog sections;
- publish and smoke-test `@iuvui/cli` when that exact npm release is explicitly
  authorized;
- keep every package and deployed Registry item in `0.0.x` while the release gate
  remains active.

## Phase 2 (external) — Dashboard shell

Dashboard implementation, validation, credentials, and deployments are owned and
tracked exclusively by the private `iuvui-pro` repository. The public repository
has only these responsibilities at the boundary:

- add a development or production dashboard account link only after an explicit
  product decision, without embedding dashboard code;
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
   production promotion is explicitly requested; any promotion must preserve
   canonical `iuvapp/iuvui` links and Registry provenance.
3. Publish and verify the CLI only when the exact release is authorized and npm
   verification can complete.
4. Add first-class public component and documentation routes.
5. Expand the component catalog through versioned shadcn provenance, package and
   Registry parity, contract tests, and patch-only release metadata.

Dashboard and Convex execution continue independently in `iuvui-pro`; the
private memo remains the only authority for their detailed state.
