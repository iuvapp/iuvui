# Repository Instructions

## Communication

- Repository rules do not control conversations with users. Use the language requested by the user in conversation.

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
