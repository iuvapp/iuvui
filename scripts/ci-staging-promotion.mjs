import { appendFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const gateLabels = {
  quality: "Quality CI",
  deployStaging: "Staging deploy",
};

export function evaluateStagingPromotionGate({ gateFailures, runUrl }) {
  const blockers = gateFailures.filter((failure) => !failure.optionalOnly);
  const warnings = gateFailures.filter((failure) => failure.optionalOnly);

  return {
    canTag: blockers.length === 0,
    blockers,
    warnings,
    summaryMarkdown: formatStagingGateSummary({
      blockers,
      warnings,
      runUrl,
    }),
  };
}

export function formatStagingGateSummary({ blockers, warnings, runUrl }) {
  const lines = ["## Staging promotion gate", ""];

  if (blockers.length === 0 && warnings.length === 0) {
    lines.push("All staging gates passed.");
  } else {
    if (blockers.length > 0) {
      lines.push("### Blocking failures (tag-staging will not run)");
      for (const blocker of blockers) {
        lines.push(
          `- **${gateLabels[blocker.gate] ?? blocker.gate}**: ${blocker.message}`,
        );
      }
      lines.push("");
    }

    if (warnings.length > 0) {
      lines.push("### Warnings");
      for (const warning of warnings) {
        lines.push(
          `- **${gateLabels[warning.gate] ?? warning.gate}**: ${warning.message}`,
        );
      }
      lines.push("");
    }
  }

  if (runUrl) {
    lines.push(`Workflow run: ${runUrl}`);
  }

  return lines.join("\n");
}

export function evaluateStagingGateFromJobResults({ jobResults, runUrl }) {
  const failures = [];

  if (jobResults.quality !== "success") {
    failures.push({
      gate: "quality",
      message: "Quality checks failed (see the Quality CI job).",
    });
  }

  if (jobResults.deployStaging !== "success") {
    failures.push({
      gate: "deployStaging",
      message: "Staging Worker deploy failed (see the Staging deploy job).",
    });
  }

  return evaluateStagingPromotionGate({ gateFailures: failures, runUrl });
}

async function writeStepSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    console.log(markdown);
    return;
  }
  await appendFile(summaryPath, `${markdown}\n`);
}

async function main() {
  const jobResults = {
    quality: process.env.QUALITY_RESULT ?? "success",
    deployStaging: process.env.DEPLOY_STAGING_RESULT ?? "success",
  };
  const runUrl =
    process.env.GITHUB_SERVER_URL &&
    process.env.GITHUB_REPOSITORY &&
    process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined;

  const evaluation = evaluateStagingGateFromJobResults({
    jobResults,
    runUrl,
  });

  await writeStepSummary(evaluation.summaryMarkdown);

  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `can_tag=${evaluation.canTag ? "true" : "false"}\n`,
    );
  }

  if (!evaluation.canTag) {
    console.error("Staging promotion blocked.");
    for (const blocker of evaluation.blockers) {
      console.error(`${blocker.gate}: ${blocker.message}`);
    }
    process.exitCode = 1;
  }
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await main();
}
