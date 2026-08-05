import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    paraglideVitePlugin({
      project: "../../project.inlang",
      outdir: "./src/paraglide",
      emitTsDeclarations: true,
      strategy: ["localStorage", "baseLocale"],
    }),
    react(),
    tailwindcss(),
    ...(mode === "test" ? [] : [cloudflare()]),
  ],
}));
