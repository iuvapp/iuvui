import { execFileSync } from "node:child_process";

const shaPattern = /^[a-f0-9]{40}$/i;
const shortShaPattern = /^[a-f0-9]{7,40}$/i;
const stagingTagPattern =
  /^(?:staging|preview)\/(\d{8}T\d{6}Z)-([a-f0-9]{7,40})$/i;

export const STAGING_TAG_PREFIXES = ["staging", "preview"];
export const STAGING_ENVIRONMENT_NAMES = ["staging", "preview", "Staging"];

export function normalizeSha(sha) {
  const value = sha?.trim().toLowerCase();
  if (!value) {
    throw new Error("SHA is required");
  }
  if (!shaPattern.test(value)) {
    throw new Error(`Invalid full SHA: ${sha}`);
  }
  return value;
}

export function shortSha(sha) {
  return normalizeSha(sha).slice(0, 7);
}

export function formatStagingTagName(sha, date = new Date()) {
  const normalized = normalizeSha(sha);
  const stamp = date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  return `staging/${stamp}-${shortSha(normalized)}`;
}

export function parseStagingTag(tag) {
  const match = stagingTagPattern.exec(tag?.trim() ?? "");
  if (!match) {
    return null;
  }
  const [, timestamp, tagShortSha] = match;
  if (!shortShaPattern.test(tagShortSha)) {
    return null;
  }
  const prefix = tag.trim().split("/")[0].toLowerCase();
  return { prefix, timestamp, shortSha: tagShortSha.toLowerCase() };
}

export function isStagingTag(tag) {
  return parseStagingTag(tag) !== null;
}

export function stagingTagMatchesSha(tag, sha) {
  const parsed = parseStagingTag(tag);
  if (!parsed) {
    return false;
  }
  return shortSha(sha) === parsed.shortSha;
}

export function findStagingTagsForSha(tags, sha) {
  const target = shortSha(sha);
  return tags.filter((tag) => {
    const parsed = parseStagingTag(tag);
    return parsed?.shortSha === target;
  });
}

export function peelTagToCommitSha(tag, cwd = process.cwd()) {
  return execFileSync("git", ["rev-parse", `${tag}^{commit}`], {
    cwd,
    encoding: "utf8",
  }).trim();
}

export function listPromotionTags(cwd = process.cwd()) {
  const tags = [];
  for (const prefix of STAGING_TAG_PREFIXES) {
    const listed = execFileSync("git", ["tag", "-l", `${prefix}/*`], {
      cwd,
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean);
    tags.push(...listed);
  }
  return tags;
}

export function resolvePromotionSha({
  promotion,
  requestedSha,
  mainHeadSha,
  stagingTag,
  tags = [],
}) {
  if (promotion === "staging") {
    if (stagingTag) {
      throw new Error("staging_tag is only valid for production promotion");
    }
    if (requestedSha) {
      return { sha: normalizeSha(requestedSha), stagingTag: null };
    }
    if (!mainHeadSha) {
      throw new Error("main HEAD is required when sha is omitted");
    }
    return { sha: normalizeSha(mainHeadSha), stagingTag: null };
  }

  if (promotion !== "production") {
    throw new Error(`Unknown promotion: ${promotion}`);
  }

  if (stagingTag) {
    if (!isStagingTag(stagingTag)) {
      throw new Error(`Invalid staging tag: ${stagingTag}`);
    }
    const matches = tags.filter((tag) => tag === stagingTag);
    if (!matches.length) {
      throw new Error(`Staging tag not found: ${stagingTag}`);
    }
    const parsed = parseStagingTag(stagingTag);
    return { sha: null, stagingTag, shortSha: parsed.shortSha };
  }

  if (!requestedSha) {
    throw new Error("production promotion requires sha or staging_tag");
  }

  const normalized = normalizeSha(requestedSha);
  const matchingTags = findStagingTagsForSha(tags, normalized);
  if (!matchingTags.length) {
    throw new Error(
      `No staging tag found for SHA ${shortSha(normalized)}; deploy staging first`,
    );
  }
  return {
    sha: normalized,
    stagingTag: matchingTags[0],
    shortSha: shortSha(normalized),
  };
}

export function assertStagingDeployment({
  sha,
  deployments,
  environments = STAGING_ENVIRONMENT_NAMES,
}) {
  const normalized = normalizeSha(sha);
  const allowed = new Set(environments.map((name) => name.toLowerCase()));
  const successes = deployments.filter(
    (deployment) =>
      allowed.has(deployment.environment?.toLowerCase() ?? "") &&
      deployment.sha?.toLowerCase() === normalized &&
      deployment.state === "success",
  );
  if (!successes.length) {
    throw new Error(
      `No successful staging deployment found for SHA ${shortSha(normalized)}`,
    );
  }
  return successes[0];
}
