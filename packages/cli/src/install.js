import { existsSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";

import {
  assertNoSymlinkParents,
  atomicWrite,
  formatJson,
  readConfig,
} from "./config.js";
import { digest, fetchRegistryItem } from "./registry.js";

const LOCK_FILE = "iuvui.lock";

function readLock(projectRoot) {
  const path = join(projectRoot, LOCK_FILE);
  if (!existsSync(path)) return { lockfileVersion: 1, items: {} };

  try {
    const value = JSON.parse(readFileSync(path, "utf8"));
    if (
      value?.lockfileVersion !== 1 ||
      !value.items ||
      typeof value.items !== "object" ||
      Array.isArray(value.items)
    ) {
      throw new Error();
    }
    return value;
  } catch {
    throw new Error("iuvui.lock is invalid and was not modified.");
  }
}

function packageManager(projectRoot) {
  try {
    const manifest = JSON.parse(
      readFileSync(join(projectRoot, "package.json"), "utf8"),
    );
    const name = manifest.packageManager?.split("@")[0];
    if (["npm", "pnpm", "yarn", "bun"].includes(name)) return name;
  } catch {
    return "npm";
  }
  return "npm";
}

function installCommand(manager, dependencies) {
  if (manager === "npm") return `npm install ${dependencies.join(" ")}`;
  if (manager === "yarn") return `yarn add ${dependencies.join(" ")}`;
  if (manager === "bun") return `bun add ${dependencies.join(" ")}`;
  return `pnpm add ${dependencies.join(" ")}`;
}

function portable(path) {
  return path.split(sep).join("/");
}

export async function installComponents(projectRoot, names) {
  const config = readConfig(projectRoot);
  const sourceRoot = resolve(projectRoot, config.sourceDirectory);
  assertNoSymlinkParents(projectRoot, sourceRoot);
  const lock = readLock(projectRoot);
  const registryItems = [];

  for (const name of names) {
    registryItems.push(await fetchRegistryItem(name));
  }

  const planned = [];
  for (const item of registryItems) {
    for (const file of item.files) {
      if (basename(file.target) !== file.target) {
        throw new Error(`Registry target is unsafe: ${file.target}`);
      }
      const target = resolve(sourceRoot, file.target);
      assertNoSymlinkParents(projectRoot, target);
      const targetRelative = relative(projectRoot, target);
      if (targetRelative.startsWith("..") || targetRelative === "") {
        throw new Error("Registry target escapes the project directory.");
      }
      if (existsSync(target)) {
        const existing = readFileSync(target, "utf8");
        if (existing !== file.content) {
          throw new Error(
            `Refusing to overwrite modified file: ${portable(targetRelative)}`,
          );
        }
      }
      planned.push({ item, file, target, targetRelative });
    }
  }

  for (const entry of planned) {
    if (!existsSync(entry.target))
      atomicWrite(entry.target, entry.file.content);
  }

  for (const item of registryItems) {
    const files = Object.fromEntries(
      planned
        .filter((entry) => entry.item.name === item.name)
        .map((entry) => [
          portable(entry.targetRelative),
          digest(entry.file.content),
        ]),
    );
    lock.items[item.name] = {
      version: item.meta.iuvui.version,
      source: `https://iuvui.com/r/${item.name}.json`,
      integrity: item.meta.iuvui.integrity.item,
      files,
    };
  }
  atomicWrite(join(projectRoot, LOCK_FILE), formatJson(lock));

  const dependencies = [
    ...new Set(registryItems.flatMap((item) => item.dependencies)),
  ];
  return {
    dependencies,
    installCommand: installCommand(packageManager(projectRoot), dependencies),
    files: planned.map((entry) => portable(entry.targetRelative)),
  };
}
