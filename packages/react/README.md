# @iuvui/react

Accessible React components maintained by iuvui.

```bash
pnpm add @iuvui/react @iuvui/styles react react-dom
```

```tsx
import { Button, Separator } from "@iuvui/react";
import "@iuvui/styles";

export function Actions() {
  return (
    <div>
      <Button>Save</Button>
      <Separator />
    </div>
  );
}
```

Individual components are also available through entry points such as
`@iuvui/react/button` and `@iuvui/react/separator`.

See [iuvui.com](https://iuvui.com) for documentation.
