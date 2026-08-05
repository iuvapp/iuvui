#!/usr/bin/env node

import { run } from "../src/main.js";

try {
  await run(process.argv.slice(2));
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : "An unexpected error occurred."}\n`,
  );
  process.exitCode = 1;
}
