import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cli = fileURLToPath(new URL("../bin/iuvui.js", import.meta.url));

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
}

test("prints help", () => {
  const result = run("--help");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /add <component>/);
});

test("prints version", () => {
  const result = run("--version");

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "0.0.0\n");
});

test("reports environment information", () => {
  const result = run("doctor");

  assert.equal(result.status, 0);
  assert.match(result.stdout, /iuvui: 0\.0\.0/);
  assert.match(result.stdout, /node:/);
  assert.match(result.stdout, /platform:/);
});

test("marks add as unavailable", () => {
  const result = run("add", "button");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /not available in this alpha release/);
});
