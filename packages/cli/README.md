# @iuvui/cli

The command-line entry point for the iuvui React UI system.

> This `0.0.1` workspace package is not yet published to npm. Its source
> delivery workflow is verified locally from packed tarballs; public `pnpm dlx`
> and global-install commands are future release interfaces.

## Local development surface

The current local implementation provides `help`, `version`, `doctor`, `init`,
and `add`.

```bash
pnpm --filter @iuvui/cli exec iuvui help
pnpm --filter @iuvui/cli exec iuvui doctor
pnpm --filter @iuvui/cli exec iuvui init
pnpm --filter @iuvui/cli exec iuvui add button card input label separator textarea
```

`init` creates `iuvui.json` and defaults to `components/iuv-ui`. Pass
`--source-dir` with a safe relative project path to select another location.
`add` requires prior initialization, verifies Registry integrity, records file
hashes and immutable provenance in `iuvui.lock`, refuses to overwrite differing
consumer files, and prints the required package-manager dependency command. It
does not install dependencies automatically.

The locally verified source items are Button, Card, Input, Label, Separator,
and Textarea. Card, Input, Label, and Textarea use a local staging Registry
because their matching package and CSS files are not publicly publishable at the
already-used `0.0.1` version.

## Future published interface

When an explicitly authorized npm release is available, the package name will
remain `@iuvui/cli` and the executable will remain `iuvui`:

```bash
pnpm dlx @iuvui/cli help
pnpm dlx @iuvui/cli init
pnpm dlx @iuvui/cli add button
```

The same executable is intended to support global installation:

```bash
pnpm add -g @iuvui/cli
iuvui add button
```

## Planned capabilities

Authentication, account inspection, diffing, migrations, managed updates,
protected Registry artifacts, and Style Pack commands are not implemented yet.
The future authentication boundary will keep free commands usable without an
account and never include a Clerk Secret Key in this package.

See the [iuvui repository](https://github.com/iuvapp/iuvui) for development
progress.
