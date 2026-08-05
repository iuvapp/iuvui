import { createRequire } from "node:module";
import { resolve } from "node:path";

import { initializeProject } from "./config.js";
import { installComponents } from "./install.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const help = `iuvui ${version}

The CLI for the iuvui React UI system.

Usage:
  iuvui <command> [options]

Commands:
  doctor                   Show local environment information
  init                     Initialize iuvui in a project
  add <component...>       Add component source to a project

Options:
  --cwd <path>             Run in a different project directory
  --source-dir <path>      Set the source directory during init
  -h, --help               Show help
  -v, --version            Show version
`;

function parseArguments(input) {
  const positional = [];
  let cwd = process.cwd();
  let sourceDirectory;

  for (let index = 0; index < input.length; index += 1) {
    const value = input[index];
    if (value === "--cwd" || value === "--source-dir") {
      const optionValue = input[index + 1];
      if (!optionValue || optionValue.startsWith("-")) {
        throw new Error(`${value} requires a value.`);
      }
      if (value === "--cwd") cwd = resolve(optionValue);
      else sourceDirectory = optionValue;
      index += 1;
    } else if (
      value.startsWith("-") &&
      !["-h", "--help", "-v", "--version"].includes(value)
    ) {
      throw new Error(`Unknown option: ${value}`);
    } else {
      positional.push(value);
    }
  }
  return { cwd, positional, sourceDirectory };
}

function writeEnvironment(stdout) {
  const supported = Number.parseInt(process.versions.node, 10) >= 20;
  stdout.write(`iuvui: ${version}\n`);
  stdout.write(
    `node: ${process.versions.node}${supported ? "" : " (unsupported)"}\n`,
  );
  stdout.write(`platform: ${process.platform} ${process.arch}\n`);
  if (!supported) process.exitCode = 1;
}

export async function run(
  input,
  { stdout = process.stdout, stderr = process.stderr } = {},
) {
  const { cwd, positional, sourceDirectory } = parseArguments(input);
  const [command, ...args] = positional;

  if ([undefined, "-h", "--help", "help"].includes(command)) {
    stdout.write(help);
    return;
  }
  if (["-v", "--version", "version"].includes(command)) {
    stdout.write(`${version}\n`);
    return;
  }
  if (command === "doctor") {
    writeEnvironment(stdout);
    return;
  }
  if (command === "init") {
    if (args.length > 0)
      throw new Error("The init command takes no arguments.");
    const result = initializeProject(cwd, sourceDirectory);
    stdout.write(
      result.created
        ? `Initialized iuvui in ${result.config.sourceDirectory}.\n`
        : `iuvui is already initialized in ${result.config.sourceDirectory}.\n`,
    );
    return;
  }
  if (command === "add") {
    if (sourceDirectory) {
      throw new Error("--source-dir is only supported by `iuvui init`.");
    }
    if (args.length === 0) throw new Error("Specify at least one component.");
    const result = await installComponents(cwd, args);
    stdout.write(`Installed ${args.join(", ")}:\n`);
    for (const file of result.files) stdout.write(`  ${file}\n`);
    if (result.dependencies.length > 0) {
      stdout.write(`\nInstall dependencies:\n  ${result.installCommand}\n`);
    }
    return;
  }

  stderr.write(`Unknown command: ${command}\n\n`);
  stdout.write(help);
  process.exitCode = 1;
}
