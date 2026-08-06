# iuvui

iuvui is an ownable, customizable, and continuously upgradeable React UI system. It combines a maintained design system, installable React packages, source delivery, and lifecycle tooling.

**Use shadcn/ui like HeroUI.**

iuvui is an independent project and is not affiliated with shadcn/ui or HeroUI. shadcn/ui is the design and source reference baseline, React Aria Components provide replaceable behavior behind an internal adapter, and the package API and delivery experience follow the convenience expected from a maintained component library.

The canonical public repository is
[`iuvapp/iuvui`](https://github.com/iuvapp/iuvui). The separate private
`iuvapp/iuvui-pro` repository owns the shared Free and Pro account dashboard and
all protected product assets; no dashboard application code or paid asset is
maintained here.

The repository currently implements package delivery first. Public packages use the `@iuvui/*` scope. Consumers customize components through stable props, CSS variables, `className`, and `extendVariants`. React Aria Components provide behavior behind a private adapter; their types, contexts, and DOM structure are not public API.

Source delivery is a first-class product mode. `@iuvui/cli` installs component source into a consumer project, records both iuvui and exact upstream provenance, compares local changes, and will provide safe migration paths. The registry follows public shadcn conventions where practical rather than introduce a closed distribution format. See [Product model](./docs/PRODUCT_MODEL.md).

## Install

```bash
pnpm add @iuvui/react @iuvui/styles react react-dom
```

Import the precompiled styles once. Consumers do not need Tailwind to scan the library's `node_modules`:

```css
@import "@iuvui/styles";
```

Individual style entry points are also available:

```css
@import "@iuvui/styles/theme.css";
@import "@iuvui/styles/components/button.css";
```

## Components

```tsx
import { Button, Dialog, Separator, TextField } from "@iuvui/react";

export function Form() {
  return (
    <>
      <TextField.Root name="email" isRequired>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input type="email" />
        <TextField.Description>Used for notifications.</TextField.Description>
        <TextField.ErrorMessage>
          Enter a valid email address.
        </TextField.ErrorMessage>
      </TextField.Root>

      <Separator />

      <Button variant="default" onPress={() => undefined}>
        Save
      </Button>

      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Backdrop isDismissable>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Title>Confirm action</Dialog.Title>
              <Dialog.Description>
                This action can be undone later.
              </Dialog.Description>
              <Dialog.Close />
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>
      </Dialog.Root>
    </>
  );
}
```

Components also expose subpath entry points such as `@iuvui/react/dialog`, `@iuvui/react/button`, and `@iuvui/icons/search`.

## Themes and local styles

Component styles live in the `ui-theme`, `ui-base`, `ui-components`, and `ui-utilities` cascade layers. Override semantic variables to apply a brand theme:

```css
[data-brand="violet"] {
  --ui-primary: oklch(0.62 0.25 310);
  --ui-primary-foreground: oklch(0.99 0.01 310);
  --ui-radius-md: 0.85rem;
}

.my-button {
  letter-spacing: 0.02em;
}
```

The default theme supports light, dark, `prefers-color-scheme`, and explicit `data-theme="light|dark"` selection. It includes foundations for forced colors and reduced motion.

## Extend variants

```tsx
import { Button, extendVariants } from "@iuvui/react";

const BrandButton = extendVariants(Button, {
  variants: {
    tone: {
      brand: "bg-fuchsia-600 text-white",
      danger: "bg-red-600 text-white",
    },
  },
  defaultVariants: { tone: "brand" },
});

<BrandButton tone="danger">Delete</BrandButton>;
```

Tailwind CSS v4 is the recommended utility extension environment. `tailwind-merge` resolves common conflicts. Variant extension changes presentation without replacing internal component behavior.

## Accessibility and support

The private React Aria adapter implements keyboard interaction, focus visibility, dialog focus containment and restoration, and form relationships. Unit tests, Playwright, and axe treat essential behavior and stable `data-slot` or state attributes as contracts. Automated scans do not replace manual assistive-technology testing.

The browser policy targets the current two stable releases of Chromium, Firefox, and Safari, with React 18.3+ and React 19 while those releases receive upstream security support. Packages are ESM-only unless real consumer data establishes a CJS requirement.

## Versioning

The current development channel is locked to `0.0.x`. Changesets use patch releases only, and no package is published unless the user explicitly authorizes that exact publication. The normal SemVer deprecation and breaking-change policy begins only after the `0.1.0` gate is explicitly unlocked. CI never publishes automatically.

## License

iuvui is licensed under the [Apache License 2.0](./LICENSE). Components adapted
from third-party MIT-licensed sources retain their required attribution in the
distributed third-party notices.

## Development

```bash
pnpm install
pnpm language:check
pnpm format:check
pnpm release:check
pnpm registry:check
pnpm upstream:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
pnpm consumer:check
pnpm test:e2e
```

After an explicitly authorized npm publication, run the external package and
production Registry smoke separately:

```bash
pnpm public:check
```

## Web platform

- `iuvui.com` is the public brand, component, and documentation site.
- `ui.iuvdev.com` is the Cloudflare Access-protected development deployment of
  the public site.
- `iuvui.iuvdev.com` and `app.iuvui.com` are the development and production
  Clerk-authenticated dashboard domains for Free and Pro users. The private
  `iuvui-pro` repository owns both; server-side entitlements control paid
  capabilities.
- `storybook.iuvui.com` is the public component-development and contract surface.
- `mcp.iuvui.com` is the planned authentication-free MCP documentation service.
  It exposes public documentation and Pro capability metadata, never paid asset
  contents.
- Each surface has an independent Cloudflare Worker, configuration, secrets, and
  release process in its owning repository.
- HeroUI OSS is the production UI baseline until iuvui can safely bootstrap
  itself. HeroUI Pro source and licensed assets must not be committed to this
  public repository; any future application-layer integration must comply with
  its purchased license.
- Paraglide provides the shared localization foundation. English and Simplified Chinese are enabled, with English as the canonical source locale.

See [Web platform](./docs/WEB_PLATFORM.md) for the complete boundary and rollout plan.
The dated implementation status, phase exit criteria, minimum path, and immediate
next milestone live in the [development memo](./docs/DEVELOPMENT_MEMO.md).

## Commercial model

All components, including complex components, are free. Styles and variants have both free and paid offerings; only selected premium design assets are monetized. Official animation configuration, motion presets, and transition recipes are Pro assets. Free components retain essential state feedback and reduced-motion accessibility. MCP provides free public documentation for both Free and Pro capabilities, clearly labels paid features, and teaches agents how to use an installed `@iuvui/pro` package without distributing paid assets. Authenticated CLI source delivery and managed upgrades remain a separate commercial decision. See [Commercial model](./docs/COMMERCIAL_MODEL.md).

## Roadmap

- Expand validated primitives based on real product use instead of component count.
- Establish an independent icon ecosystem and visual regression baseline.
- Adapt the initial MIT-licensed shadcn component set into iuvui contracts, styles, tests, and dual package/Registry outputs.
- Expand `@iuvui/cli` from verified source installation into inspection, diffing, and safe upgrades.
- Compare versioned shadcn upstream provenance against Registry and `iuvui.lock` records while protecting user-owned variants.
- Evaluate future Blocks and Pro products without creating commercial packages prematurely.
- Improve compatibility, migration tooling, and deprecation telemetry from consumer evidence.

See [Architecture](./ARCHITECTURE.md) for package boundaries and the component contribution process.
