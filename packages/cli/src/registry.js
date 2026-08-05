import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const DEFAULT_REGISTRY_URL = "https://iuvui.com/r";
const MAX_REGISTRY_BYTES = 1_000_000;
const COMPONENT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMMIT_REVISION = /^[0-9a-f]{40}$/;
const SYNC_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function digest(content) {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}

export function validateComponentName(name) {
  if (!COMPONENT_NAME.test(name)) {
    throw new Error(`Invalid component name: ${name}`);
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validateProvenance(metadata) {
  const provenance = metadata.provenance;
  if (
    !provenance ||
    !["independent", "derived"].includes(provenance.kind) ||
    !isHttpsUrl(provenance.repository) ||
    typeof provenance.path !== "string" ||
    provenance.path.length === 0
  ) {
    throw new Error("Registry item contains invalid canonical provenance.");
  }

  const references = metadata.references;
  if (!Array.isArray(references)) {
    throw new Error("Registry item is missing upstream references.");
  }

  for (const reference of references) {
    if (
      !reference ||
      typeof reference.name !== "string" ||
      typeof reference.component !== "string" ||
      !isHttpsUrl(reference.repository) ||
      !COMMIT_REVISION.test(reference.revision) ||
      !COMMIT_REVISION.test(reference.blob) ||
      !isHttpsUrl(reference.source) ||
      !reference.source.includes(reference.revision) ||
      typeof reference.path !== "string" ||
      reference.path.length === 0 ||
      reference.path.startsWith("/") ||
      reference.path.split("/").includes("..") ||
      !SYNC_DATE.test(reference.syncedAt) ||
      typeof reference.license !== "string" ||
      !["derived", "architectural-reference"].includes(
        reference.relationship,
      ) ||
      !Array.isArray(reference.localChanges) ||
      reference.localChanges.length === 0 ||
      reference.localChanges.some(
        (change) => typeof change !== "string" || change.length === 0,
      ) ||
      (reference.registry !== undefined && !isHttpsUrl(reference.registry))
    ) {
      throw new Error("Registry item contains invalid upstream provenance.");
    }
  }

  if (
    provenance.kind === "derived" &&
    !references.some((reference) => reference.relationship === "derived")
  ) {
    throw new Error("Derived Registry items must identify a derived upstream.");
  }
}

export function validateRegistryItem(item, expectedName) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new Error("Registry item must be a JSON object.");
  }
  if (item.name !== expectedName || item.type !== "registry:ui") {
    throw new Error(`Registry returned an invalid item for ${expectedName}.`);
  }
  if (!Array.isArray(item.dependencies) || !Array.isArray(item.files)) {
    throw new Error("Registry item dependencies and files must be arrays.");
  }
  if (
    item.meta?.iuvui?.schemaVersion !== 1 ||
    item.meta?.iuvui?.availability !== "free" ||
    item.meta?.iuvui?.style !== "default"
  ) {
    throw new Error("Registry item uses an unsupported iuvui schema.");
  }

  validateProvenance(item.meta.iuvui);

  const integrity = item.meta?.iuvui?.integrity;
  if (!integrity || integrity.algorithm !== "sha256") {
    throw new Error("Registry item is missing SHA-256 integrity metadata.");
  }

  const targets = new Set();
  for (const file of item.files) {
    if (
      !file ||
      typeof file.path !== "string" ||
      typeof file.target !== "string" ||
      typeof file.content !== "string" ||
      !["registry:ui", "registry:lib", "registry:file"].includes(file.type)
    ) {
      throw new Error("Registry item contains an invalid file.");
    }
    if (
      file.target.length === 0 ||
      file.target.includes("/") ||
      file.target.includes("\\") ||
      file.target === "." ||
      file.target === ".."
    ) {
      throw new Error("Registry item contains an unsafe target filename.");
    }
    if (targets.has(file.target)) {
      throw new Error(`Registry item repeats target ${file.target}.`);
    }
    targets.add(file.target);

    const expected = integrity.files?.[file.path];
    if (typeof expected !== "string" || digest(file.content) !== expected) {
      throw new Error(`Integrity check failed for ${file.path}.`);
    }
  }

  const itemDigest = digest(
    item.files
      .map((file) => `${file.path}:${integrity.files[file.path]}`)
      .join("\n"),
  );
  if (itemDigest !== integrity.item) {
    throw new Error("Registry item integrity check failed.");
  }
  return item;
}

function readTestRegistryItem(name) {
  const directory = process.env.IUVUI_TEST_REGISTRY_PATH;
  if (process.env.NODE_ENV !== "test" || !directory) return undefined;
  const path = join(resolve(directory), `${name}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

export async function fetchRegistryItem(name) {
  validateComponentName(name);
  const testItem = readTestRegistryItem(name);
  if (testItem) return validateRegistryItem(testItem, name);

  const url = new URL(`${DEFAULT_REGISTRY_URL}/${name}.json`);
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Registry request failed with status ${response.status}.`);
  }
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_REGISTRY_BYTES) {
    throw new Error("Registry response is too large.");
  }
  const text = await response.text();
  if (Buffer.byteLength(text) > MAX_REGISTRY_BYTES) {
    throw new Error("Registry response is too large.");
  }

  let item;
  try {
    item = JSON.parse(text);
  } catch {
    throw new Error("Registry returned invalid JSON.");
  }
  return validateRegistryItem(item, name);
}
