# iuvui Architecture

## Package and release boundaries

- `packages/react`: the only public component API; React remains a peer dependency.
- `packages/internal`: private React Aria behavior adapters, bundled into `@iuvui/react` and never imported by consumers.
- `packages/styles`: publishable precompiled CSS with no runtime injection or consumer source scanning.
- `packages/tokens`: semantic CSS variables and matching TypeScript types.
- `packages/utils`: class merging, Tailwind v4 conflict handling, and multi-slot variant resolution.
- `packages/icons`: independent icon entry points using `currentColor`, forwarded refs, and no side effects.
- `packages/cli`: the local workspace and future public `@iuvui/cli` package;
  it exposes the `iuvui` executable for project initialization, Registry
  installation, provenance, and future lifecycle operations.
- `packages/site-ui`: private presentation primitives for the public website.
- `registry`: versioned release and local-staging component-delivery metadata
  generated from canonical package source. A machine-readable component-contract
  layer is planned and does not exist yet.
- `apps/storybook`: consumes real package entry points and hosts Playwright contract fixtures.
- `apps/web`: the public `iuvui.com` Cloudflare Worker application.

The former private `iuvui-pro` repository is archived, and no dashboard
application is maintained in this workspace. A future private `iuv-pro`
repository will own the shared Free and Pro dashboard and protected product
assets when it is created. Server-side entitlements protect commercial
capabilities; public component implementations remain in this repository.

`tsup` produces ESM, multiple entry points, split chunks, source maps, and declarations. React and ReactDOM remain external, while private internal adapters are bundled. TypeScript is pinned to 5.9 until the declaration pipeline is verified against a later major release.

## Public and protected delivery boundary

All components, including complex components, ship through the public package
and Registry system. Base styles, base variants, semantic tokens, accessible
state feedback, and reduced-motion behavior are public contracts. Selected
premium Style Packs, presentation variants, animation configuration, and motion
presets may be delivered as protected `@iuvui/pro` assets without forking or
weakening component behavior.

`@iuvui/cli` remains public and its basic workflows remain anonymous. A protected
artifact manifest may trigger login, but the CLI never contains a Clerk Secret
Key or authorizes itself. The private service verifies entitlement and returns a
short-lived artifact response. MCP documents Free and Pro capabilities publicly
without acting as an entitlement or paid-content delivery service.

The public repository may define schemas, validators, public integration
adapters, and compatibility tests for protected assets. It must not contain the
dashboard application, Clerk server integration, private Worker configuration,
paid recipes, signed URLs, or credentials. Browser-delivered code is observable,
so sensitive account, billing, and entitlement decisions stay on verified server
boundaries in the private system.

## React Aria boundary

React Aria Components provide tested keyboard, focus, form, and overlay behavior while iuvui owns its visual system and stable API.

1. Public props use React, standard DOM types, and iuvui-owned types only.
2. React Aria components, contexts, and types are never re-exported.
3. Only `packages/internal` may aggregate React Aria primitives directly.
4. `packages/react` maps render state to iuvui state types and stable data attributes.
5. Tests target semantic roles, public props, `data-slot`, and documented state rather than internal DOM structure.

A primitive may be replaced after its adapter passes the same contract suite. Public APIs and CSS selectors must not change merely because the underlying primitive changes.

## Design and source baseline

The architecture separates three concerns that are often conflated:

- shadcn/ui defines the initial design vocabulary, component source reference, semantic token direction, and Registry ecosystem compatibility;
- React Aria Components supplies replaceable behavior primitives behind `packages/internal`;
- HeroUI informs the maintained-package ergonomics and product presentation without becoming a source-code dependency of public components.

The public API belongs to iuvui. Upstream source may accelerate implementation, but it does not decide permanent props, DOM anatomy, variants, tokens, or upgrade guarantees.

### Planned machine-readable component contracts

The planned private build-time contract will describe each canonical component's
identity, public anatomy, stable slots, documented states, variant axes,
defaults, semantic tokens, examples, package entry points, and Registry delivery
paths. The contract is metadata about the canonical implementation; it is not a
second implementation and is not automatically part of the public React API.

Registry artifacts, component reference documentation, compatibility checks,
agent guidance, and future design-tool adapters will consume this contract. Until
then, TypeScript source, precompiled CSS, behavioral tests, and explicit Registry
metadata remain the authoritative implementation surfaces.

The first contract implementation must validate existing components before it
generates new runtime code. Generation may be introduced only for deterministic
artifacts where reviewable source inputs, stable output, and package/source parity
are preserved. Design tools are downstream consumers: Figma exports and drift
reports never override component source, accessibility behavior, or Registry
provenance.

### Versioned upstream provenance

Every shadcn-derived or shadcn-referenced Registry item records one or more upstream references. Each reference includes an exact 40-character commit revision, immutable source URL, repository-relative source path, sync date, license, derivation relationship, and an explicit list of local changes. Mutable branch names and unversioned Registry endpoints may be included for discovery, but never replace the immutable source identity.

Generated Registry items preserve this metadata. The CLI copies it into `iuvui.lock` beside the installed iuvui version, Registry integrity digest, and consumer file digests. This produces three independently comparable states:

1. the pinned shadcn source revision;
2. the current iuvui canonical and Registry output;
3. the consumer-owned installed files.

The dedicated weekly upstream workflow compares each pinned Git blob with the
same path on the upstream default branch. A changed or moved blob fails that
workflow and requests maintainer review without modifying source. Maintainers
then classify the shadcn diff, update the pinned revision, blob, sync date, and
local-change notes, rerun relevant package, Registry, and consumer checks, and
publish a new `0.0.x` Registry item only when explicitly authorized. Contract
checks will join that workflow after the planned contract layer exists. Consumer
updates can then distinguish upstream changes from iuvui adaptations and local
variants.

## Styles and tokens

The cascade order is fixed:

```css
@layer ui-theme, ui-base, ui-components, ui-utilities;
```

Components consume semantic `--ui-*` variables rather than raw palette values. Published CSS runs directly in browsers, so Tailwind consumers do not need an `@source` rule for iuvui. Tailwind CSS v4 remains the recommended utility extension layer, while complex brand themes should primarily override semantic variables.

## Stable API rules

- Compound component names, public props, and semantic behavior follow the documented compatibility policy; the active pre-`0.1.0` gate keeps all releases in `0.0.x`.
- Every public DOM part has a stable `data-slot` attribute.
- Documented states such as `data-disabled`, `data-invalid`, `data-open`, and `data-pending` are contracts.
- DOM wrappers may be added, but consumers must never rely on hierarchy or `nth-child` selectors.
- Public parts accept `className`, `style`, and applicable standard `aria-*` and `data-*` attributes.
- Stateful class callbacks expose iuvui-owned state types only.
- Runtime CSS injection, primitive re-exports, bundled React, eager icon loading, and public internal packages are prohibited.

## Localization architecture

The root `project.inlang` and `messages` directory define localization for
applications in this repository. Each application compiles its own Paraglide
runtime into `src/paraglide`. A future private dashboard repository must own an
independent catalog so releases and translation changes do not couple the two
repositories. Shared UI packages accept translated strings or otherwise remain
independent of application locale detection.

English is the source locale. English and Simplified Chinese are enabled. Additional languages may be added only through approved Paraglide message files and project configuration; translated text must never be embedded directly in source code.

## Adding a component

1. Pin and classify any shadcn source or architectural reference with immutable provenance.
2. Define public behavior, state, slots, and iuvui-owned props.
3. Select the smallest internal behavior primitive without leaking its types.
4. Add semantic tokens and stable style selectors; verify forced colors and reduced motion.
5. Export the root and appropriate subpaths; verify tree shaking and `sideEffects`.
6. Add type, unit, keyboard, focus, SSR or hydration, axe, and Playwright contract coverage as appropriate.
7. Cover default, variants, disabled, invalid, loading, dark mode, variables, `className`, and `extendVariants` in Storybook.
8. Run language, formatting, lint, type, test, build, Registry, `pnpm upstream:check`, and package checks, then add a patch Changeset.

Storybook aliases must not bypass real package entry points. Tests, Storybook internals, and internal source must not be published.
