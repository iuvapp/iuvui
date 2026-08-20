# Development Memo

This document is the durable execution record for the public iuvui repository.
It separates implemented code, local verification, external deployment, and npm
publication so that one cannot be mistaken for another.

Dashboard implementation and deployment state are deliberately excluded. The
former private `iuv-tech/iuvui-pro` repository is archived and is no longer an
operational authority. A future private `iuv-pro` repository will own the
dashboard and protected assets when it is created. This memo records only the
public integration boundary with that future system.

Last local verification: 2026-08-20.
Last recorded external deployment: 2026-08-06.

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
  the local source-mode CLI installs the same canonical component implementation
  under `components/iuv-ui`. Public `pnpm dlx` and global-install workflows are
  release targets because `@iuvui/cli` is not yet published.
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

## 2026-08-20 — Local foundation-component packaging baseline

Status: **Verified locally; not released.**

The current working tree adds Card, Input, Label, and Textarea as the first
low-risk foundation-component packaging baseline. The work extends the canonical
React package, precompiled styles, Registry source-delivery artifacts, component
scoped notices, and CLI source-delivery coverage while retaining immutable
shadcn/ui provenance for every derived Registry item.

This is not an npm release, a Registry deployment, a website deployment, or a
Storybook deployment. The existing public runtime packages already use version
`0.0.1`, which npm does not permit maintainers to overwrite. The local baseline
is therefore intentionally unpublishable at that same version. Any future
publication requires a new permitted `0.0.x` version, completed package,
Registry, and independent-consumer validation, and explicit publication
authorization.

The local Registry separates released Button and Separator artifacts from the
four foundation-component staging artifacts. The website catalog exposes the
same distinction: it links only released Registry JSON and labels the newer
package and CSS exports as Workspace preview.

## 2026-08-20 — Documentation surface and release-state synchronization

Status: **Verified locally; not deployed.**

The public documentation remains inside `apps/web`; no documentation-only app,
Cloudflare Worker, or hostname was added. The existing TanStack Start routes now
embed the Fumadocs Glass layout pattern used by `iuv-stack/apps/iuv-docs`, while
retaining iuvui's MDX source, Paraglide localization, HeroUI application chrome,
component previews, and Cloudflare build boundary.

The documentation now distinguishes the actual public package surface (Button,
Text Field, Dialog, and Separator at npm `0.0.1`), the local Workspace previews
(Card, Input, Label, and Textarea), the public Registry surface (Button and
Separator), and the local six-item source-delivery staging Registry. It also
states that `@iuvui/cli@0.0.1` has local packed-tarball coverage but is not an
npm release. Public `pnpm dlx`, global installation, authentication, managed
updates, diffs, and Style Pack commands remain documented as future interfaces.

Local route checks covered `/docs`, `/docs/components/card`, and
`/api/search?query=Card`. English and `zh-CN` checks confirmed the Glass layout,
localized Fumadocs chrome, Workspace preview status, and a component search
result. These checks and the development build do not deploy `iuvui-web-dev` or
`iuvui-web-prod`.

Verification completed on 2026-08-20:

- `pnpm registry:check` and `pnpm upstream:check` confirmed generated output
  and six immutable upstream references;
- `pnpm --filter @iuvui/react test`, `pnpm --filter @iuvui/cli test`, and
  `pnpm --filter @iuvui/web test` passed;
- `pnpm --filter @iuvui/web typecheck`, `pnpm --filter @iuvui/web lint`, and
  `pnpm --filter @iuvui/web build:dev` passed;
- `pnpm lint`, `pnpm typecheck`, and `pnpm test` passed across the workspace;
- `pnpm pack:check` and `pnpm consumer:check` passed for the isolated package
  and owned-source consumer;
- `pnpm format:check`, `pnpm language:check`, `pnpm release:check`, and
  `git diff --check` passed.

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

Button and Separator are the two released Registry artifacts at `0.0.1`; they
carry content integrity and exact canonical and upstream provenance. Card,
Input, Label, and Textarea have equivalent local staging artifacts and
component-scoped third-party notices, but they are intentionally excluded from
the public Registry catalog.

A clean consumer can install the packed local CLI, add Button, Card, Input,
Label, Separator, and Textarea to `components/iuv-ui`, verify `iuvui.lock`, and
type-check the installed source. The public `pnpm dlx` path remains blocked by
the unpublished CLI package.

The committed public Registry build contains only the released Button and
Separator artifacts. It is the source of truth for the next Web deployment; it
does not make an assertion about the live `iuvui.com` response until that
deployment is explicitly requested and independently verified. Public npm
runtime installation is available, but a clean public `pnpm dlx` smoke remains
blocked by the unpublished CLI package.

### Public website and documentation

The public website has separate TanStack Start builds and Cloudflare Workers for
development and production:

- `iuvui-web-dev` serves `ui.iuvdev.com`;
- `iuvui-web-prod` serves `iuvui.com`.

The following entries are historical deployment records, not validation of the
current uncommitted documentation revision. Re-run external application and
Registry smoke checks after any future deployment:

- `iuvui-web-dev` was deployed as Worker version
  `2d0053f0-727c-4945-a938-37e4ffd2a959` on 2026-08-06. Anonymous root and
  Registry requests returned `302` redirects to Cloudflare Access, confirming
  only that the development access policy was active.
- `iuvui-web-prod` was last recorded as Worker version
  `0455c0ad-4e2a-4853-bda0-ff965faa28f0`. This record is not a smoke result for
  the current source tree.

The current local, undeployed website revision combines the landing and catalog
with an embedded Fumadocs Glass documentation surface in the same `apps/web`
project:

- Glass-layout documentation navigation, table of contents, search, and MDX
  component pages while TanStack Start remains the routing and Worker boundary;
- searchable cards for four published `@iuvui/react` exports and four explicit
  Workspace previews;
- live previews rendered by the real local iuvui components while HeroUI remains
  the application chrome;
- a Button variant matrix and configurable variant, size, and radius preview;
- truthful package, Registry, and `@iuvui/styles` availability labels;
- no Dashboard link and no unpublished CLI installation command;
- English-default Paraglide copy with Simplified Chinese switching;
- one Cloudflare Web build for both landing and documentation routes, rather
  than a documentation-only application or Worker.

Fumadocs remains an embedded documentation engine without changing the TanStack
Start architecture:

- TanStack Start and TanStack Router remain responsible for application routing,
  server rendering, server functions, and the Cloudflare Worker boundary;
- Fumadocs supplies MDX compilation, documentation layout, navigation, table of
  contents, and the public search index;
- `/docs`, component reference pages, style documentation, and `/api/search`
  render through the TanStack Start application;
- interactive Button, Card, Input, Label, Textarea, TextField, Dialog, and
  Separator examples reuse the real local package workspace and catalog status;
- the 2026-08-20 local HTTP smoke checks confirmed the Glass layout, localized
  Fumadocs chrome, Workspace preview status, and the Card search result;
- the revision remains local and does not imply a Worker deployment or npm
  publication.

The commands recorded in the 2026-08-20 verification entry cover the current
local revision. This revision has not been deployed, so the Worker versions
above remain historical external deployment records.

### Storybook

The following is the last recorded Storybook deployment, not validation of the
current source tree: Worker version `81b9a987-cd69-40b5-87f9-1241858f6dc4` was
recorded at `storybook.iuvui.com` with Button and Separator documentation and
contract stories. Re-run the Storybook build, Playwright contract tests, and
external smoke checks before treating that record as current.

### Dashboard boundary

The public homepage does not currently expose a Dashboard link. This repository
contains only public CLI, MCP, and commercial integration contracts at that
boundary; it contains no dashboard application, Clerk dependency, dashboard
Worker configuration, credentials, business logic, or paid assets. The former
`iuvui-pro` repository is archived. A future private `iuv-pro` repository will
own the shared Free and Pro dashboard, where verified server entitlements will
control paid capabilities. Detailed dashboard status will belong only in that
future repository's development memo.

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
3. install Button, Card, Input, Label, Separator, and Textarea source into
   `components/iuv-ui` from the local staging Registry;
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
- Button, Text Field, Dialog, and Separator public package outputs at `0.0.1`;
- Button and Separator public Registry outputs at `0.0.1`, plus locally
  verified Card, Input, Label, and Textarea staging artifacts;
- five public runtime packages at `0.0.1`;
- historical production website and Registry verification;
- historical Access-protected development deployment at the Worker version
  recorded above;
- historical public Storybook deployment with component contract coverage;
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

## Phase 2 (external) — Future dashboard shell

The former `iuvui-pro` repository is archived. Dashboard implementation,
validation, credentials, and deployments are deferred until the future private
`iuv-pro` repository exists. The public repository has only these
responsibilities at the boundary:

- add a development or production dashboard account link only after an explicit
  product decision, without embedding dashboard code;
- keep free CLI behavior usable without authentication;
- define public contracts for authenticated protected delivery without
  containing Clerk server credentials, business rules, or paid assets;
- ensure public MCP documentation describes Pro capabilities without becoming
  an alternate protected-content delivery path.

No dashboard operational status or checklist is duplicated here.

## Phase 3 boundary — Pro features

The future private `iuv-pro` repository will own product data, Clerk and Convex
integration, entitlements, protected styles, premium variants, animation
presets, licenses, downloads, teams, and billing workflows. The public
repository may own open schemas, validators, integration adapters, and
compatibility tests, but never the protected assets or private business logic.
Phase status and deployment evidence will remain in that private memo.

## Phase 4 — Product integration

Status in the public CLI: **Planned**.

The current local CLI provides project initialization and verified Button, Card,
Input, Label, Separator, and Textarea installation from packed tarballs. The
planned integration scope includes login, identity, logout, organization-aware
entitlement verification, protected artifact delivery, project tokens, integrity
verification, and non-secret provenance. Free commands and free component access
must remain usable without an account.

## Phase 5 — Self-bootstrap

Status: **Not started**.

The self-bootstrap phase will audit iuvui components against the production
accessibility and compatibility gates, replace HeroUI incrementally, and use the
public site, future private dashboard, Storybook, and examples as continuous
dogfooding consumers. HeroUI OSS remains in production until each replacement
satisfies the contracts already exercised by those surfaces.

## `0.0.x` release gate

The initial runtime package set is published at `0.0.1`; the CLI portion remains
open. Before considering that public source-delivery release complete:

1. keep Apache License 2.0 and third-party notices consistent in every artifact;
2. preserve exact package ranges, Registry integrity, and immutable upstream
   provenance;
3. choose a fresh permitted patch `0.0.x` version for changed runtime packages,
   then publish the resulting package set, including `@iuvui/cli`, only with
   explicit authorization and successful npm account verification;
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
4. Verify the local Glass documentation routes, catalog availability labels, and
   public Registry filtering before any Web deployment.
5. Expand the component catalog through versioned shadcn provenance, package and
   Registry parity, planned contract tests, and patch-only release metadata.

Dashboard and Convex execution are deferred until `iuv-pro` exists. Its future
private memo will then be the only authority for their detailed state.
