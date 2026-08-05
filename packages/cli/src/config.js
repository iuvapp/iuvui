import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import {
  dirname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve,
} from "node:path";

export const CONFIG_FILE = "iuvui.json";
export const CONFIG_SCHEMA = "https://iuvui.com/schema/iuvui.json";
export const DEFAULT_SOURCE_DIRECTORY = "components/iuv-ui";

export function defaultConfig(sourceDirectory = DEFAULT_SOURCE_DIRECTORY) {
  return {
    $schema: CONFIG_SCHEMA,
    version: 1,
    sourceDirectory,
    style: "default",
  };
}

export function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function atomicWrite(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, content, { flag: "wx" });
  renameSync(temporary, path);
}

export function assertSafeRelativeDirectory(projectRoot, value) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.includes("\0") ||
    value.includes("\\") ||
    /^[A-Za-z]:[\\/]/.test(value) ||
    isAbsolute(value)
  ) {
    throw new Error("sourceDirectory must be a non-empty relative path.");
  }

  const normalized = normalize(value);
  if (
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`)
  ) {
    throw new Error("sourceDirectory must stay inside the project directory.");
  }

  const target = resolve(projectRoot, normalized);
  const resolvedRelative = relative(projectRoot, target);
  if (
    resolvedRelative === "" ||
    isAbsolute(resolvedRelative) ||
    resolvedRelative === ".." ||
    resolvedRelative.startsWith(
      `..${process.platform === "win32" ? "\\" : "/"}`,
    )
  ) {
    throw new Error("sourceDirectory must stay inside the project directory.");
  }

  assertNoSymlinkParents(projectRoot, target);
  return normalized;
}

export function assertNoSymlinkParents(projectRoot, target) {
  const parts = relative(projectRoot, target).split(/[\\/]/).filter(Boolean);
  let current = projectRoot;

  for (const part of parts) {
    current = join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
      throw new Error(`Refusing to write through symbolic link: ${current}`);
    }
  }
}

export function validateConfig(projectRoot, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("iuvui.json must contain a JSON object.");
  }

  const allowed = new Set(["$schema", "version", "sourceDirectory", "style"]);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    throw new Error(`Unknown iuvui.json field: ${unknown.join(", ")}`);
  }
  if (value.$schema !== CONFIG_SCHEMA) {
    throw new Error(`iuvui.json must use schema ${CONFIG_SCHEMA}.`);
  }
  if (value.version !== 1) {
    throw new Error("Unsupported iuvui.json version.");
  }
  if (value.style !== "default") {
    throw new Error('The V0 CLI only supports style "default".');
  }

  const sourceDirectory = assertSafeRelativeDirectory(
    projectRoot,
    value.sourceDirectory,
  );
  return { ...value, sourceDirectory };
}

export function readConfig(projectRoot) {
  const path = join(projectRoot, CONFIG_FILE);
  if (!existsSync(path)) {
    throw new Error("Run `iuvui init` before adding components.");
  }

  let value;
  try {
    value = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error("iuvui.json is not valid JSON.");
  }
  return validateConfig(projectRoot, value);
}

export function initializeProject(projectRoot, sourceDirectory) {
  if (!existsSync(join(projectRoot, "package.json"))) {
    throw new Error("Run `iuvui init` from a JavaScript project directory.");
  }

  const requested = defaultConfig(sourceDirectory);
  const configPath = join(projectRoot, CONFIG_FILE);
  let created = false;
  let config;

  if (existsSync(configPath)) {
    config = readConfig(projectRoot);
    if (sourceDirectory && config.sourceDirectory !== sourceDirectory) {
      throw new Error(
        `iuvui.json already uses sourceDirectory "${config.sourceDirectory}".`,
      );
    }
  } else {
    config = validateConfig(projectRoot, requested);
    atomicWrite(configPath, formatJson(config));
    created = true;
  }

  const target = resolve(projectRoot, config.sourceDirectory);
  assertNoSymlinkParents(projectRoot, target);
  mkdirSync(target, { recursive: true });
  return { config, created };
}
