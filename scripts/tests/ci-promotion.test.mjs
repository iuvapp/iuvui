import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertStagingDeployment,
  formatStagingTagName,
  isStagingTag,
  parseStagingTag,
  resolvePromotionSha,
  shortSha,
} from "../ci-promotion.mjs";

test("formatStagingTagName uses staging prefix and short sha", () => {
  const sha = "a".repeat(40);
  const tag = formatStagingTagName(sha, new Date("2026-09-28T08:00:00.000Z"));
  assert.match(tag, /^staging\/20260928T080000Z-aaaaaaa$/);
});

test("resolvePromotionSha defaults staging to main head", () => {
  const mainHead = "b".repeat(40);
  const resolved = resolvePromotionSha({
    promotion: "staging",
    mainHeadSha: mainHead,
  });
  assert.equal(resolved.sha, mainHead);
});

test("resolvePromotionSha requires staging tag for production", () => {
  const sha = "c".repeat(40);
  const tag = formatStagingTagName(sha);
  assert.throws(
    () =>
      resolvePromotionSha({
        promotion: "production",
        requestedSha: sha,
        tags: [],
      }),
    /No staging tag found/
  );
  const resolved = resolvePromotionSha({
    promotion: "production",
    requestedSha: sha,
    tags: [tag],
  });
  assert.equal(resolved.stagingTag, tag);
});

test("assertStagingDeployment accepts Staging environment", () => {
  const sha = "d".repeat(40);
  assertStagingDeployment({
    sha,
    deployments: [
      {
        environment: "Staging",
        sha,
        state: "success",
      },
    ],
  });
});

test("parseStagingTag accepts legacy preview prefix", () => {
  assert.ok(isStagingTag("preview/20260928T080000Z-abcdef0"));
  assert.equal(parseStagingTag("preview/20260928T080000Z-abcdef0")?.prefix, "preview");
});
