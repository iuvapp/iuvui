# @iuvui/styles

Precompiled themes and component styles for iuvui. Applications can consume the
package without configuring Tailwind CSS to scan library source.

> This workspace snapshot includes unreleased foundation styles. npm package
> versions are immutable, so these local `0.0.1` artifacts must not be confused
> with the already published `@iuvui/styles@0.0.1` release.

```css
@import "@iuvui/styles";
```

Individual entry points are available when a project needs a smaller style set:

```css
@import "@iuvui/styles/theme.css";
@import "@iuvui/styles/components/button.css";
@import "@iuvui/styles/components/text-field.css";
@import "@iuvui/styles/components/dialog.css";
@import "@iuvui/styles/components/separator.css";
```

The following entry points are local workspace previews. They are not included
in the published `@iuvui/styles@0.0.1` package:

```css
@import "@iuvui/styles/components/card.css";
@import "@iuvui/styles/components/input.css";
@import "@iuvui/styles/components/label.css";
@import "@iuvui/styles/components/textarea.css";
```

Override semantic `--ui-*` variables to apply a local brand theme.

See [iuvui.com](https://iuvui.com) for documentation.
