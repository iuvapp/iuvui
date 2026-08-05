# iuvui Product Model

## Positioning

iuvui is an ownable, customizable, and continuously upgradeable React UI system. It combines:

- the consistency, accessible behavior, and maintenance of a mature component library;
- the code ownership and deep customization of source-delivered component ecosystems;
- lifecycle support after source enters a consumer repository.

Styles, tokens, and icons provide system coherence. Source delivery preserves consumer freedom. The CLI manages the long-term component lifecycle.

## Two first-class delivery modes

Package and source delivery are equal product modes based on the same canonical component specifications, tests, and design assets.

### Package mode

```bash
pnpm add @iuvui/react @iuvui/styles
```

```tsx
import { Button } from "@iuvui/react";
```

iuvui maintains implementation and upgrades. Consumers customize through stable props, CSS variables, `className`, and `extendVariants`.

### Source mode

```bash
pnpm dlx @iuvui/cli init
pnpm dlx @iuvui/cli add button
```

The installed source belongs to the consumer. Planned lifecycle commands include:

```bash
iuvui check
iuvui diff button
iuvui update button
iuvui update --interactive
```

These commands describe the roadmap and must not be presented as released until implemented.

## shadcn ecosystem interoperability

Source delivery should follow public shadcn Registry protocols, directory conventions, and familiar workflows where practical instead of inventing a closed format.

```bash
# Ecosystem-compatible source installation
pnpm dlx shadcn@latest add @iuvui/button

# Managed source installation with lifecycle metadata
pnpm dlx @iuvui/cli add button
```

The first path minimizes migration cost. The second adds `iuvui.lock`, provenance, semantic diffs, migration rules, and three-way merging. iuvui's differentiation comes from its coherent styles, tokens, icons, and ongoing source maintenance rather than a proprietary installation protocol.

Compatibility does not mean copying component implementations. iuvui independently defines behavior, accessibility, visual language, variants, and upgrade contracts.

## Ownership boundary

| Layer              | Content                                                             | Primary owner |
| ------------------ | ------------------------------------------------------------------- | ------------- |
| Official ecosystem | Styles, tokens, icons, default variants, accessibility contracts    | iuvui         |
| Consumer source    | Installed components, product compositions, custom variants         | Consumer      |
| Synchronization    | Provenance, diffs, migrations, three-way merges, conflict reporting | iuvui CLI     |

An upgrade compares the old upstream source, current consumer source, and new upstream source. The CLI automatically merges demonstrably independent changes and asks for confirmation when safety cannot be established. It never silently overwrites local work.

## One source, two artifacts

```text
Canonical component source
├── npm build      -> @iuvui/react
└── Registry build -> source installed in a consumer project
```

The Registry layer handles delivery differences such as path rewriting, dependency declarations, target directories, version and hash metadata, language selection, and related styles or icons. Behavior, public props, DOM anatomy, base variants, and tests remain shared.

## Package names

```text
@iuvui/cli       CLI, Registry, and project lifecycle entry point
@iuvui/react     React package delivery
@iuvui/styles    Themes, default styles, and recipes
@iuvui/tokens    Design tokens
@iuvui/icons     Official icon system
@iuvui/pro       Reserved for a future commercial product
@iuvui/internal  Private repository package; never published
```

All public packages use the `@iuvui` npm scope. `@iuvui/cli` is the package name and `iuvui` is its executable:

```bash
pnpm dlx @iuvui/cli add button
pnpm add -g @iuvui/cli
iuvui add button
```

## Principles

- Independently implement on open infrastructure and public specifications.
- Never use third-party paid source or design assets as component-library implementation input.
- Keep behavior primitives replaceable and outside the public API.
- Treat DOM anatomy, props, CSS variables, `data-slot`, and migrations as stable contracts.
- Validate package and source artifacts from the same canonical specification.
- Extend existing Registry conventions only where lifecycle management requires it.
- Include version, dependency, migration, and provenance metadata in Registry artifacts.
- Report uncertain merges as conflicts and preserve user-owned variants.

## Differentiation

Obtaining source is the beginning, not the end. Consumers own their final code and variants, while iuvui continues to provide a coherent ecosystem, fixes, provenance, and upgrade paths.

## Commercial boundary

All components remain free, including complex components. Base styles and base variants are free. Pro monetization focuses on maintained advanced Style Packs, premium visual variants, authenticated CLI source delivery and upgrades, MCP workflows, and team services. Free users receive the complete behavior layer plus supported base styles, base variants, and semantic-token customization.

Because shipped CSS is observable in a browser, premium protection applies to authorized distribution, updates, and service access rather than runtime DRM. See [Commercial model](./COMMERCIAL_MODEL.md) for the Style Pack contract, entitlement flow, and licensing principles.

See [Web platform](./WEB_PLATFORM.md) for the public site, Pro dashboard, HeroUI boundary, and deployment plan.
