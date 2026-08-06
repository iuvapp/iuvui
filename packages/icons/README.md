# @iuvui/icons

Tree-shakeable React icons used by iuvui components.

```tsx
import { CloseIcon } from "@iuvui/icons/close";
import { SearchIcon } from "@iuvui/icons/search";

export function Actions() {
  return (
    <>
      <SearchIcon aria-hidden />
      <CloseIcon aria-hidden />
    </>
  );
}
```

Icon components accept standard SVG props. Import a subpath when an application
only needs one icon.

See the [iuvui repository](https://github.com/iuv-tech/iuvui) for documentation
and source.
