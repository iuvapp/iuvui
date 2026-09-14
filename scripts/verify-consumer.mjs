import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const registryDirectory = join(root, "registry", "local", "r");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "iuvui-consumer-"));
const tarballDirectory = join(temporaryDirectory, "tarballs");
const consumerDirectory = join(temporaryDirectory, "consumer");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const publicPackages = ["tokens", "styles", "utils", "icons", "react", "cli"];

function portable(path) {
  return path.split(sep).join("/");
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(content) {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}

function run(command, args, { cwd = root, env } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(
      `Command failed (${result.status}): ${command} ${args.join(" ")}\n${output}`,
    );
  }
  return result.stdout;
}

function packPackage(directory) {
  const packageDirectory = join(root, "packages", directory);
  const manifest = JSON.parse(
    readFileSync(join(packageDirectory, "package.json"), "utf8"),
  );
  const existing = new Set(readdirSync(tarballDirectory));

  run(pnpm, ["pack", "--pack-destination", tarballDirectory], {
    cwd: packageDirectory,
  });

  const created = readdirSync(tarballDirectory).filter(
    (file) => file.endsWith(".tgz") && !existing.has(file),
  );
  assert.equal(
    created.length,
    1,
    `Packing ${manifest.name} must create exactly one tarball.`,
  );

  return {
    name: manifest.name,
    path: join(tarballDirectory, created[0]),
    version: manifest.version,
  };
}

function assertLockProvenance(lock) {
  assert.equal(lock.lockfileVersion, 1);
  assert.deepEqual(Object.keys(lock.items).sort(), [
    "button",
    "card",
    "input",
    "label",
    "separator",
    "textarea",
  ]);

  for (const [name, entry] of Object.entries(lock.items)) {
    assert.match(entry.version, /^0\.0\.\d+$/);
    assert.equal(entry.source, `https://iuvui.com/r/${name}.json`);
    assert.match(entry.integrity, /^sha256-/);
    assert.equal(
      entry.provenance.canonical.repository,
      "https://github.com/iuvapp/iuvui",
    );
    assert.match(
      entry.provenance.canonical.path,
      /^packages\/react\/src\/.+\.tsx$/,
    );
    assert.ok(entry.provenance.upstreams.length > 0);

    for (const upstream of entry.provenance.upstreams) {
      assert.equal(upstream.repository, "https://github.com/shadcn-ui/ui");
      assert.match(upstream.revision, /^[0-9a-f]{40}$/);
      assert.match(upstream.blob, /^[0-9a-f]{40}$/);
      assert.ok(upstream.source.includes(upstream.revision));
      assert.match(upstream.syncedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(upstream.license, "MIT");
      assert.ok(
        ["derived", "architectural-reference"].includes(upstream.relationship),
      );
      assert.ok(upstream.localChanges.length > 0);
    }

    for (const [file, integrity] of Object.entries(entry.files)) {
      assert.match(file, /^components\/iuv-ui\//);
      const content = readFileSync(join(consumerDirectory, file), "utf8");
      assert.equal(integrity, digest(content));
    }
  }

  assert.equal(lock.items.button.provenance.canonical.kind, "independent");
  assert.equal(
    lock.items.button.provenance.upstreams[0].relationship,
    "architectural-reference",
  );
  for (const name of ["card", "input", "label", "separator", "textarea"]) {
    assert.equal(lock.items[name].provenance.canonical.kind, "derived");
    assert.equal(
      lock.items[name].provenance.upstreams[0].relationship,
      "derived",
    );
  }
}

function writeConsumerFiles(packages) {
  const localDependencies = Object.fromEntries(
    packages.map((entry) => [
      entry.name,
      `file:${portable(relative(consumerDirectory, entry.path))}`,
    ]),
  );
  const manifest = {
    name: "iuvui-clean-consumer",
    version: "0.0.0",
    private: true,
    type: "module",
    packageManager: "pnpm@10.14.0",
    dependencies: {
      ...localDependencies,
      react: "19.2.8",
      "react-aria-components": "1.20.0",
      "react-dom": "19.2.8",
    },
    devDependencies: {
      "@types/react": "19.2.18",
      "@types/react-dom": "19.2.4",
      typescript: "5.9.3",
    },
    pnpm: {
      overrides: localDependencies,
    },
  };

  writeFileSync(join(consumerDirectory, "package.json"), formatJson(manifest));
  writeFileSync(
    join(consumerDirectory, "smoke.mjs"),
    `import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SearchIcon } from "@iuvui/icons";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
} from "@iuvui/react";
import { tokenVariable } from "@iuvui/tokens";
import { cn } from "@iuvui/utils";

const markup = renderToStaticMarkup(
  createElement(
    "main",
    null,
    createElement(
      Button,
      {
        startContent: createElement(SearchIcon, { title: "Search" }),
        variant: "outline",
      },
      "Continue",
    ),
    createElement(Separator, {
      "aria-label": "Content boundary",
      orientation: "vertical",
    }),
    createElement(
      Card,
      null,
      createElement(CardHeader, null, createElement(CardTitle, null, "Profile")),
      createElement(
        CardContent,
        null,
        createElement(Label, { htmlFor: "consumer-name" }, "Name"),
        createElement(Input, { id: "consumer-name" }),
        createElement(Textarea, { "aria-label": "Notes" }),
      ),
    ),
  ),
);

assert.match(markup, /data-slot="button"/);
assert.match(markup, /data-variant="outline"/);
assert.match(markup, /<title>Search<\\/title>/);
assert.match(markup, /data-slot="separator"/);
assert.match(markup, /data-orientation="vertical"/);
assert.match(markup, /data-slot="card"/);
assert.match(markup, /data-slot="input"/);
assert.match(markup, /data-slot="label"/);
assert.match(markup, /data-slot="textarea"/);
assert.equal(tokenVariable("primary"), "--ui-primary");
assert.equal(cn("rounded", false, "font-medium"), "rounded font-medium");

const styles = readFileSync(
  fileURLToPath(import.meta.resolve("@iuvui/styles")),
  "utf8",
);
assert.match(styles, /components\\/button\\.css/);
assert.match(styles, /components\\/card\\.css/);
assert.match(styles, /components\\/input\\.css/);
assert.match(styles, /components\\/label\\.css/);
assert.match(styles, /components\\/textarea\\.css/);
for (const stylesheet of ["card.css", "input.css", "label.css", "textarea.css"]) {
  const css = readFileSync(
    fileURLToPath(
      import.meta.resolve(\`@iuvui/styles/components/\${stylesheet}\`),
    ),
    "utf8",
  );
  assert.match(css, /@layer ui-components/);
}
const theme = readFileSync(
  fileURLToPath(import.meta.resolve("@iuvui/tokens/theme.css")),
  "utf8",
);
assert.match(theme, /--ui-primary/);
`,
  );
  mkdirSync(join(consumerDirectory, "src"));
  writeFileSync(
    join(consumerDirectory, "src", "typecheck.tsx"),
    `import { SearchIcon } from "@iuvui/icons";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Textarea,
} from "@iuvui/react";
import { tokenVariable } from "@iuvui/tokens";
import { cn } from "@iuvui/utils";
import { Button as OwnedButton } from "../components/iuv-ui/button";
import {
  Card as OwnedCard,
  CardContent as OwnedCardContent,
  CardHeader as OwnedCardHeader,
  CardTitle as OwnedCardTitle,
} from "../components/iuv-ui/card";
import { Input as OwnedInput } from "../components/iuv-ui/input";
import { Label as OwnedLabel } from "../components/iuv-ui/label";
import { Separator as OwnedSeparator } from "../components/iuv-ui/separator";
import { Textarea as OwnedTextarea } from "../components/iuv-ui/textarea";

export function ConsumerFixture() {
  return (
    <div className={cn("grid", "gap-4")} data-token={tokenVariable("primary")}>
      <Button startContent={<SearchIcon title="Search" />}>Package Button</Button>
      <Separator />
      <Card>
        <CardHeader><CardTitle>Package card</CardTitle></CardHeader>
        <CardContent>
          <Label htmlFor="package-name">Name</Label>
          <Input id="package-name" />
          <Textarea aria-label="Package notes" />
        </CardContent>
      </Card>
      <OwnedButton variant="outline">Owned Button</OwnedButton>
      <OwnedSeparator orientation="vertical" />
      <OwnedCard>
        <OwnedCardHeader><OwnedCardTitle>Owned card</OwnedCardTitle></OwnedCardHeader>
        <OwnedCardContent>
          <OwnedLabel htmlFor="owned-name">Name</OwnedLabel>
          <OwnedInput id="owned-name" />
          <OwnedTextarea aria-label="Owned notes" />
        </OwnedCardContent>
      </OwnedCard>
    </div>
  );
}
`,
  );
  writeFileSync(
    join(consumerDirectory, "tsconfig.json"),
    formatJson({
      compilerOptions: {
        esModuleInterop: true,
        jsx: "react-jsx",
        lib: ["DOM", "ES2022"],
        module: "ESNext",
        moduleResolution: "Bundler",
        noEmit: true,
        skipLibCheck: true,
        strict: true,
        target: "ES2022",
        types: ["react", "react-dom"],
      },
      include: ["components/**/*.tsx", "src/**/*.tsx"],
    }),
  );
}

try {
  mkdirSync(tarballDirectory);
  mkdirSync(consumerDirectory);

  run(process.execPath, [
    join(root, "scripts", "build-registry.mjs"),
    "--check",
  ]);
  const packages = publicPackages.map(packPackage);
  writeConsumerFiles(packages);
  console.log(
    `✓ Packed ${packages.length} public packages into an isolated fixture.`,
  );

  run(
    pnpm,
    ["install", "--ignore-scripts", "--no-frozen-lockfile", "--prefer-offline"],
    { cwd: consumerDirectory },
  );
  for (const entry of packages) {
    assert.ok(
      existsSync(
        join(consumerDirectory, "node_modules", ...entry.name.split("/")),
      ),
      `${entry.name} was not installed from its tarball.`,
    );
  }
  console.log("✓ Installed the tarballs in an independent pnpm consumer.");

  run(process.execPath, [join(consumerDirectory, "smoke.mjs")], {
    cwd: consumerDirectory,
  });
  const cli = packages.find((entry) => entry.name === "@iuvui/cli");
  assert.ok(cli);
  assert.equal(
    run(pnpm, ["exec", "iuvui", "--version"], {
      cwd: consumerDirectory,
    }).trim(),
    cli.version,
  );
  console.log(
    "✓ Imported package entry points and server-rendered React components.",
  );

  const cliEnvironment = {
    IUVUI_TEST_REGISTRY_PATH: registryDirectory,
    NODE_ENV: "test",
  };
  run(pnpm, ["exec", "iuvui", "init"], {
    cwd: consumerDirectory,
    env: cliEnvironment,
  });
  run(pnpm, ["exec", "iuvui", "add", "button"], {
    cwd: consumerDirectory,
    env: cliEnvironment,
  });
  run(pnpm, ["exec", "iuvui", "add", "separator"], {
    cwd: consumerDirectory,
    env: cliEnvironment,
  });
  run(pnpm, ["exec", "iuvui", "add", "card", "input", "label", "textarea"], {
    cwd: consumerDirectory,
    env: cliEnvironment,
  });

  const config = JSON.parse(
    readFileSync(join(consumerDirectory, "iuvui.json"), "utf8"),
  );
  assert.equal(config.sourceDirectory, "components/iuv-ui");
  for (const file of [
    "button.tsx",
    "card.tsx",
    "input.tsx",
    "label.tsx",
    "separator.tsx",
    "textarea.tsx",
    "types.ts",
    "card.third-party-notices.md",
    "input.third-party-notices.md",
    "label.third-party-notices.md",
    "separator.third-party-notices.md",
    "textarea.third-party-notices.md",
  ]) {
    assert.ok(
      existsSync(join(consumerDirectory, "components", "iuv-ui", file)),
      `${file} was not installed into components/iuv-ui.`,
    );
  }
  const buttonSource = readFileSync(
    join(consumerDirectory, "components", "iuv-ui", "button.tsx"),
    "utf8",
  );
  assert.match(buttonSource, /from "react-aria-components"/);
  assert.doesNotMatch(buttonSource, /@iuvui\/internal/);
  assertLockProvenance(
    JSON.parse(readFileSync(join(consumerDirectory, "iuvui.lock"), "utf8")),
  );
  console.log("✓ Installed owned source and verified its provenance lock.");

  run(pnpm, ["exec", "tsc", "--project", "tsconfig.json"], {
    cwd: consumerDirectory,
  });
  console.log("✓ TypeScript compiled both package and owned-source usage.");
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
