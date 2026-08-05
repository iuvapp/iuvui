# iuvui Architecture

## Package and release boundaries

- `packages/react`: the only public component API; React remains a peer dependency.
- `packages/internal`: private React Aria behavior adapters, bundled into `@iuvui/react` and never imported by consumers.
- `packages/styles`: publishable precompiled CSS with no runtime injection or consumer source scanning.
- `packages/tokens`: semantic CSS variables and matching TypeScript types.
- `packages/utils`: class merging, Tailwind v4 conflict handling, and multi-slot variant resolution.
- `packages/icons`: independent icon entry points using `currentColor`, forwarded refs, and no side effects.
- `packages/site-ui`: private presentation primitives for the public website.
- `apps/storybook`: consumes real package entry points and hosts Playwright contract fixtures.
- `apps/web`: the public `iuvui.com` Cloudflare Worker application.

The Clerk-authenticated `app.iuvui.com` Cloudflare Worker and its private presentation package are maintained in the separate private `iuvui-pro` repository. Public component implementations remain in this repository.

`tsup` produces ESM, multiple entry points, split chunks, source maps, and declarations. React and ReactDOM remain external, while private internal adapters are bundled. TypeScript is pinned to 5.9 until the declaration pipeline is verified against a later major release.

## React Aria boundary

React Aria Components provide tested keyboard, focus, form, and overlay behavior while iuvui owns its visual system and stable API.

1. Public props use React, standard DOM types, and iuvui-owned types only.
2. React Aria components, contexts, and types are never re-exported.
3. Only `packages/internal` may aggregate React Aria primitives directly.
4. `packages/react` maps render state to iuvui state types and stable data attributes.
5. Tests target semantic roles, public props, `data-slot`, and documented state rather than internal DOM structure.

A primitive may be replaced after its adapter passes the same contract suite. Public APIs and CSS selectors must not change merely because the underlying primitive changes.

## Styles and tokens

The cascade order is fixed:

```css
@layer ui-theme, ui-base, ui-components, ui-utilities;
```

Components consume semantic `--ui-*` variables rather than raw palette values. Published CSS runs directly in browsers, so Tailwind consumers do not need an `@source` rule for iuvui. Tailwind CSS v4 remains the recommended utility extension layer, while complex brand themes should primarily override semantic variables.

## Stable API rules

- Compound component names, public props, and semantic behavior follow SemVer.
- Every public DOM part has a stable `data-slot` attribute.
- Documented states such as `data-disabled`, `data-invalid`, `data-open`, and `data-pending` are contracts.
- DOM wrappers may be added, but consumers must never rely on hierarchy or `nth-child` selectors.
- Public parts accept `className`, `style`, and applicable standard `aria-*` and `data-*` attributes.
- Stateful class callbacks expose iuvui-owned state types only.
- Runtime CSS injection, primitive re-exports, bundled React, eager icon loading, and public internal packages are prohibited.

## Localization architecture

The root `project.inlang` and `messages` directory define localization for applications in this repository. Each application compiles its own Paraglide runtime into `src/paraglide`. The private `iuvui-pro` repository owns an independent catalog for the dashboard so releases and translation changes do not couple the two repositories. Shared UI packages accept translated strings or otherwise remain independent of application locale detection.

English is the source locale. English and Simplified Chinese are enabled. Additional languages may be added only through approved Paraglide message files and project configuration; translated text must never be embedded directly in source code.

## Adding a component

1. Define public behavior, state, slots, and iuvui-owned props.
2. Select the smallest internal behavior primitive without leaking its types.
3. Add semantic tokens and stable style selectors; verify forced colors and reduced motion.
4. Export the root and appropriate subpaths; verify tree shaking and `sideEffects`.
5. Add type, unit, keyboard, focus, SSR or hydration, axe, and Playwright contract coverage as appropriate.
6. Cover default, variants, disabled, invalid, loading, dark mode, variables, `className`, and `extendVariants` in Storybook.
7. Run language, formatting, lint, type, test, build, and package checks, then add a Changeset.

Storybook aliases must not bypass real package entry points. Tests, Storybook internals, and internal source must not be published.
