# @iuvui/cli

The command-line entry point for the iuvui React UI system.

> The package is under active development and has not been published yet. Component installation and managed source updates are planned capabilities.

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

The planned source workflow is:

```bash
pnpm dlx @iuvui/cli add button
iuvui check
iuvui update button
```

React components, styles, tokens, and icons will be published separately under the `@iuvui` scope.

## Status

The alpha package currently provides `--help`, `--version`, and `doctor`. The `init` and `add` commands intentionally return a clear “coming soon” error until the Registry workflow is ready.

See the [iuvui repository](https://github.com/tcitry/iuvui) for development progress.
