# Development Memo

This document is the durable execution record for the iuvui product phases. It
separates implemented code, local verification, external deployment, and public
release so that one cannot be mistaken for another.

Last verified: 2026-08-06.

## Status rules

- A phase is complete only when every exit criterion is satisfied.
- A successful local build or commit is not a deployment.
- A successful package build or pack check is not an npm release.
- Public and Pro repositories are validated, committed, deployed, and released
  independently.
- While the release gate is active, every public version remains in `0.0.x`.
- No npm publication occurs without explicit authorization for the exact release.
- Implementation may proceed in parallel, but a later phase does not make an
  earlier phase complete.

## Verified delivery snapshot

| Area             | Repository state                                                                                                                                                                                                                          | External state                                                                                                                                                                                                                                          | Conclusion                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Public packages  | All six public package manifests are versioned at `0.0.1`. Builds, tests, declarations, tarball contents, license checks, exact internal release ranges, and the independent consumer smoke pass.                                         | npm authentication is not active in the release shell, so none of the six packages has been published. The GitHub repository has been pushed but remains private pending an explicit visibility decision.                                               | The package set is release-ready; account authorization remains the publication blocker.    |
| Registry and CLI | Button and Separator artifacts carry `0.0.1` integrity and exact upstream provenance. A clean consumer installs the packed CLI, adds both components to `components/iuv-ui`, verifies `iuvui.lock`, and type-checks the installed source. | The matching Registry was deployed to `iuvui-web-dev` as Worker version `ce3d4558-98f9-4e3f-97d9-544a4ae2f8b0`. Cloudflare Access correctly protects the dev hostname, but an authenticated HTTP content smoke remains open. Production is still stale. | The independent local path is closed and dev is deployed; public production remains open.   |
| Public website   | TanStack Start SSR dev and production builds pass. Wrangler uses distinct `iuvui-web-dev` and `iuvui-web-prod` Workers with Custom Domains and no extra `workers.dev` hostname.                                                           | The current build is deployed to `ui.iuvdev.com`. `iuvui.com` still serves the previous production build.                                                                                                                                               | Dev deployment is complete; authenticated dev smoke and production promotion remain open.   |
| Storybook        | The build and all five Playwright contract tests pass, including keyboard, focus, theme, and axe coverage.                                                                                                                                | Worker version `81b9a987-cd69-40b5-87f9-1241858f6dc4` is deployed. Its public index returns Separator Docs, Horizontal, Vertical, and Named Boundary entries.                                                                                           | The current Storybook deployment is complete.                                               |
| Dashboard        | The private repository contains the Clerk boundary, organization switching, protected Worker session check, and production Wrangler route for `app.iuvui.com`. Production deploy scripts atomically supply Clerk Worker keys.             | `app.iuvui.com` is not deployed because the browser and Worker still need matching Clerk production keys.                                                                                                                                               | Configuration is release-ready; credentials and authenticated deployment smoke remain open. |
| MCP              | The public contract, security boundary, and proposed Cloudflare architecture are documented.                                                                                                                                              | No independent MCP repository or deployment exists yet.                                                                                                                                                                                                 | Planned, not implemented.                                                                   |

## Minimum path

The minimum source-delivery path is:

1. build versioned Registry artifacts;
2. initialize a clean consumer project with `iuvui init`;
3. install Button or Separator source into `components/iuv-ui`;
4. verify content integrity and write canonical and upstream provenance to
   `iuvui.lock`;
5. install the exact public runtime dependencies from npm;
6. compile and test the clean consumer project;
7. repeat the flow using the public Registry and published CLI instead of local
   repository paths.

The local equivalent of steps 1 through 6 passes against `0.0.1` tarballs in an
independent temporary consumer. The same Registry is deployed to the
Access-protected development Worker. Literal npm installation in step 5 and the
public flow in step 7 remain open because npm authentication, package
publication, authenticated dev verification, and production promotion are not
complete.

## Phase 1 — Public foundation

Status: **In progress**.

Scope:

- HeroUI OSS website baseline;
- brand and landing page;
- component and documentation entry points;
- versioned public Registry endpoints;
- TanStack Start SSR on the `iuvui-web-dev` and `iuvui-web-prod` Workers;
- `ui.iuvdev.com` and `iuvui.com` smoke tests.

Completed in the repositories:

- the public shell and localized English-first content;
- TanStack Start SSR migration;
- dev and production Wrangler environments;
- Button and Separator Registry output;
- local build, type, lint, language, Registry, and package verification;
- the current dev Worker deployment with the `0.0.1` Registry;
- the current public Storybook deployment with Separator.

Exit criteria still open:

- verify SSR, locale switching, navigation, and Registry content types on dev;
- ensure every deployed Registry version remains in `0.0.x`;
- add real component and documentation routes instead of relying only on landing
  page anchors and external repository links;
- deploy the verified build to production;
- verify the production landing page and Registry artifacts match the release
  commit.

## Phase 2 — Dashboard shell

Status: **In progress**.

Scope:

- Clerk sign-in, sign-out, and session restoration;
- organization switching and organization-scoped shell state;
- typed navigation and empty states;
- signed-out, unauthorized, and unentitled states;
- the `app.iuvui.com` Cloudflare Worker.

Completed in the repositories:

- the Vite dashboard shell;
- Clerk provider and signed-out boundary;
- organization and user controls;
- typed TanStack Router routes and workspace navigation;
- empty section pages and a protected Worker session probe;
- local language, release, format, lint, type, test, and build checks.

Exit criteria still open:

- configure and verify real development Clerk credentials;
- exercise sign-in, session restoration, organization switching, and protected
  Worker access end to end;
- verify unauthorized and unentitled states;
- deploy the dashboard Worker and configure `app.iuvui.com`;
- repeat the authenticated smoke test against the deployed environment.

Phase 2 is therefore not complete. The credential-free routing slice is complete;
the deployed authentication and organization slice is not.

## Phase 3 — Pro features

Status: **Not started**.

Scope:

- initialize a real Convex development deployment;
- connect Clerk identity and organization tenancy to Convex;
- model projects and entitlements;
- deliver protected styles, variants, and animation presets;
- add licenses, downloads, teams, and billing workflows;
- introduce licensed HeroUI Pro assets only after the license is active.

Exit criteria include tenant-safe authorization, indexed data access, entitlement
tests, protected artifact delivery, and deployed dashboard workflows. Placeholder
credentials, invented Convex deployment data, and client-side entitlement flags do
not satisfy this phase.

## Phase 4 — Product integration

Status: **Not started**.

Scope:

- CLI login, identity, and logout;
- organization-aware entitlement verification;
- authenticated Pro artifact delivery;
- project associations, download history, tokens, and license seats;
- integrity verification for protected artifacts.

Free CLI commands and free component access must remain usable without an
account. Pro authorization remains a server-side delivery boundary.

## Phase 5 — Self-bootstrap

Status: **Not started**.

Scope:

- audit iuvui components against production accessibility and compatibility
  gates;
- replace HeroUI incrementally rather than through a one-time rewrite;
- use the public site, dashboard, Storybook, and examples as continuous
  dogfooding consumers;
- treat regressions found by those consumers as component release blockers.

This phase begins only when the replacement components satisfy the production
contracts already exercised by the websites.

## `0.0.1` release readiness gate

The first npm release is a separate cross-phase gate. Before publication:

1. select and add the public repository license, then make every public package
   license field consistent — complete with Apache License 2.0;
2. add the missing `@iuvui/icons` patch Changeset, finish the package metadata,
   and verify exact tarball contents — complete;
3. build a clean consumer using local tarballs — complete for package imports,
   SSR, CLI source delivery, lock provenance, and TypeScript;
4. deploy and smoke-test the current dev Registry — deployment complete,
   authenticated Access smoke still open;
5. obtain explicit authorization for the exact `0.0.1` package set — complete;
6. publish dependency packages in dependency order;
7. deploy the matching production Registry and website;
8. publish the CLI after its default Registry endpoint is compatible;
9. run a clean public npm and `pnpm dlx` smoke test.

Do not publish `0.1.0` while the release gate is active.

## Immediate next milestone

Close the remaining account and production gates before expanding the component
catalog:

1. complete npm login, verify iuvui Organization publish access and 2FA, and
   confirm whether the public repository should become visible now;
2. complete the authenticated dev SSR, locale, navigation, and Registry smoke;
3. publish dependency packages in order: tokens, utils, icons, styles, React;
4. deploy the matching production website and Registry, then verify public JSON
   content types and provenance;
5. publish the CLI and run clean public npm and `pnpm dlx` source-delivery smoke;
6. configure matching Clerk production keys, deploy `app.iuvui.com`, and finish
   the authenticated Phase 2 smoke matrix.

After that gate closes, finish Phase 2 with real Clerk and Cloudflare credentials,
then initialize the first real Convex development project for Phase 3.
