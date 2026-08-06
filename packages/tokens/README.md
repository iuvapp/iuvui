# @iuvui/tokens

Semantic design tokens and CSS variables for iuvui.

```css
@import "@iuvui/tokens/theme.css";
```

```ts
import { tokenVariable } from "@iuvui/tokens";

const primary = tokenVariable("primary");
```

The default token set supports light and dark themes. Applications can override
the semantic `--ui-*` variables without changing component source.

See [iuvui.com](https://iuvui.com) for documentation.
