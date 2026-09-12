# @iuvui/styles

Precompiled themes and component styles for iuvui. Applications can consume the
package without configuring Tailwind CSS to scan library source.

The canonical stylesheet now includes Button, Card, Dialog, Input, Label,
Separator, Text Field, and Textarea. The last public npm release remains
`@iuvui/styles@0.0.1` and does not include Card, Input, Label, or Textarea
until a later authorized `0.0.x` publication.

```css
@import "@iuvui/styles";
```

Individual entry points are available when a project needs a smaller style set:

```css
@import "@iuvui/styles/theme.css";
@import "@iuvui/styles/components/button.css";
@import "@iuvui/styles/components/card.css";
@import "@iuvui/styles/components/text-field.css";
@import "@iuvui/styles/components/dialog.css";
@import "@iuvui/styles/components/input.css";
@import "@iuvui/styles/components/label.css";
@import "@iuvui/styles/components/separator.css";
@import "@iuvui/styles/components/textarea.css";
```

Override semantic `--ui-*` variables to apply a local brand theme.

See [iuvui.com](https://iuvui.com) for documentation.
