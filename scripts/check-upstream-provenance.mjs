import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const remote = process.argv.includes("--remote");
const commitPattern = /^[0-9a-f]{40}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const catalog = JSON.parse(
  readFileSync(resolve(root, "registry/registry.json"), "utf8"),
);
const errors = [];
const references = [];

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}

function validateReference(item, reference) {
  const prefix = `Registry item ${item.name}`;
  if (
    typeof reference?.name !== "string" ||
    typeof reference.component !== "string" ||
    !httpsUrl(reference.repository) ||
    !commitPattern.test(reference.revision) ||
    !commitPattern.test(reference.blob) ||
    typeof reference.path !== "string" ||
    reference.path.length === 0 ||
    reference.path.startsWith("/") ||
    reference.path.split("/").includes("..") ||
    !datePattern.test(reference.syncedAt) ||
    typeof reference.license !== "string" ||
    !["derived", "architectural-reference"].includes(reference.relationship) ||
    !Array.isArray(reference.localChanges) ||
    reference.localChanges.length === 0 ||
    reference.localChanges.some(
      (change) => typeof change !== "string" || change.length === 0,
    )
  ) {
    errors.push(`${prefix} contains invalid upstream provenance.`);
    return;
  }

  const source = httpsUrl(reference.source);
  if (!source || !source.href.includes(reference.revision)) {
    errors.push(`${prefix} does not use an immutable upstream source URL.`);
  }
  if (reference.registry !== undefined && !httpsUrl(reference.registry)) {
    errors.push(`${prefix} contains an invalid upstream Registry URL.`);
  }

  references.push({ item: item.name, ...reference });
}

for (const item of catalog.items ?? []) {
  const metadata = item.meta?.iuvui;
  const provenance = metadata?.provenance;
  if (
    !provenance ||
    !["independent", "derived"].includes(provenance.kind) ||
    !httpsUrl(provenance.repository) ||
    typeof provenance.path !== "string" ||
    provenance.path.length === 0
  ) {
    errors.push(`Registry item ${item.name} has invalid canonical provenance.`);
  }

  if (!Array.isArray(metadata?.references)) {
    errors.push(`Registry item ${item.name} is missing upstream references.`);
    continue;
  }

  for (const reference of metadata.references) {
    validateReference(item, reference);
  }

  if (
    provenance?.kind === "derived" &&
    !metadata.references.some(
      (reference) => reference.relationship === "derived",
    )
  ) {
    errors.push(`Registry item ${item.name} is missing its derived upstream.`);
  }
}

async function githubJson(url) {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "iuvui-upstream-check",
    "x-github-api-version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

function githubRepository(value) {
  const url = httpsUrl(value);
  if (url?.hostname !== "github.com") return undefined;
  const [owner, repository] = url.pathname.replace(/^\//, "").split("/");
  if (!owner || !repository) return undefined;
  return { owner, repository: repository.replace(/\.git$/, "") };
}

async function checkRemote(reference) {
  const repository = githubRepository(reference.repository);
  if (!repository) {
    console.log(
      `Remote check skipped for ${reference.item}: unsupported repository host.`,
    );
    return;
  }

  const api = `https://api.github.com/repos/${repository.owner}/${repository.repository}`;
  const repositoryMetadata = await githubJson(api);
  const encodedPath = reference.path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const pinned = await githubJson(
    `${api}/contents/${encodedPath}?ref=${reference.revision}`,
  );
  if (pinned.sha !== reference.blob) {
    errors.push(
      `${reference.item} records blob ${reference.blob}, but the pinned source resolves to ${String(pinned.sha)}.`,
    );
    return;
  }

  const latest = await githubJson(
    `${api}/contents/${encodedPath}?ref=${encodeURIComponent(repositoryMetadata.default_branch)}`,
  );
  if (latest.sha !== reference.blob) {
    errors.push(
      `${reference.item} has an upstream change: pinned blob ${reference.blob}, latest blob ${String(latest.sha)}.`,
    );
  }
}

if (errors.length === 0 && remote) {
  for (const reference of references) {
    try {
      await checkRemote(reference);
    } catch (error) {
      errors.push(
        `${reference.item} remote provenance check failed: ${error instanceof Error ? error.message : String(error)}.`,
      );
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`Upstream provenance: ${error}`);
  process.exit(1);
}

console.log(
  remote
    ? `Upstream provenance is current for ${references.length} reference(s).`
    : `Upstream provenance is complete for ${references.length} reference(s).`,
);
