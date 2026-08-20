# Repository Instructions

## Communication

- Repository rules do not control conversations with users. Use the language requested by the user in conversation.

## Related repositories

- The canonical public repository is `iuvapp/iuvui`. It owns components,
  packages, the CLI, public Registry output, public documentation, Storybook,
  and `iuvui.com`.
- The former private `iuv-tech/iuvui-pro` repository is archived. Future
  dashboard implementation and protected Pro assets belong in a separate
  private `iuv-pro` repository when it is created. It is not currently present
  locally and is not a workspace sibling of this repository.
- This public repository may link to the dashboard and document public
  integration contracts, but it must not contain dashboard application code,
  Clerk integration, dashboard Worker configuration, dashboard credentials, or
  paid assets.
- Treat any future private repository as an independent Git project: inspect,
  validate, and commit it separately.
- Do not introduce cross-repository workspace dependencies or move paid assets into this repository.

## Product invariants

- iuvui is a React UI system. React remains a peer dependency of the public
  component package; framework-agnostic delivery is not part of the current
  product contract.
- Every component remains free, including complex components. Accessibility,
  behavior, stable anatomy, base styles, base variants, semantic tokens, and the
  public icon foundation must not be weakened to create a paywall.
- Package mode and source mode are two delivery forms of the same canonical
  component implementation. `@iuvui/react` provides the maintained package;
  the local `@iuvui/cli` workspace exposes the `iuvui` executable and installs
  owned source under `components/iuv-ui`. Public `pnpm dlx` and global-install
  workflows begin only after the CLI is explicitly published.
- Styles and variants may have both free and paid offerings. Only explicitly
  classified premium Style Packs, presentation variants, animation
  configuration, motion presets, and related maintained design assets may
  require Pro entitlement.
- `@iuvui/pro` is reserved for the future protected asset and integration
  contract. It is not the dashboard application package and paid assets must not
  enter this repository or its public npm packages.
- Free CLI capabilities remain usable without an account. Login may be required
  only when a command requests an explicitly protected artifact or service.
- MCP is a free public documentation and capability-discovery surface. It may
  label and explain Pro capabilities, but it must never return paid assets,
  signed download URLs, credentials, or entitlement decisions.
- Free and Pro users will share the future private dashboard. Authentication
  grants account access; server-side entitlements decide which commercial
  capabilities are available. Client-side visibility is never an authorization
  boundary.

## Public website direction

- `iuvui.com` is the public documentation, component catalog, Registry, styles,
  variants, icons, and release surface. Do not turn its primary navigation or
  homepage into a dashboard promotion surface; add a dashboard account link only
  after an explicit product decision.
- TanStack Start and TanStack Router are the durable application, routing, SSR,
  and server-function boundary for the public website. Fumadocs is an embedded
  MDX documentation, navigation, and search layer; it must not replace TanStack
  Start or introduce Next.js, App Router conventions, or Nitro into the site.
- Prefer the TanStack ecosystem for application concerns when a concrete need
  exists, while keeping each package adoption explicit and independently
  justified. Do not install unused TanStack packages solely for branding.
- HeroUI OSS is the website chrome and visual baseline until self-bootstrap. Use
  its components, semantic tokens, system typography, restrained surfaces, and
  documentation information patterns without copying HeroUI Pro assets.
- Documentation routes use Fumadocs Glass layout and information patterns as
  adapted from `iuv-stack/apps/iuv-docs`, while remaining inside `apps/web` and
  retaining TanStack Start, Paraglide, and the existing Cloudflare Workers.
- iuvui component previews may render the actual local public packages, but the
  surrounding application shell remains on HeroUI until the self-bootstrap gate
  is satisfied.
- Catalog, variant, style, package, and Registry claims must match real exports
  in the repository. Do not invent planned components, protected style names,
  Registry availability, or package versions to fill the interface.

## English-only authored content

- English is the repository's canonical source language and the default product locale. Simplified Chinese (`zh-CN`) is the only currently enabled translation locale.
- All repository-authored code, identifiers, comments, UI copy, documentation, examples, tests, snapshots, changesets, pull request text, and commit messages must be written in English.
- Do not add non-English prose to source files as comments, temporary notes, fixtures, placeholder text, or examples.
- Generated files, third-party code, package-manager lockfiles, and user-provided data fixtures are exempt only when preserving their original content is necessary.

## Localization boundary

- User-facing copy belongs in the shared Paraglide project under `messages/` and should be consumed through generated message functions.
- English messages live in `messages/en.json` and remain the canonical source copy.
- Simplified Chinese lives in `messages/zh-CN.json` and is the only currently
  enabled translation. A future locale may appear only after it is explicitly
  added to `project.inlang/settings.json` with a matching
  `messages/<locale>.json` catalog.
- Never inline translated non-English strings in TypeScript, TSX, CSS, Markdown, configuration, tests, or generated templates.

## Documentation authority

- `README.md` is the concise public entry point, not an operational status log.
- `ARCHITECTURE.md` owns technical package, Registry, and runtime boundaries.
- `docs/PRODUCT_MODEL.md` owns package and source-delivery behavior.
- `docs/COMMERCIAL_MODEL.md` owns Free and Pro product policy.
- `docs/WEB_PLATFORM.md` owns domains, application ownership, security
  boundaries, and deployment topology.
- `docs/MCP_SERVER.md` owns the planned public MCP contract.
- `docs/DEVELOPMENT_MEMO.md` is the only dated public execution record. Update it
  after verification, deployment, or publication instead of copying temporary
  status into stable architecture documents.
- Dashboard implementation and deployment status belongs only in the future
  private `iuv-pro` development memo after that repository exists. Public
  documents may state integration contracts, but must not duplicate an
  operational checklist.

## Enforcement

- Run `pnpm language:check` before committing.
- Run formatting, linting, type checks, tests, and builds appropriate to the changed scope.
- Commit messages must be in English.

## Release safety

- Never publish an npm package unless the user explicitly requests publication in the current conversation.
- The public repository and every published package use Apache License 2.0. Preserve the repository license and all required third-party notices in distributed artifacts.
- Until the user explicitly unlocks `0.1.0`, every public package and Registry item version must remain in the `0.0.x` range.
- Changesets must use `patch` releases while the `0.1.0` lock is active. Do not add `minor` or `major` Changesets.
- Run `pnpm release:check` before versioning packages, committing release metadata, or publishing.

## Deployment and secret safety

- This repository may configure and deploy only `iuvui-web-dev`,
  `iuvui-web-prod`, and `iuvui-storybook`. It must never configure or deploy a
  dashboard Worker.
- Deploy the public website only through `pnpm web:deploy:dev` or
  `pnpm web:deploy:prod`, and deploy Storybook only through its dedicated script.
  A development deployment authorizes neither production, Storybook, nor npm
  publication.
- The Cloudflare Vite build selects `dev` or `prod` through `CLOUDFLARE_ENV` and
  writes a flattened Wrangler configuration into `dist`. Do not use a bare
  `wrangler deploy` or assume a later `--env` flag can correct a bundle built for
  the wrong environment.
- Treat a Cloudflare Access redirect on a protected development hostname as an
  access-boundary result, not as an authenticated application smoke test.
- Never commit Clerk keys, Cloudflare tokens, HeroUI credentials, signed asset
  URLs, or local secret files. Public client builds may contain only values that
  are explicitly publishable.
- HeroUI OSS may remain the website baseline until self-bootstrap. Do not commit
  HeroUI Pro source or licensed assets to this public repository; any future
  application-layer integration must comply with the purchased license and keep
  protected credentials outside source control.

## Upstream traceability

- Treat shadcn/ui as the design and source reference baseline, React Aria Components as a replaceable behavior implementation behind `@iuvui/internal`, and HeroUI as a product and delivery experience reference.
- Every component derived from or architecturally referenced against shadcn/ui must record the upstream repository, exact commit revision, immutable source URL, source path, sync date, license, relationship, and local deviations in Registry metadata.
- Never use a mutable branch, `latest`, or an unversioned Registry URL as the sole provenance for component source.
- Preserve upstream provenance in generated Registry items and in `iuvui.lock` so future checks and upgrades can distinguish upstream changes from consumer-owned changes.
