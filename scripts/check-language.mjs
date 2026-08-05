import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const excludedDirectories = new Set([
  ".git",
  ".turbo",
  ".wrangler",
  "coverage",
  "dist",
  "node_modules",
  "paraglide",
  "playwright-report",
  "storybook-static",
  "test-results",
]);
const excludedFiles = new Set(["pnpm-lock.yaml"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsonc",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);
const nonLatinScript =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Cyrillic}\p{Script=Arabic}\p{Script=Devanagari}]/u;
const projectSettings = JSON.parse(
  await readFile(join(root, "project.inlang", "settings.json"), "utf8"),
);
const localizedMessageFiles = new Set(
  projectSettings.locales
    .filter((locale) => locale !== projectSettings.baseLocale)
    .map((locale) => `messages/${locale}.json`),
);

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else if (
      entry.isFile() &&
      !excludedFiles.has(entry.name) &&
      textExtensions.has(extname(entry.name))
    ) {
      files.push(path);
    }
  }
  return files;
}

const violations = [];
for (const file of await collect(root)) {
  const repositoryPath = relative(root, file).split(sep).join("/");
  if (localizedMessageFiles.has(repositoryPath)) continue;
  const lines = (await readFile(file, "utf8")).split(/\r?\n/u);
  lines.forEach((line, index) => {
    if (nonLatinScript.test(line)) {
      violations.push(`${repositoryPath}:${index + 1}`);
    }
  });
}

if (violations.length > 0) {
  console.error(
    "Non-English script characters found in repository-authored files:",
  );
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log("Language check passed.");
}
