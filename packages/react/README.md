# @iuvui/react

Accessible React components maintained by iuvui.

```bash
pnpm add @iuvui/react @iuvui/styles react react-dom
```

The published `0.0.1` React exports are Button, Text Field, Dialog, and
Separator:

```tsx
import { Button, Separator } from "@iuvui/react";
import "@iuvui/styles";

export function Actions() {
  return (
    <>
      <Button>Save</Button>
      <Separator />
    </>
  );
}
```

Published `0.0.1` entry points are `@iuvui/react/button`,
`@iuvui/react/text-field`, `@iuvui/react/dialog`, and
`@iuvui/react/separator`.

## Workspace package

The canonical workspace also exports Card, Input, Label, and Textarea on the
same package path, with matching CSS and local Registry artifacts. Those files
are verified by local pack and consumer checks. They are not part of the
already-published `@iuvui/react@0.0.1` npm artifact; installing the public
package and copying the workspace example will fail until a later authorized
`0.0.x` publication.

See [iuvui.com](https://iuvui.com) for documentation.
