import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const packages = ["tokens", "styles", "utils", "icons", "react", "cli"];
const forbidden = [
  /(^|\/)src\//,
  /(^|\/)tests?\//,
  /storybook/i,
  /@iuvui\/internal/,
];
const temp = mkdtempSync(join(tmpdir(), "iuvui-pack-"));

try {
  for (const name of packages) {
    const cwd = join(root, "packages", name);
    const packed = spawnSync("pnpm", ["pack", "--pack-destination", temp], {
      cwd,
      encoding: "utf8",
    });
    if (packed.status !== 0)
      throw new Error(`Failed to pack ${name}:\n${packed.stderr}`);
    const tarball = packed.stdout.trim().split("\n").at(-1);
    const tarballPath = tarball.startsWith("/") ? tarball : join(temp, tarball);
    const listing = spawnSync("tar", ["-tzf", tarballPath], {
      encoding: "utf8",
    });
    if (listing.status !== 0) throw new Error(`Failed to inspect ${tarball}`);
    const files = listing.stdout.trim().split("\n");
    const packageForbidden =
      name === "cli" ? forbidden.filter((_, index) => index !== 0) : forbidden;
    const leaked = files.filter((file) =>
      packageForbidden.some((pattern) => pattern.test(file)),
    );
    if (leaked.length)
      throw new Error(`${name} leaks unpublished files:\n${leaked.join("\n")}`);

    const packedManifest = spawnSync(
      "tar",
      ["-xOf", tarballPath, "package/package.json"],
      { encoding: "utf8" },
    );
    if (packedManifest.status !== 0)
      throw new Error(`Failed to read the packed manifest for ${name}`);
    const manifest = JSON.parse(packedManifest.stdout);
    if (manifest.private) throw new Error(`${name} is unexpectedly private`);
    if (manifest.license !== "Apache-2.0")
      throw new Error(`${name} must declare the Apache-2.0 license`);
    if (!files.includes("package/LICENSE"))
      throw new Error(`${name} package is missing LICENSE`);
    if (!files.includes("package/README.md"))
      throw new Error(`${name} package is missing README.md`);
    if (
      manifest.repository?.url !== "git+https://github.com/iuv-tech/iuvui.git"
    )
      throw new Error(`${name} has invalid repository metadata`);
    if (manifest.dependencies?.["@iuvui/internal"])
      throw new Error(`${name} exposes the private @iuvui/internal package`);
    if (name === "cli" && !files.includes("package/bin/iuvui.js")) {
      throw new Error("cli package is missing bin/iuvui.js");
    }
    if (
      !["styles", "cli"].includes(name) &&
      !files.some((file) => file.endsWith("dist/index.js"))
    ) {
      throw new Error(`${name} package is missing dist/index.js`);
    }
    console.log(`✓ @iuvui/${name}: ${files.length} files`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
