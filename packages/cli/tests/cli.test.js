import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { digest, validateRegistryItem } from "../src/registry.js";

const cli = fileURLToPath(new URL("../bin/iuvui.js", import.meta.url));
const registry = fileURLToPath(
  new URL("../../../apps/web/public/r", import.meta.url),
);

function createProject() {
  const cwd = mkdtempSync(join(tmpdir(), "iuvui-cli-"));
  writeFileSync(
    join(cwd, "package.json"),
    `${JSON.stringify({ name: "fixture", packageManager: "pnpm@10.14.0" }, null, 2)}\n`,
  );
  return cwd;
}

function run(cwd, ...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NODE_ENV: "test",
      IUVUI_TEST_REGISTRY_PATH: registry,
    },
  });
}

test("prints help", () => {
  const result = run(process.cwd(), "--help");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /add <component/);
});

test("prints version", () => {
  const result = run(process.cwd(), "--version");

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "0.0.0\n");
});

test("reports environment information", () => {
  const result = run(process.cwd(), "doctor");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /iuvui: 0\.0\.0/);
  assert.match(result.stdout, /node:/);
  assert.match(result.stdout, /platform:/);
});

test("initializes the default source directory idempotently", () => {
  const cwd = createProject();
  try {
    const first = run(cwd, "init");
    const second = run(cwd, "init");

    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);
    const config = JSON.parse(readFileSync(join(cwd, "iuvui.json"), "utf8"));
    assert.equal(config.sourceDirectory, "components/iuv-ui");
    assert.match(second.stdout, /already initialized/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("supports a safe custom source directory", () => {
  const cwd = createProject();
  try {
    const result = run(cwd, "init", "--source-dir", "src/iuv-ui");

    assert.equal(result.status, 0, result.stderr);
    const config = JSON.parse(readFileSync(join(cwd, "iuvui.json"), "utf8"));
    assert.equal(config.sourceDirectory, "src/iuv-ui");
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("rejects source directories outside the project", () => {
  const cwd = createProject();
  try {
    const result = run(cwd, "init", "--source-dir", "../components");

    assert.equal(result.status, 1);
    assert.match(result.stderr, /inside the project directory/);
    assert.throws(() => readFileSync(join(cwd, "iuvui.json")));
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("rejects platform-specific absolute source directories", () => {
  const cwd = createProject();
  try {
    const result = run(cwd, "init", "--source-dir", "C:\\components\\ui");

    assert.equal(result.status, 1);
    assert.match(result.stderr, /relative path/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("requires initialization before adding source", () => {
  const cwd = createProject();
  try {
    const result = run(cwd, "add", "button");

    assert.equal(result.status, 1);
    assert.match(result.stderr, /iuvui init/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("installs Button source and a verified lock entry", () => {
  const cwd = createProject();
  try {
    assert.equal(run(cwd, "init").status, 0);
    const result = run(cwd, "add", "button");

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /components\/iuv-ui\/button\.tsx/);
    assert.match(result.stdout, /pnpm add/);

    const buttonPath = join(cwd, "components/iuv-ui/button.tsx");
    const typesPath = join(cwd, "components/iuv-ui/types.ts");
    const button = readFileSync(buttonPath, "utf8");
    const lock = JSON.parse(readFileSync(join(cwd, "iuvui.lock"), "utf8"));
    assert.match(button, /This copy belongs to your project/);
    assert.match(button, /from "react-aria-components"/);
    assert.doesNotMatch(button, /@iuvui\/internal/);
    assert.equal(
      lock.items.button.files["components/iuv-ui/button.tsx"],
      digest(button),
    );
    assert.equal(
      lock.items.button.files["components/iuv-ui/types.ts"],
      digest(readFileSync(typesPath, "utf8")),
    );
    assert.equal(lock.items.button.provenance.canonical.kind, "independent");
    assert.equal(
      lock.items.button.provenance.upstreams[0].name,
      "shadcn/ui Button",
    );
    assert.match(
      lock.items.button.provenance.upstreams[0].revision,
      /^[0-9a-f]{40}$/,
    );
    assert.match(
      lock.items.button.provenance.upstreams[0].blob,
      /^[0-9a-f]{40}$/,
    );
    assert.match(
      lock.items.button.provenance.upstreams[0].source,
      new RegExp(lock.items.button.provenance.upstreams[0].revision),
    );

    const second = run(cwd, "add", "button");
    assert.equal(second.status, 0, second.stderr);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("installs Separator source with its license and upstream identity", () => {
  const cwd = createProject();
  try {
    assert.equal(run(cwd, "init").status, 0);
    const result = run(cwd, "add", "separator");

    assert.equal(result.status, 0, result.stderr);
    const sourcePath = join(cwd, "components/iuv-ui/separator.tsx");
    const noticePath = join(cwd, "components/iuv-ui/THIRD_PARTY_NOTICES.md");
    const source = readFileSync(sourcePath, "utf8");
    const notice = readFileSync(noticePath, "utf8");
    const lock = JSON.parse(readFileSync(join(cwd, "iuvui.lock"), "utf8"));

    assert.match(source, /Separator as AriaSeparator/);
    assert.match(notice, /MIT License/);
    assert.equal(lock.items.separator.provenance.canonical.kind, "derived");
    assert.equal(lock.items.separator.provenance.upstreams[0].base, "aria");
    assert.equal(
      lock.items.separator.provenance.upstreams[0].blob,
      "bc94e33d44e85b613eaccb9ffae7e2b9d0d45f72",
    );
    assert.equal(
      lock.items.separator.files["components/iuv-ui/separator.tsx"],
      digest(source),
    );
    assert.equal(
      lock.items.separator.files["components/iuv-ui/THIRD_PARTY_NOTICES.md"],
      digest(notice),
    );
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("refuses to overwrite consumer changes", () => {
  const cwd = createProject();
  try {
    assert.equal(run(cwd, "init").status, 0);
    assert.equal(run(cwd, "add", "button").status, 0);
    const buttonPath = join(cwd, "components/iuv-ui/button.tsx");
    writeFileSync(
      buttonPath,
      `${readFileSync(buttonPath, "utf8")}\n// Consumer change.\n`,
    );

    const result = run(cwd, "add", "button");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Refusing to overwrite modified file/);
    assert.match(readFileSync(buttonPath, "utf8"), /Consumer change/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("detects Registry content tampering", () => {
  const item = JSON.parse(
    readFileSync(resolve(registry, "button.json"), "utf8"),
  );
  item.files[0].content += "\n";

  assert.throws(
    () => validateRegistryItem(item, "button"),
    /Integrity check failed/,
  );
});
