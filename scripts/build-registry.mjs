import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const generatedHeader =
  "// Installed from the iuvui canonical source. This copy belongs to your project.\n";

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(content) {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}

function output(path, content) {
  const target = join(root, path);

  if (check) {
    if (!existsSync(target) || readFileSync(target, "utf8") !== content) {
      throw new Error(`Generated Registry file is stale: ${path}`);
    }
    return;
  }

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function generateButtonSource() {
  const canonicalImport = `import {
  AriaButton,
  AriaLink,
  type AriaButtonRenderProps,
  type AriaLinkRenderProps,
} from "@iuvui/internal";`;
  const registryImport = `import {
  Button as AriaButton,
  Link as AriaLink,
  type ButtonRenderProps as AriaButtonRenderProps,
  type LinkRenderProps as AriaLinkRenderProps,
} from "react-aria-components";`;
  const canonical = read("packages/react/src/button.tsx");

  if (!canonical.includes(canonicalImport)) {
    throw new Error("The canonical Button internal import has changed");
  }

  return `${generatedHeader}import "@iuvui/styles";\n\n${canonical.replace(
    canonicalImport,
    registryImport,
  )}`;
}

const generatedFiles = new Map([
  ["registry/default/button.tsx", generateButtonSource()],
  [
    "registry/default/types.ts",
    `${generatedHeader}${read("packages/react/src/types.ts")}`,
  ],
]);

for (const [path, content] of generatedFiles) output(path, content);

const catalog = JSON.parse(read("registry/registry.json"));

for (const item of catalog.items) {
  const files = item.files.map((file) => {
    const content = generatedFiles.get(file.path);
    if (content === undefined) {
      throw new Error(`No generated content is available for ${file.path}`);
    }
    return { ...file, content };
  });
  const fileIntegrity = Object.fromEntries(
    files.map((file) => [file.path, digest(file.content)]),
  );
  const itemIntegrity = digest(
    files.map((file) => `${file.path}:${fileIntegrity[file.path]}`).join("\n"),
  );
  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    files,
    meta: {
      ...item.meta,
      iuvui: {
        ...item.meta.iuvui,
        integrity: {
          algorithm: "sha256",
          item: itemIntegrity,
          files: fileIntegrity,
        },
      },
    },
  };
  output(`apps/web/public/r/${item.name}.json`, json(registryItem));
}

output("apps/web/public/r/registry.json", json(catalog));
output("apps/web/public/schema/iuvui.json", read("schemas/iuvui.schema.json"));
output(
  "apps/web/public/schema/registry-item.json",
  read("schemas/registry-item.schema.json"),
);

console.log(
  check ? "Registry artifacts are current." : "Registry artifacts built.",
);
