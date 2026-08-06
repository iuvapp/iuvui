# @iuvui/cli

The command-line entry point for the iuvui React UI system.

> This `0.0.x` package is under active development. Project initialization and
> verified Button and Separator source installation are available; managed
> source updates remain planned.

## Usage

Run the CLI without installing it globally:

```bash
pnpm dlx @iuvui/cli --help
pnpm dlx @iuvui/cli doctor
```

`@iuvui/cli` is the npm package name. The executable it exposes is named `iuvui`. After installing the package in a project, use the shorter command:

```bash
pnpm add -D @iuvui/cli
pnpm iuvui --help
pnpm exec iuvui doctor
```

The same executable can be installed globally:

```bash
pnpm add -g @iuvui/cli
iuvui --help
iuvui add button
```

The available V0 source workflow is:

```bash
pnpm dlx @iuvui/cli init
pnpm dlx @iuvui/cli add button
pnpm dlx @iuvui/cli add separator
```

Planned lifecycle commands include:

```bash
iuvui check
iuvui update button
```

By default, source components will be installed into `components/iuv-ui`:

```text
components/iuv-ui/button.tsx
components/iuv-ui/separator.tsx
```

This intentionally keeps iuvui source separate from shadcn's conventional `components/ui` directory. Pass `--source-dir` to `iuvui init` to override the target directory; `components/iuv-ui` remains the default.

`add` verifies Registry integrity, refuses to overwrite consumer changes, and records installed file hashes in `iuvui.lock`. It prints the required package-manager command but does not install dependencies automatically.

React components, styles, tokens, and icons will be published separately under the `@iuvui` scope.

## Authentication boundary

Installing and using the CLI does not require an account. Help, diagnostics, project initialization, inspection, and access to free artifacts remain available while signed out.

Authentication is requested only when a command needs a protected artifact or paid service:

```bash
iuvui style add base
# No login required for a free artifact.

iuvui style add editorial-pro
# The CLI asks the user to sign in when this artifact requires entitlement.

iuvui login
iuvui whoami
iuvui logout
```

The artifact manifest determines whether entitlement is required, so the CLI does not maintain separate free and paid command implementations. Paid Style Packs, premium variants, and animation configuration use the same protected artifact flow. Interactive login returns a user-scoped token. The Clerk Secret Key remains on the iuvui backend and is never included in this package.

## Status

The alpha package currently provides `--help`, `--version`, `doctor`, `init`, `add button`, and `add separator`. Authentication, inspection, diffing, updates, and protected Registry artifacts remain planned.

See the [iuvui repository](https://github.com/iuvapp/iuvui) for development progress.
