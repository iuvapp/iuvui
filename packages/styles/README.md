# @iuvui/styles

Precompiled themes and component styles for iuvui. Applications can consume the
package without configuring Tailwind CSS to scan library source.

```css
@import "@iuvui/styles";
```

Individual entry points are available when a project needs a smaller style set:

```css
@import "@iuvui/styles/theme.css";
@import "@iuvui/styles/components/button.css";
@import "@iuvui/styles/components/separator.css";
```

Override semantic `--ui-*` variables to apply a local brand theme.

See [iuvui.com](https://iuvui.com) for documentation.
