# @iuvui/styles

Precompiled themes and component styles for iuvui. Applications can consume the
package without configuring Tailwind CSS to scan library source.

```css
@import "@iuvui/styles";
```

The published `@iuvui/styles@0.0.1` package includes these entry points:

```css
@import "@iuvui/styles/theme.css";
@import "@iuvui/styles/components/button.css";
@import "@iuvui/styles/components/text-field.css";
@import "@iuvui/styles/components/dialog.css";
@import "@iuvui/styles/components/separator.css";
```

## Workspace package

The canonical workspace also includes Card, Input, Label, and Textarea
styles. Those files are packed and verified locally, but they are not part of
the published `@iuvui/styles@0.0.1` package. Do not copy the following imports
into an npm `0.0.1` installation until a later authorized `0.0.x` release:

```css
@import "@iuvui/styles/components/card.css";
@import "@iuvui/styles/components/input.css";
@import "@iuvui/styles/components/label.css";
@import "@iuvui/styles/components/textarea.css";
```

Override semantic `--ui-*` variables to apply a local brand theme.

See [iuvui.com](https://iuvui.com) for documentation.
