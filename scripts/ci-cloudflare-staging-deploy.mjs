import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const workerNames = new Set(["iuvui", "iuvui-storybook"]);

function runWrangler(args, { cwd, env }) {
  const result = spawnSync("pnpm", ["exec", "wrangler", ...args], {
    cwd,
    env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const outcome = result.signal
      ? `signal ${result.signal}`
      : `exit code ${result.status}`;
    throw new Error(`Wrangler ${args.join(" ")} failed with ${outcome}`);
  }
}

async function workerExists({ workerName, accountId, apiToken, fetchImpl }) {
  const response = await fetchImpl(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/workers/scripts/${encodeURIComponent(workerName)}/script-settings`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  );

  if (response.status === 404) {
    return false;
  }

  const payload = await response.json();
  if (!response.ok || payload.success !== true) {
    const details = payload.errors
      ?.map(({ code, message }) => `${code}: ${message}`)
      .join("; ");
    throw new Error(
      `Cloudflare Worker lookup failed (${response.status})${details ? `: ${details}` : ""}`,
    );
  }

  return true;
}

async function writeRouteFreeConfig({ workerName, configPath }) {
  const source = await readFile(configPath, "utf8");
  const parsed = ts.parseConfigFileTextToJson(configPath, source);
  if (parsed.error) {
    throw new Error(
      `Could not parse Wrangler config: ${ts.flattenDiagnosticMessageText(parsed.error.messageText, "\n")}`,
    );
  }

  const config = parsed.config;
  if (config.name !== workerName) {
    throw new Error(
      `Wrangler config name ${JSON.stringify(config.name)} does not match ${JSON.stringify(workerName)}`,
    );
  }

  delete config.route;
  delete config.routes;
  config.workers_dev = false;

  for (const environment of Object.values(config.env ?? {})) {
    delete environment.route;
    delete environment.routes;
    environment.workers_dev = false;
  }

  const bootstrapConfigPath = `${configPath}.bootstrap-${process.pid}-${randomUUID()}.json`;
  await writeFile(bootstrapConfigPath, `${JSON.stringify(config, null, 2)}\n`, {
    flag: "wx",
  });

  return bootstrapConfigPath;
}

export async function deployStagingWorker({
  workerName,
  configPath,
  cwd = process.cwd(),
  env = process.env,
  fetchImpl = fetch,
  runWranglerCommand = runWrangler,
  log = console.log,
}) {
  if (!workerNames.has(workerName)) {
    throw new Error(`Unsupported Worker: ${workerName}`);
  }

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required for staging deploys",
    );
  }

  const absoluteConfigPath = resolve(cwd, configPath);
  if (!(await workerExists({ workerName, accountId, apiToken, fetchImpl }))) {
    log(`Worker ${workerName} is missing; bootstrapping it without routes.`);
    const bootstrapConfigPath = await writeRouteFreeConfig({
      workerName,
      configPath: absoluteConfigPath,
    });

    try {
      await runWranglerCommand(["deploy", "--config", bootstrapConfigPath], {
        cwd,
        env,
      });
    } finally {
      await rm(bootstrapConfigPath, { force: true });
    }
  }

  await runWranglerCommand(
    ["versions", "upload", "--preview-alias", "staging"],
    { cwd, env },
  );
}

async function main(argv = process.argv.slice(2)) {
  const [workerName, configPath] = argv;
  if (!workerName || !configPath || argv.length !== 2) {
    throw new Error(
      "Usage: node scripts/ci-cloudflare-staging-deploy.mjs <iuvui|iuvui-storybook> <wrangler-config>",
    );
  }

  await deployStagingWorker({ workerName, configPath });
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await main();
}
