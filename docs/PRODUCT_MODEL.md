# iuvui Product Model

## Positioning

iuvui is an ownable, customizable, and continuously upgradeable React UI system. It combines:

- the consistency, accessible behavior, and maintenance of a mature component library;
- the code ownership and deep customization of source-delivered component ecosystems;
- lifecycle support after source enters a consumer repository.

Styles, tokens, and icons provide system coherence. Source delivery preserves consumer freedom. The CLI manages the long-term component lifecycle.

## Two first-class delivery modes

Package and source delivery are equal product modes based on the same canonical component specifications, tests, and design assets.

### Current availability

The public `0.0.1` npm artifacts provide package delivery for Button, Text
Field, Dialog, and Separator. Card, Input, Label, and Textarea are verified
workspace previews whose matching package and CSS files cannot be added to the
already-published `0.0.1` artifacts.

The local `@iuvui/cli` workspace verifies source delivery from packed tarballs,
but it is not published to npm. Public `pnpm dlx` and global-install workflows
remain future interfaces until an explicitly authorized release.

### Package mode

```bash
pnpm add @iuvui/react @iuvui/styles
```

```tsx
import { Button } from "@iuvui/react";
```

iuvui maintains implementation and upgrades. Consumers customize through stable
props, CSS variables, `className`, and `extendVariants`.

### Source mode

The installed source belongs to the consumer. The local packed CLI implements
`help`, `version`, `doctor`, `init`, and `add` for Button, Card, Input, Label,
Separator, and Textarea. It requires `init` before `add`, writes `iuvui.lock`,
checks Registry integrity, and refuses to overwrite a differing owned file.

The following public commands are future release syntax, not currently runnable
from npm:

```bash
pnpm dlx @iuvui/cli init
pnpm dlx @iuvui/cli add button
iuvui check
iuvui diff button
iuvui update button
iuvui update --interactive
```

These commands describe the roadmap and must not be presented as released until implemented.

The CLI installs source components into `components/iuv-ui` by default. This
namespace keeps iuvui-managed source distinct from shadcn's conventional
`components/ui` directory. Project configuration may override the target
directory. Future diffs and updates must resolve the same configured path.

When the CLI is published, its free workflows will remain usable without login.
Login will be requested only when a future Style Pack, variant, or managed
service is explicitly classified as protected by its Registry manifest.

## shadcn ecosystem interoperability

Source delivery should follow public shadcn Registry protocols, directory conventions, and familiar workflows where practical instead of inventing a closed format.

The current local `iuvui add` path adds verified source files and provenance to
`iuvui.lock`. A future shadcn-compatible public Registry address and the future
published `iuvui add` command will minimize migration cost without inventing a
closed protocol. Semantic diffs, migration rules, and three-way merging are
later lifecycle stages. iuvui's differentiation comes from its coherent styles,
tokens, icons, and ongoing source maintenance rather than a proprietary
installation protocol.

### V0 implementation strategy

V0 may use MIT-licensed shadcn component source as an implementation starting point. Each imported component is adapted into iuvui's canonical component model rather than redistributed under a different package name without modification. The adaptation establishes:

- iuvui-owned public APIs, compound anatomy, semantic variants, and stable contracts;
- HeroUI-inspired package structure and product delivery without copying HeroUI source;
- shared package and Registry outputs from the same canonical component;
- iuvui styles, tokens, icons, tests, Storybook stories, and lifecycle metadata;
- explicit upstream provenance, version or commit, source path, license, and modification history.

The shadcn copyright and MIT license notice must be retained whenever copied source or a substantial portion is distributed. A third-party notices file must be introduced with the first imported component and kept current as additional upstream sources are adopted. Paid third-party source and design assets are never valid implementation inputs.

### Upstream synchronization contract

Source provenance is machine-readable product data, not a prose-only attribution. Each shadcn-derived or shadcn-referenced component records:

- the upstream project and component name;
- the repository and exact commit revision;
- an immutable source URL and repository-relative source path;
- the public Registry endpoint when one exists;
- the date iuvui last reviewed that source;
- the upstream license and whether the relationship is derived source or architectural reference;
- the local behavior, API, styling, accessibility, and delivery changes applied by iuvui.

Registry generation preserves the record, and `iuvui add` copies it into `iuvui.lock` together with both Registry and installed-file integrity. A scheduled maintainer check compares pinned Git blobs with the current upstream paths; future consumer checks compare the installed lock record with the current iuvui Registry. Neither path automatically overwrites consumer-owned code.

This strategy accelerates the initial component catalog while leaving room to replace internal primitives later. Public APIs must not expose Radix, Base UI, or another behavior primitive as a permanent iuvui contract.

## Ownership boundary

| Layer              | Content                                                             | Primary owner |
| ------------------ | ------------------------------------------------------------------- | ------------- |
| Official ecosystem | Styles, tokens, icons, default variants, accessibility contracts    | iuvui         |
| Consumer source    | Installed components, product compositions, custom variants         | Consumer      |
| Synchronization    | Provenance, diffs, migrations, three-way merges, conflict reporting | iuvui CLI     |

The planned upgrade workflow will compare the old upstream source, current
consumer source, and new upstream source. It must never silently overwrite
local work; automatic merging will be introduced only after its safety contract
is implemented and tested.

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
@iuvui/internal  Private workspace package; never published
```

All public packages use the `@iuvui` npm scope. `@iuvui/cli` is the future
published package name and `iuvui` is its executable:

```bash
# Future public interface after an authorized npm release
pnpm dlx @iuvui/cli add button
pnpm add -g @iuvui/cli
iuvui add button
```

## Principles

- Build on permissively licensed open-source implementations when they accelerate delivery, while preserving licenses, provenance, and independent iuvui contracts.
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

All components remain free, including complex components. Styles and variants have both free and paid offerings; only selected premium design assets are monetized. Official animation configuration, motion presets, easing systems, and transition recipes are Pro assets. Essential state feedback and reduced-motion accessibility remain part of the free component contract. MCP provides public documentation and capability discovery without authentication. Pro documentation is public and clearly labeled so agents understand when `@iuvui/pro` is required, but MCP never distributes paid assets. Authenticated CLI source delivery and managed upgrades remain a separate commercial decision. Free users receive the complete behavior layer plus supported styles, variants, and semantic-token customization.

Because shipped CSS is observable in a browser, premium protection applies to authorized distribution, updates, and service access rather than runtime DRM. See [Commercial model](./COMMERCIAL_MODEL.md) for the Style Pack contract, entitlement flow, and licensing principles.

See [Web platform](./WEB_PLATFORM.md) for the public site, future private
dashboard boundary, HeroUI boundary, and deployment plan.
