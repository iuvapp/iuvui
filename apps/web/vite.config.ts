import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    fumadocsMdx(),
    paraglideVitePlugin({
      project: "../../project.inlang",
      outdir: "./src/paraglide",
      emitTsDeclarations: true,
      cookieName: "IUVUI_LOCALE",
      strategy: ["cookie", "baseLocale"],
    }),
    ...(mode === "test"
      ? []
      : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
    tanstackStart(),
    react(),
    tailwindcss(),
  ],
}));
