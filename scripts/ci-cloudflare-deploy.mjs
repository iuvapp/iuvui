import { spawnSync } from "node:child_process";

const profiles = {
  develop: {
    web: "web:deploy:staging",
    storybook: "storybook:deploy:staging",
  },
  production: {
    web: "web:deploy",
    storybook: "storybook:deploy",
  },
};

export function resolveProfileCommands(profile) {
  const commands = profiles[profile];
  if (!commands) {
    throw new Error(`Unsupported deploy profile: ${profile}`);
  }
  return commands;
}

export function deployWorkers({
  profile,
  cwd = process.cwd(),
  env = process.env,
}) {
  const commands = resolveProfileCommands(profile);
  const failures = [];

  for (const [target, script] of Object.entries(commands)) {
    const result = spawnSync("pnpm", [script], {
      cwd,
      env,
      stdio: "inherit",
    });
    if (result.status !== 0) {
      failures.push(target);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Deploy failed for: ${failures.join(", ")}`);
  }
}

async function main(argv = process.argv.slice(2)) {
  const profile = argv[0];
  if (!profile) {
    throw new Error(
      "Usage: node scripts/ci-cloudflare-deploy.mjs <develop|production>",
    );
  }
  deployWorkers({ profile });
}

import { pathToFileURL } from "node:url";

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await main();
}
