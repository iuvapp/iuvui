import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const generatedHeader =
  "// Installed from the iuvui canonical source. This copy belongs to your project.\n";
const generatedMarkdownHeader =
  "<!-- Installed from the iuvui canonical source. This copy belongs to your project. -->\n";
const shadcnMitLicense = `MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

async function json(value) {
  return format(JSON.stringify(value), { parser: "json" });
}

async function markdown(value) {
  return format(value, { parser: "markdown" });
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

function remove(path) {
  const target = join(root, path);

  if (check) {
    if (existsSync(target)) {
      throw new Error(`Unreleased Registry file must not be public: ${path}`);
    }
    return;
  }

  if (existsSync(target)) unlinkSync(target);
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

function generateSeparatorSource() {
  const canonicalImport = `import { AriaSeparator } from "@iuvui/internal";`;
  const registryImport = `import { Separator as AriaSeparator } from "react-aria-components";`;
  const canonical = read("packages/react/src/separator.tsx");

  if (!canonical.includes(canonicalImport)) {
    throw new Error("The canonical Separator internal import has changed");
  }

  return `${generatedHeader}import "@iuvui/styles";\n\n${canonical.replace(
    canonicalImport,
    registryImport,
  )}`;
}

function generateFoundationSource(name) {
  return `${generatedHeader}import "@iuvui/styles";

${read(`packages/react/src/${name}.tsx`)}`;
}

function generateShadcnNotice({ component, revision, source }) {
  return `${generatedMarkdownHeader}# Third-Party Notice

## shadcn/ui ${component}

This installed source is derived from the shadcn/ui ${component} implementation.

- Repository: https://github.com/shadcn-ui/ui
- Revision: ${revision}
- Source: ${source}
- License: MIT

${shadcnMitLicense}`;
}

const generatedFiles = new Map([
  ["registry/default/button.tsx", generateButtonSource()],
  ["registry/default/card.tsx", generateFoundationSource("card")],
  [
    "registry/default/card.third-party-notices.md",
    await markdown(
      generateShadcnNotice({
        component: "Card",
        revision: "25be24cca34d06eed29a4779c3f48c4816aa812c",
        source: "apps/v4/registry/new-york-v4/ui/card.tsx",
      }),
    ),
  ],
  ["registry/default/input.tsx", generateFoundationSource("input")],
  [
    "registry/default/input.third-party-notices.md",
    await markdown(
      generateShadcnNotice({
        component: "Input",
        revision: "25be24cca34d06eed29a4779c3f48c4816aa812c",
        source: "apps/v4/registry/new-york-v4/ui/input.tsx",
      }),
    ),
  ],
  ["registry/default/label.tsx", generateFoundationSource("label")],
  [
    "registry/default/label.third-party-notices.md",
    await markdown(
      generateShadcnNotice({
        component: "Label",
        revision: "25be24cca34d06eed29a4779c3f48c4816aa812c",
        source: "apps/v4/registry/new-york-v4/ui/label.tsx",
      }),
    ),
  ],
  ["registry/default/separator.tsx", generateSeparatorSource()],
  [
    "registry/default/separator.third-party-notices.md",
    await markdown(
      generateShadcnNotice({
        component: "Separator",
        revision: "607e8a9717fe6ff0d374ba74c651012f9c052534",
        source: "apps/v4/registry/bases/aria/ui/separator.tsx",
      }),
    ),
  ],
  ["registry/default/textarea.tsx", generateFoundationSource("textarea")],
  [
    "registry/default/textarea.third-party-notices.md",
    await markdown(
      generateShadcnNotice({
        component: "Textarea",
        revision: "25be24cca34d06eed29a4779c3f48c4816aa812c",
        source: "apps/v4/registry/new-york-v4/ui/textarea.tsx",
      }),
    ),
  ],
  [
    "registry/default/types.ts",
    `${generatedHeader}${read("packages/react/src/types.ts")}`,
  ],
]);

for (const [path, content] of generatedFiles) output(path, content);

const catalog = JSON.parse(read("registry/registry.json"));
const publishedItems = [];
const generatedItems = [];

for (const item of catalog.items) {
  const releaseStatus = item.meta?.iuvui?.releaseStatus;
  if (!["published", "workspace-preview"].includes(releaseStatus)) {
    throw new Error(
      `Registry item ${item.name} has an invalid release status: ${String(releaseStatus)}`,
    );
  }

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
  generatedItems.push({ item, content: await json(registryItem) });

  if (releaseStatus === "published") publishedItems.push(item);
}

for (const { item, content } of generatedItems) {
  output(`registry/local/r/${item.name}.json`, content);
}

for (const { item, content } of generatedItems) {
  if (item.meta.iuvui.releaseStatus === "published") {
    output(`apps/web/public/r/${item.name}.json`, content);
  } else {
    remove(`apps/web/public/r/${item.name}.json`);
  }
}

const publicCatalog = { ...catalog, items: publishedItems };

output("registry/local/r/registry.json", await json(catalog));
output("apps/web/public/r/registry.json", await json(publicCatalog));
output("apps/web/public/schema/iuvui.json", read("schemas/iuvui.schema.json"));
output(
  "apps/web/public/schema/registry-item.json",
  read("schemas/registry-item.schema.json"),
);

console.log(
  check ? "Registry artifacts are current." : "Registry artifacts built.",
);
