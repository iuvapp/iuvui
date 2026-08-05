# Development Memo

This document is the durable execution record for the iuvui product phases. It
separates implemented code, local verification, external deployment, and public
release so that one cannot be mistaken for another.

Last verified: 2026-08-05.

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

| Area             | Repository state                                                                                                                                                                                                                | External state                                                                                                                                           | Conclusion                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Public packages  | Package builds, tests, declarations, and pack checks pass locally. Source manifests remain at `0.0.0`, and the pending Changesets resolve only to `0.0.1`. The first-release Changeset set does not yet include `@iuvui/icons`. | `@iuvui/cli`, `@iuvui/react`, `@iuvui/styles`, `@iuvui/tokens`, `@iuvui/utils`, and `@iuvui/icons` are not available from the public npm Registry.       | Testing is active; npm publication has not started.                                |
| Registry and CLI | Button and Separator Registry artifacts are generated with integrity and upstream provenance. The local CLI implements `init` and verified `add` flows.                                                                         | The production Registry is stale: it still advertises old `0.1.0` metadata and `@latest` dependencies, and it does not serve the current Separator JSON. | The local source-delivery slice passes, but the public end-to-end path does not.   |
| Public website   | The repository contains the TanStack Start SSR migration and Cloudflare dev/prod configuration. Both builds pass locally.                                                                                                       | `iuvui.com` still serves the previous client-only build. `ui.iuvdev.com` is protected by Cloudflare Access.                                              | Website code has changed, but the current production update has not been deployed. |
| Storybook        | The local build and the five Playwright contract tests pass, including keyboard, focus, theme, and axe coverage.                                                                                                                | `storybook.iuvui.com` serves an older catalog without Separator.                                                                                         | The current Storybook is verified locally but not deployed.                        |
| Dashboard        | The private repository contains Clerk boundaries, organization switching, typed TanStack Router routes, navigation, empty states, and a protected Worker session check.                                                         | `app.iuvui.com` does not currently resolve publicly, and the current shell has not completed a deployed Clerk organization smoke test.                   | Phase 2 implementation is substantial but not operationally complete.              |
| MCP              | The public contract, security boundary, and proposed Cloudflare architecture are documented.                                                                                                                                    | No independent MCP repository or deployment exists yet.                                                                                                  | Planned, not implemented.                                                          |

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

Steps 1 through 4 pass in the repository test suite. Steps 5 through 7 are not
complete because the required packages have not been published and the deployed
Registry is older than the repository implementation. The minimum local slice is
working; the minimum public product path is not yet closed.

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
- local build, type, lint, language, Registry, and package verification.

Exit criteria still open:

- deploy the current commit to the dev Worker;
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
   license field consistent; the CLI currently remains `UNLICENSED` and the other
   public packages do not declare a license;
2. add the missing `@iuvui/icons` patch Changeset, finish the package metadata,
   and verify exact tarball contents;
3. build a clean consumer using local tarballs;
4. deploy and smoke-test the current dev Registry;
5. obtain explicit authorization for the exact `0.0.1` package set;
6. publish dependency packages in dependency order;
7. deploy the matching production Registry and website;
8. publish the CLI after its default Registry endpoint is compatible;
9. run a clean public npm and `pnpm dlx` smoke test.

Do not publish `0.1.0` while the release gate is active.

## Immediate next milestone

Close the minimum public product path before expanding the component catalog:

1. choose the public license and make the `0.0.1` package set release-ready;
2. run the local-tarball clean-consumer test;
3. deploy the current website and Registry to the protected dev environment;
4. verify the full dev smoke matrix;
5. request explicit `0.0.1` publication authorization;
6. publish, deploy production, and repeat the clean external smoke test.

After that gate closes, finish Phase 2 with real Clerk and Cloudflare credentials,
then initialize the first real Convex development project for Phase 3.
