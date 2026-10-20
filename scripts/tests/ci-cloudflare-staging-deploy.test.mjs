import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { resolveProfileCommands } from "../ci-cloudflare-deploy.mjs";
import { deployStagingWorker } from "../ci-cloudflare-staging-deploy.mjs";

const configText = `{
  // Route must not be attached during bootstrap.
  "name": "iuvui-storybook",
  "main": "src/server.ts",
  "workers_dev": false,
  "routes": [{ "pattern": "ui.iuvui.com", "custom_domain": true }],
  "env": {
    "production": {
      "routes": [{ "pattern": "ui.iuvui.com", "custom_domain": true }]
    }
  },
}`;

async function createConfig(t, content = configText) {
  const cwd = await mkdtemp(join(tmpdir(), "iuvui-worker-bootstrap-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const configPath = join(cwd, "wrangler.jsonc");
  await writeFile(configPath, content);
  return { cwd, configPath };
}

const env = {
  CLOUDFLARE_ACCOUNT_ID: "account-id",
  CLOUDFLARE_API_TOKEN: "test-token",
};

test("missing staging Worker is bootstrapped route-free before staging upload", async (t) => {
  const { cwd, configPath } = await createConfig(t);
  const events = [];

  await deployStagingWorker({
    workerName: "iuvui-storybook",
    configPath,
    cwd,
    env,
    log: (message) => events.push(["log", message]),
    fetchImpl: async (url, options) => {
      events.push(["lookup", url, options]);
      return new Response("{}", { status: 404 });
    },
    runWranglerCommand: async (args, options) => {
      events.push(["wrangler", args, options]);
      if (args[0] === "deploy") {
        const bootstrapConfig = JSON.parse(await readFile(args[2], "utf8"));
        assert.equal(bootstrapConfig.name, "iuvui-storybook");
        assert.equal(bootstrapConfig.main, "src/server.ts");
        assert.equal(bootstrapConfig.workers_dev, false);
        assert.equal("routes" in bootstrapConfig, false);
        assert.equal("route" in bootstrapConfig, false);
        assert.deepEqual(bootstrapConfig.env.production, {
          workers_dev: false,
        });
        assert.equal(args[1], "--config");
      }
    },
  });

  assert.deepEqual(
    events.filter(([type]) => type !== "log").map((event) => event[0]),
    ["lookup", "wrangler", "wrangler"],
  );
  const wranglerEvents = events.filter(([type]) => type === "wrangler");
  assert.deepEqual(wranglerEvents[0][1].slice(0, 2), ["deploy", "--config"]);
  assert.deepEqual(wranglerEvents[1][1], [
    "versions",
    "upload",
    "--preview-alias",
    "staging",
  ]);
  assert.equal(
    events[0][1],
    "https://api.cloudflare.com/client/v4/accounts/account-id/workers/scripts/iuvui-storybook/script-settings",
  );
  assert.equal(events[0][2].headers.Authorization, "Bearer test-token");
  await assert.rejects(readFile(wranglerEvents[0][1][2]), { code: "ENOENT" });
});

test("existing staging Worker skips bootstrap and uploads a version", async () => {
  const commands = [];

  await deployStagingWorker({
    workerName: "iuvui",
    configPath: "dist/server/wrangler.json",
    env,
    fetchImpl: async () => Response.json({ success: true }),
    runWranglerCommand: async (args) => commands.push(args),
    log: () => {},
  });

  assert.deepEqual(commands, [
    ["versions", "upload", "--preview-alias", "staging"],
  ]);
});

test("Cloudflare lookup errors stop before any deployment command", async () => {
  let commandCount = 0;

  await assert.rejects(
    deployStagingWorker({
      workerName: "iuvui",
      configPath: "dist/server/wrangler.json",
      env,
      fetchImpl: async () =>
        Response.json(
          {
            success: false,
            errors: [{ code: 10000, message: "Permission denied" }],
          },
          { status: 403 },
        ),
      runWranglerCommand: async () => {
        commandCount += 1;
      },
    }),
    /Cloudflare Worker lookup failed \(403\): 10000: Permission denied/,
  );

  assert.equal(commandCount, 0);
});

test("production deployment remains on the unchanged deploy scripts", async () => {
  const commands = resolveProfileCommands("production");
  assert.deepEqual(commands, {
    web: "web:deploy",
    storybook: "storybook:deploy",
  });

  const webPackage = JSON.parse(
    await readFile("apps/web/package.json", "utf8"),
  );
  const storybookPackage = JSON.parse(
    await readFile("apps/storybook/package.json", "utf8"),
  );
  assert.equal(webPackage.scripts.deploy, "pnpm build && wrangler deploy");
  assert.equal(
    storybookPackage.scripts.deploy,
    "pnpm build && wrangler deploy",
  );

  const rootPackage = JSON.parse(await readFile("package.json", "utf8"));
  assert.match(rootPackage.scripts["web:deploy"], /\brun deploy\b/);
  assert.match(
    rootPackage.scripts["web:deploy:staging"],
    /\brun deploy:staging\b/,
  );
  assert.match(storybookPackage.scripts.build, /\bpreview:prepare\b/);
});
