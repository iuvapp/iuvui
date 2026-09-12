# @iuvui/react

Accessible React components maintained by iuvui.

The canonical package now exports Button, Card, Dialog, Input, Label,
Separator, Text Field, and Textarea on the same delivery path. The last public
npm release remains `@iuvui/react@0.0.1` and does not include Card, Input,
Label, or Textarea until a later authorized `0.0.x` publication.

```bash
pnpm add @iuvui/react @iuvui/styles react react-dom
```

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

Standalone entry points are `@iuvui/react/button`, `@iuvui/react/card`,
`@iuvui/react/dialog`, `@iuvui/react/input`, `@iuvui/react/label`,
`@iuvui/react/separator`, `@iuvui/react/text-field`, and
`@iuvui/react/textarea`.

See [iuvui.com](https://iuvui.com) for documentation.
