# Repository Instructions

## Communication

- Repository rules do not control conversations with users. Use the language requested by the user in conversation.

## Related repositories

- This public repository owns components, packages, CLI, documentation, and `iuvui.com`.
- The sibling private repository at `../iuvui-pro` owns Pro assets and `app.iuvui.com`.
- Treat the repositories as independent Git projects: inspect, validate, and commit each one separately.
- Do not introduce cross-repository workspace dependencies or move paid assets into this repository.

## English-only authored content

- English is the repository's canonical source language. English and Simplified Chinese (`zh-CN`) are the currently enabled product locales.
- All repository-authored code, identifiers, comments, UI copy, documentation, examples, tests, snapshots, changesets, pull request text, and commit messages must be written in English.
- Do not add non-English prose to source files as comments, temporary notes, fixtures, placeholder text, or examples.
- Generated files, third-party code, package-manager lockfiles, and user-provided data fixtures are exempt only when preserving their original content is necessary.

## Localization boundary

- User-facing copy belongs in the shared Paraglide project under `messages/` and should be consumed through generated message functions.
- English messages live in `messages/en.json` and remain the canonical source copy.
- A future non-English locale may appear only in an explicitly enabled `messages/<locale>.json` file after the locale is added to `project.inlang/settings.json`.
- Never inline translated non-English strings in TypeScript, TSX, CSS, Markdown, configuration, tests, or generated templates.

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

## Upstream traceability

- Treat shadcn/ui as the design and source reference baseline, React Aria Components as a replaceable behavior implementation behind `@iuvui/internal`, and HeroUI as a product and delivery experience reference.
- Every component derived from or architecturally referenced against shadcn/ui must record the upstream repository, exact commit revision, immutable source URL, source path, sync date, license, relationship, and local deviations in Registry metadata.
- Never use a mutable branch, `latest`, or an unversioned Registry URL as the sole provenance for component source.
- Preserve upstream provenance in generated Registry items and in `iuvui.lock` so future checks and upgrades can distinguish upstream changes from consumer-owned changes.
