#!/usr/bin/env node

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");
const [command, ...args] = process.argv.slice(2);

const help = `iuvui ${version}

The CLI for the iuvui React UI system.

Usage:
  iuvui <command> [options]

Commands:
  doctor          Show local environment information
  init            Initialize iuvui in a project (coming soon)
  add <component> Add component source to a project (coming soon)

Options:
  -h, --help      Show help
  -v, --version   Show version
`;

function printHelp() {
  process.stdout.write(help);
}

function printVersion() {
  process.stdout.write(`${version}\n`);
}

function printDoctor() {
  const supported = Number.parseInt(process.versions.node, 10) >= 20;

  process.stdout.write(`iuvui: ${version}\n`);
  process.stdout.write(
    `node: ${process.versions.node}${supported ? "" : " (unsupported)"}\n`,
  );
  process.stdout.write(`platform: ${process.platform} ${process.arch}\n`);

  if (!supported) {
    process.exitCode = 1;
  }
}

function printComingSoon(name) {
  process.stderr.write(
    `The \`${name}\` command is not available in this alpha release yet.\n` +
      "Follow https://github.com/iuv-tech/iuvui for updates.\n",
  );
  process.exitCode = 1;
}

switch (command) {
  case undefined:
  case "-h":
  case "--help":
  case "help":
    printHelp();
    break;
  case "-v":
  case "--version":
  case "version":
    printVersion();
    break;
  case "doctor":
    printDoctor();
    break;
  case "init":
    printComingSoon("init");
    break;
  case "add":
    printComingSoon(args[0] ? `add ${args[0]}` : "add");
    break;
  default:
    process.stderr.write(`Unknown command: ${command}\n\n`);
    printHelp();
    process.exitCode = 1;
}
