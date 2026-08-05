# iuvui

iuvui is an ownable, customizable, and continuously upgradeable React UI system. It combines a maintained design system, installable React packages, source delivery, and lifecycle tooling.

The repository currently implements package delivery first. Public packages use the `@iuvui/*` scope. Consumers customize components through stable props, CSS variables, `className`, and `extendVariants`. React Aria Components provide behavior behind a private adapter; their types, contexts, and DOM structure are not public API.

Source delivery is a first-class product mode. `@iuvui/cli` will install component source into a consumer project, record provenance, compare local changes, and provide safe migration paths. The registry will follow public shadcn conventions where practical rather than introduce a closed distribution format. See [Product model](./docs/PRODUCT_MODEL.md).

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
import { Button, Dialog, TextField } from "@iuvui/react";

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

      <Button variant="solid" color="accent" onPress={() => undefined}>
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
  --ui-accent: oklch(0.62 0.25 310);
  --ui-accent-foreground: oklch(0.99 0.01 310);
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

Public packages follow SemVer, with Changesets producing changelogs. Deprecated APIs remain for at least one minor cycle with migration guidance. Breaking behavior and stable selector changes require a major release. CI never publishes automatically; releases require an explicit human-controlled workflow.

## Development

```bash
pnpm install
pnpm language:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
pnpm test:e2e
```

## Web platform

- `iuvui.com` is the public brand, component, and documentation site.
- `app.iuvui.com` is the Clerk-authenticated Pro dashboard maintained in the private `iuvui-pro` repository.
- Both applications deploy independently to Cloudflare Workers.
- HeroUI OSS is the production UI baseline until iuvui can safely bootstrap itself. Licensed HeroUI Pro assets may later be used only in the private website implementation.
- Paraglide provides the shared localization foundation. English and Simplified Chinese are enabled, with English as the canonical source locale.

See [Web platform](./docs/WEB_PLATFORM.md) for the complete boundary and rollout plan.

## Commercial model

All components, including complex components, are free. Styles and variants have both free and paid offerings; only selected premium design assets are monetized. Official animation configuration, motion presets, and transition recipes are Pro assets. Free components retain essential state feedback and reduced-motion accessibility. MCP provides free public documentation for both Free and Pro capabilities, clearly labels paid features, and teaches agents how to use an installed `@iuvui/pro` package without distributing paid assets. Authenticated CLI source delivery and managed upgrades remain a separate commercial decision. See [Commercial model](./docs/COMMERCIAL_MODEL.md).

## Roadmap

- Expand validated primitives based on real product use instead of component count.
- Establish an independent icon ecosystem and visual regression baseline.
- Build `@iuvui/cli` and the registry for source installation, diffing, and safe upgrades.
- Record upstream versions and file provenance in `iuvui.lock` while protecting user-owned variants.
- Evaluate future Blocks and Pro products without creating commercial packages prematurely.
- Improve compatibility, migration tooling, and deprecation telemetry from consumer evidence.

See [Architecture](./ARCHITECTURE.md) for package boundaries and the component contribution process.
