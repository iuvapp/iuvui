# iuvui Commercial Model

## Product boundary

Every component is free, including complex components. Accessibility behavior, stable anatomy, the package runtime, basic styles, base variants, semantic tokens, and the public icon foundation remain available without a Pro subscription.

Pro may sell selected maintained design outcomes and workflow leverage:

- selected premium Style Packs and premium visual variants;
- animation configuration, motion presets, easing systems, and transition recipes;
- managed source downloads and upgrades through `@iuvui/cli`;
- team workflows, project history, private Registry access, and support.

MCP is a free public documentation and capability-discovery service. Documentation for Free and Pro features is publicly readable. Pro pages clearly identify the required package and entitlement, but MCP does not return, proxy, or install paid artifacts.

Component capability must never be split into a deliberately weak free implementation and a complete paid implementation. A data grid, editor, command palette, or other complex component remains free when it becomes part of the public component system.

## Free customization contract

The supported free customization surface includes base styles, base variants, and the semantic token contract exposed by `@iuvui/tokens` and `@iuvui/styles`:

- color roles;
- typography scale;
- spacing and density;
- radii;
- borders and elevation;
- focus and state tokens;
- reduced-motion safety and essential state feedback.

Free users may always write their own CSS because iuvui runs in their application. The commercial boundary is therefore a product and distribution boundary, not an artificial technical restriction. iuvui provides free styles, variants, and basic token customization, while selected curated recipes, visual variants, and their ongoing maintenance may be Pro products. "Advanced" does not automatically mean "paid"; each asset has an explicit entitlement classification.

## Advanced Style Packs

A Style Pack is a versioned design system artifact, not a component fork. It targets the same stable component anatomy and state contracts as the free style layer.

```text
style-pack/
├── manifest.json       identity, version, compatibility, integrity
├── tokens.css          semantic token values and controlled axes
├── recipes.css         component and cross-component visual recipes
├── variants.js         typed premium presentation recipes
├── variants.d.ts       generated variant types
├── motion.css          optional motion language
├── assets/             licensed fonts or graphics when redistribution permits
└── preview.json        gallery metadata and supported surfaces
```

Each pack declares compatible ranges for `@iuvui/react`, `@iuvui/styles`, and the style contract version. Packs use scoped selectors such as `[data-ui-style="editorial"]`, making side-by-side previews and incremental adoption possible. They do not replace behavior, component props, or DOM contracts.

### Free and premium variants

Base variants ship with the free components and remain sufficient for complete product development. Premium variants are presentation-only recipes distributed with a Style Pack. They may combine typography, shape, density, depth, motion, and multi-slot styling, but they must never add exclusive behavior or accessibility capability.

Premium variant names should not be added to the fixed free component union and unlocked with a runtime license flag. Instead, each Style Pack exports a typed recipe layer that extends a free component through the public styling API. The generated wrapper or recipe supplies the additional TypeScript variant contract while reusing the unchanged free component implementation. This keeps entitlement checks out of application runtime and prevents an installed but unlicensed name from rendering an incomplete component.

### Pro animation configuration

Official animation configuration is a Pro product. This includes duration scales, easing systems, spring parameters, entrance and exit presets, orchestration, layout transitions, and component-specific motion recipes. Animation assets may be delivered as CSS, typed configuration, or framework adapters through the same protected Registry as paid Style Packs and variants.

The free component layer must still provide accessible and functional state changes. Focus indication, loading feedback, overlay visibility, and `prefers-reduced-motion` behavior are free contracts and cannot depend on a Pro animation package. Without Pro assets, components use a neutral baseline with no configurable animation system. Pro changes presentation and choreography only; it never unlocks behavior.

Style families should be designed as complete systems rather than isolated color themes. Useful families may emphasize editorial content, dense productivity software, data-heavy operations, consumer commerce, or expressive brand surfaces. Every family should define the same design axes:

| Axis    | Examples                                                          |
| ------- | ----------------------------------------------------------------- |
| Color   | neutral temperature, accent behavior, state contrast              |
| Type    | display and body hierarchy, numeric treatment, control labels     |
| Shape   | radius scale, borders, corner language                            |
| Density | compact, standard, comfortable                                    |
| Depth   | flat, bordered, layered, elevated                                 |
| Motion  | duration, easing, entrance and feedback patterns                  |
| Recipes | navigation, forms, overlays, tables, dashboards, content surfaces |

The shared axis contract makes packs testable and allows controlled variants such as compact density without multiplying every pack into unrelated implementations.

## Delivery and protection

Client-side CSS cannot be made secret after it is delivered to a browser. iuvui protects authorized distribution and ongoing service access instead of adding fragile runtime DRM.

1. A user signs in to `app.iuvui.com` through Clerk.
2. The iuvui entitlement service resolves the active user or Organization subscription.
3. The dashboard issues a short-lived user token or project-scoped CI token.
4. `@iuvui/cli` requests a signed Style Pack, premium variant, or animation manifest from the private Registry.
5. The Registry verifies entitlement, records an audit event, and returns a short-lived artifact URL.
6. The CLI verifies the artifact signature and checksum, stores it in a gitignored managed cache, and records only version and provenance in `iuvui.lock`.
7. Vite or another build integration imports the managed artifact without a runtime network request.

Production applications remain available when iuvui services are offline. There is no browser call-home, secret in the frontend bundle, or runtime license gate. Previously licensed builds continue to run after a subscription ends; access to new paid artifact downloads, paid updates, and applicable managed services stops according to the commercial terms. Free MCP capabilities remain available.

Premium artifacts stay outside the public repository and public npm packages. The private `iuvui-pro` repository owns the authenticated dashboard and may contain paid Style Packs, variants, and animation assets. The open repository may include the Style Pack schema, validators, integration adapters, and compatibility test harness without including paid design assets.

## CLI and MCP access

`@iuvui/cli` remains publicly installable and usable without an account. Help, diagnostics, project initialization, inspection, and free artifact workflows never require login. Authentication is requested only when a command attempts to access an artifact or service whose manifest requires entitlement.

Free and paid assets use the same commands. For example, `iuvui style add <name>` proceeds anonymously for a free Style Pack and starts login when the selected pack is protected. After login, the CLI sends a user-scoped access token to the Registry, which resolves the active user or Organization entitlement. The CLI never contains a Clerk Secret Key.

The MCP server provides documentation queries only. It can explain components, styles, variants, animation options, migration guidance, and the APIs exposed by `@iuvui/pro`. Every documented capability carries explicit availability metadata:

```json
{
  "availability": "pro",
  "package": "@iuvui/pro",
  "feature": "editorial-motion"
}
```

An agent using MCP must:

1. State clearly when a requested feature is Pro.
2. Check whether the project already depends on `@iuvui/pro` before generating Pro usage code.
3. Explain the documented Pro API when the package is available.
4. Direct the user to CLI login and installation when the package is absent.
5. Never reproduce, synthesize, or return paid CSS, variant recipes, animation configuration, package tarballs, or signed download URLs.

MCP does not perform entitlement verification and does not need a user login because all documentation is public. The CLI and Registry remain the only delivery and entitlement boundary for paid assets.

Tokens must be revocable, hashed at rest, minimally scoped, and separated into interactive user tokens and project-specific CI tokens. Tokens never enter `iuvui.lock`, browser code, build output, or repository files.

## License and trust principles

- Do not weaken free components to manufacture a paywall.
- Do not rely on obfuscation or client-side encryption for CSS protection.
- Do not require runtime license checks in customer applications.
- Keep public component packages independent from premium artifacts.
- Make compatibility and entitlement failures explicit before a build starts.
- Preserve previously downloaded source and already built applications under the granted project license.
- Prohibit redistribution of Style Packs as standalone assets while allowing their use in licensed end products.
