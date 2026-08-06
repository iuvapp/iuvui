import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PUBLIC_VERSION = "0.0.1";
const PUBLIC_REGISTRY = "https://registry.npmjs.org/";
const PUBLIC_PACKAGES = [
  "@iuvui/cli",
  "@iuvui/icons",
  "@iuvui/react",
  "@iuvui/styles",
  "@iuvui/tokens",
  "@iuvui/utils",
];
const root = resolve(import.meta.dirname, "..");
const temporaryDirectory = mkdtempSync(
  join(tmpdir(), "iuvui-public-consumer-"),
);
const consumerDirectory = join(temporaryDirectory, "consumer");
const emptyUserConfig = join(temporaryDirectory, "empty-user.npmrc");
const emptyGlobalConfig = join(temporaryDirectory, "empty-global.npmrc");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function digest(content) {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}

function anonymousNpmEnvironment(namespace) {
  const environment = { ...process.env };

  for (const name of Object.keys(environment)) {
    if (
      /^npm_config_/i.test(name) ||
      /^node_auth_token$/i.test(name) ||
      /^(?:npm|pnpm|yarn_npm).*?(?:auth|registry|token)/i.test(name)
    ) {
      delete environment[name];
    }
  }

  delete environment.IUVUI_TEST_REGISTRY_PATH;
  return {
    ...environment,
    COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
    NODE_ENV: "development",
    XDG_CACHE_HOME: join(temporaryDirectory, namespace, "cache"),
    XDG_CONFIG_HOME: join(temporaryDirectory, namespace, "config"),
    XDG_DATA_HOME: join(temporaryDirectory, namespace, "data"),
    XDG_STATE_HOME: join(temporaryDirectory, namespace, "state"),
    npm_config_always_auth: "false",
    npm_config_globalconfig: emptyGlobalConfig,
    npm_config_registry: PUBLIC_REGISTRY,
    npm_config_store_dir: join(temporaryDirectory, namespace, "store"),
    npm_config_userconfig: emptyUserConfig,
  };
}

function run(command, args, { cwd = root, env = process.env } = {}) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", env });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(
      `Command failed (${result.status}): ${command} ${args.join(" ")}\n${output}`,
    );
  }
  return result.stdout;
}

function writeConsumerFiles() {
  writeFileSync(
    join(consumerDirectory, "package.json"),
    formatJson({
      name: "iuvui-public-consumer",
      version: "0.0.0",
      private: true,
      type: "module",
      packageManager: "pnpm@10.14.0",
      dependencies: {
        "@iuvui/cli": PUBLIC_VERSION,
        "@iuvui/icons": PUBLIC_VERSION,
        "@iuvui/react": PUBLIC_VERSION,
        "@iuvui/styles": PUBLIC_VERSION,
        "@iuvui/tokens": PUBLIC_VERSION,
        "@iuvui/utils": PUBLIC_VERSION,
        react: "19.2.8",
        "react-aria-components": "1.20.0",
        "react-dom": "19.2.8",
      },
      devDependencies: {
        "@types/react": "19.2.18",
        "@types/react-dom": "19.2.4",
        typescript: "5.9.3",
      },
    }),
  );
  writeFileSync(
    join(consumerDirectory, "smoke.mjs"),
    `import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SearchIcon } from "@iuvui/icons";
import { Button, Separator } from "@iuvui/react";
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
  ),
);

assert.match(markup, /data-slot="button"/);
assert.match(markup, /data-variant="outline"/);
assert.match(markup, /<title>Search<\\/title>/);
assert.match(markup, /data-slot="separator"/);
assert.match(markup, /data-orientation="vertical"/);
assert.equal(tokenVariable("primary"), "--ui-primary");
assert.equal(cn("rounded", false, "font-medium"), "rounded font-medium");

const styles = readFileSync(
  fileURLToPath(import.meta.resolve("@iuvui/styles")),
  "utf8",
);
assert.match(styles, /components\\/button\\.css/);
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
import { Button, Separator } from "@iuvui/react";
import { tokenVariable } from "@iuvui/tokens";
import { cn } from "@iuvui/utils";
import { Button as OwnedButton } from "../components/iuv-ui/button";
import { Separator as OwnedSeparator } from "../components/iuv-ui/separator";

export function PublicConsumerFixture() {
  return (
    <div className={cn("grid", "gap-4")} data-token={tokenVariable("primary")}>
      <Button startContent={<SearchIcon title="Search" />}>Package Button</Button>
      <Separator />
      <OwnedButton variant="outline">Owned Button</OwnedButton>
      <OwnedSeparator orientation="vertical" />
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

function assertPublicPackages() {
  for (const name of PUBLIC_PACKAGES) {
    const packageDirectory = join(
      consumerDirectory,
      "node_modules",
      ...name.split("/"),
    );
    assert.ok(existsSync(packageDirectory), `${name} is not installed.`);
    const manifest = JSON.parse(
      readFileSync(join(packageDirectory, "package.json"), "utf8"),
    );
    assert.equal(manifest.version, PUBLIC_VERSION);
    assert.equal(manifest.license, "Apache-2.0");
    assert.equal(
      manifest.repository?.url,
      "git+https://github.com/iuv-tech/iuvui.git",
    );
    for (const section of ["dependencies", "peerDependencies"]) {
      for (const value of Object.values(manifest[section] ?? {})) {
        assert.doesNotMatch(value, /^workspace:/);
      }
    }
    assert.equal(manifest.dependencies?.["@iuvui/internal"], undefined);
  }

  const lockfile = readFileSync(
    join(consumerDirectory, "pnpm-lock.yaml"),
    "utf8",
  );
  assert.doesNotMatch(lockfile, /\b(?:file|link):/);
  for (const name of PUBLIC_PACKAGES) {
    assert.ok(
      lockfile.includes(`'${name}@${PUBLIC_VERSION}':`),
      `${name}@${PUBLIC_VERSION} is missing from the public lockfile.`,
    );
  }
}

function assertLockProvenance(lock) {
  assert.equal(lock.lockfileVersion, 1);
  assert.deepEqual(Object.keys(lock.items).sort(), ["button", "separator"]);

  for (const [name, entry] of Object.entries(lock.items)) {
    assert.equal(entry.version, PUBLIC_VERSION);
    assert.equal(entry.source, `https://iuvui.com/r/${name}.json`);
    assert.match(entry.integrity, /^sha256-/);
    assert.equal(
      entry.provenance.canonical.repository,
      "https://github.com/iuv-tech/iuvui",
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
  assert.equal(lock.items.separator.provenance.canonical.kind, "derived");
  assert.equal(
    lock.items.separator.provenance.upstreams[0].relationship,
    "derived",
  );
}

try {
  mkdirSync(consumerDirectory);
  writeFileSync(emptyUserConfig, "");
  writeFileSync(emptyGlobalConfig, "");
  writeConsumerFiles();

  const installEnvironment = anonymousNpmEnvironment("install");
  run(
    pnpm,
    [
      "install",
      "--ignore-scripts",
      "--no-frozen-lockfile",
      `--registry=${PUBLIC_REGISTRY}`,
      `--store-dir=${join(temporaryDirectory, "install", "store")}`,
    ],
    { cwd: consumerDirectory, env: installEnvironment },
  );
  assertPublicPackages();
  console.log(
    `✓ Installed all @iuvui packages at ${PUBLIC_VERSION} anonymously from registry.npmjs.org.`,
  );

  run(process.execPath, [join(consumerDirectory, "smoke.mjs")], {
    cwd: consumerDirectory,
    env: installEnvironment,
  });
  console.log(
    "✓ Imported public package entry points and rendered them on the server.",
  );

  const dlxVersion = run(
    pnpm,
    ["dlx", `@iuvui/cli@${PUBLIC_VERSION}`, "--version"],
    {
      cwd: consumerDirectory,
      env: anonymousNpmEnvironment("dlx"),
    },
  ).trim();
  assert.equal(dlxVersion, PUBLIC_VERSION);
  assert.equal(
    run(pnpm, ["exec", "iuvui", "--version"], {
      cwd: consumerDirectory,
      env: installEnvironment,
    }).trim(),
    PUBLIC_VERSION,
  );
  console.log(`✓ Ran pnpm dlx @iuvui/cli@${PUBLIC_VERSION} anonymously.`);

  run(pnpm, ["exec", "iuvui", "init"], {
    cwd: consumerDirectory,
    env: installEnvironment,
  });
  run(pnpm, ["exec", "iuvui", "add", "button"], {
    cwd: consumerDirectory,
    env: installEnvironment,
  });
  run(pnpm, ["exec", "iuvui", "add", "separator"], {
    cwd: consumerDirectory,
    env: installEnvironment,
  });

  const config = JSON.parse(
    readFileSync(join(consumerDirectory, "iuvui.json"), "utf8"),
  );
  assert.equal(config.sourceDirectory, "components/iuv-ui");
  for (const file of [
    "button.tsx",
    "separator.tsx",
    "types.ts",
    "THIRD_PARTY_NOTICES.md",
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
  console.log(
    "✓ Installed production Registry source and verified its provenance lock.",
  );

  run(pnpm, ["exec", "tsc", "--project", "tsconfig.json"], {
    cwd: consumerDirectory,
    env: installEnvironment,
  });
  console.log("✓ TypeScript compiled both package and owned-source usage.");
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
