import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    button: "src/button.tsx",
    card: "src/card.tsx",
    "text-field": "src/text-field.tsx",
    dialog: "src/dialog.tsx",
    input: "src/input.tsx",
    label: "src/label.tsx",
    separator: "src/separator.tsx",
    textarea: "src/textarea.tsx",
    "extend-variants": "src/extend-variants.tsx",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  noExternal: ["@iuvui/internal"],
  esbuildOptions(options) {
    options.sourcesContent = false;
  },
});
