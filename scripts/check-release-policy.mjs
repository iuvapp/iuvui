import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const policy = readJson("release-policy.json");
const allowedVersion = new RegExp(policy.allowedVersionPattern);
const allowedBumps = new Set(policy.allowedChangesetBumps);
const errors = [];

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

function visitPackageManifests(directory) {
  if (!existsSync(join(root, directory))) return;

  for (const entry of readdirSync(join(root, directory), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name, "package.json");
    if (!existsSync(join(root, path))) continue;
    const manifest = readJson(path);
    if (
      manifest.private !== true &&
      manifest.name?.startsWith("@iuvui/") &&
      !allowedVersion.test(manifest.version)
    ) {
      errors.push(`${path} uses disallowed version ${manifest.version}.`);
    }
  }
}

function checkChangesets() {
  const directory = join(root, ".changeset");
  if (!existsSync(directory)) return;

  for (const entry of readdirSync(directory)) {
    if (!entry.endsWith(".md") || entry === "README.md") continue;
    const content = read(join(".changeset", entry));
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) {
      errors.push(`.changeset/${entry} has invalid frontmatter.`);
      continue;
    }

    for (const line of frontmatter[1]
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean)) {
      const match = line.match(
        /^["']?(@iuvui\/[a-z0-9-]+)["']?:\s*(patch|minor|major)$/,
      );
      if (!match) {
        errors.push(`.changeset/${entry} contains an invalid release entry.`);
        continue;
      }
      if (!allowedBumps.has(match[2])) {
        errors.push(
          `.changeset/${entry} requests disallowed ${match[2]} release for ${match[1]}.`,
        );
      }
    }
  }
}

function checkRegistry() {
  const catalog = readJson("registry/registry.json");
  for (const item of catalog.items ?? []) {
    const version = item.meta?.iuvui?.version;
    if (!allowedVersion.test(version)) {
      errors.push(
        `Registry item ${item.name} uses disallowed version ${String(version)}.`,
      );
    }
  }
}

visitPackageManifests("packages");
checkChangesets();
checkRegistry();

if (errors.length > 0) {
  for (const error of errors) console.error(`Release policy: ${error}`);
  process.exit(1);
}

console.log("Release policy is satisfied: public versions remain in 0.0.x.");
