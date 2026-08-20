# @iuvui/react

Accessible React components maintained by iuvui.

> This workspace snapshot includes unreleased foundation components. npm package
> versions are immutable, so these local `0.0.1` artifacts must not be confused
> with the already published `@iuvui/react@0.0.1` release.

```bash
pnpm add @iuvui/react @iuvui/styles react react-dom
```

The published `0.0.1` React exports are Button, Text Field, Dialog, and
Separator. The following example is a local workspace preview: Card and Input
will require a future authorized `0.0.x` release before they can be installed
from npm.

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@iuvui/react";
import "@iuvui/styles";

export function Actions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Input aria-label="Project name" />
        <Button>Save</Button>
      </CardContent>
    </Card>
  );
}
```

Published `0.0.1` entry points are `@iuvui/react/button`,
`@iuvui/react/text-field`, `@iuvui/react/dialog`, and
`@iuvui/react/separator`. Card, Input, Label, and Textarea entry points belong
to the local workspace preview only.

See [iuvui.com](https://iuvui.com) for documentation.
