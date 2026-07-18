"use strict";

// act.js — `sc act` — execute a plan from `sc plan`.
//
// Takes a plan (JSON from stdin, a file, or a positional JSON string) and
// executes it as a DAG:
//   - Steps with no dependencies run in parallel
//   - Steps with dependencies wait for them to complete
//   - Verification commands run after each step (if specified)
//   - On failure: abort (stop) or continue (proceed) per step config
//   - Rollback commands run for specific failed steps (if specified)
//
// This is the second part of the sc plan / sc act / sc review trilogy
// from VISION.md — agents declare intent (plan), sc executes it (act).

const fs = require("fs");
const { loadConfig } = require("./config");
const { execute } = require("./executor");
const { makeOutput, makeOutputError } = require("./output");

function readPlanFromInput(positional, flags) {
  // Priority: --file flag > flags._stdin (raw string) >
  //            flags.steps (merged from piped JSON) > positional JSON string

  if (flags.file) {
    const content = fs.readFileSync(flags.file, "utf-8");
    return JSON.parse(content);
  }

  // The main CLI's readStdin() consumes piped stdin at startup (50ms timeout).
  // If it was valid JSON, the keys get merged into flags (e.g. flags.steps).
  // If it wasn't JSON, it's stored as flags._stdin (raw string).
  if (flags._stdin && typeof flags._stdin === "string") {
    try {
      return JSON.parse(flags._stdin);
    } catch {
      // fall through
    }
  }

  // Reconstruct plan from merged flags (when stdin was valid JSON plan)
  if (Array.isArray(flags.steps)) {
    return {
      summary: typeof flags.summary === "string" ? flags.summary : "",
      steps: flags.steps,
      rollback: Array.isArray(flags.rollback) ? flags.rollback : [],
    };
  }

  // Positional: sc act '<json string>'
  if (positional[1]) {
    return JSON.parse(positional[1]);
  }

  return null;
}

function topologicalSort(steps) {
  const sorted = [];
  const visited = new Set();
  const stepMap = new Map(steps.map((s) => [s.id, s]));

  function visit(id) {
    if (visited.has(id)) return;
    visited.add(id);
    const step = stepMap.get(id);
    if (step) {
      for (const dep of step.depends_on || []) {
        visit(dep);
      }
      sorted.push(step);
    }
  }

  for (const step of steps) {
    visit(step.id);
  }
  return sorted;
}

function getReadySteps(steps, completed) {
  return steps.filter((s) => {
    if (completed.has(s.id)) return false;
    const deps = s.depends_on || [];
    return deps.every((d) => completed.has(d));
  });
}

async function executeStep(step, config, server, context) {
  const parts = step.command.split(".");
  if (parts.length < 3) {
    return {
      step_id: step.id,
      command: step.command,
      status: "error",
      error: `Invalid command format: ${step.command} (expected namespace.resource.action)`,
      exit_code: 85,
    };
  }
  const [ns, resource, action] = parts;

  const cmd = config.commands.find(
    (c) => c.namespace === ns && c.resource === resource && c.action === action,
  );

  if (!cmd) {
    return {
      step_id: step.id,
      command: step.command,
      status: "error",
      error: `Command ${step.command} not found in config`,
      exit_code: 92,
    };
  }

  const flags = { ...(step.args || {}), json: true };
  try {
    const result = await execute(cmd, flags, {
      ...context,
      config,
      server: server || "",
    });
    return {
      step_id: step.id,
      command: step.command,
      status: "success",
      result,
      exit_code: 0,
    };
  } catch (err) {
    return {
      step_id: step.id,
      command: step.command,
      status: "error",
      error: err.message || "Execution failed",
      exit_code: err.code || 1,
    };
  }
}

async function executeVerify(verifyCommand, config, server, context) {
  if (!verifyCommand) return { status: "skipped" };

  const parts = verifyCommand.split(".");
  if (parts.length < 3) {
    return { status: "skipped", reason: "invalid verify command format" };
  }
  const [ns, resource, action] = parts;

  const cmd = config.commands.find(
    (c) => c.namespace === ns && c.resource === resource && c.action === action,
  );

  if (!cmd) {
    return { status: "skipped", reason: "verify command not found" };
  }

  try {
    const result = await execute(cmd, { json: true }, {
      ...context,
      config,
      server: server || "",
    });
    return { status: "passed", result };
  } catch (err) {
    return { status: "failed", error: err.message };
  }
}

async function executeRollback(rollbackStep, config, server, context) {
  const parts = rollbackStep.command.split(".");
  if (parts.length < 3) return { status: "skipped", error: "invalid rollback command" };
  const [ns, resource, action] = parts;

  const cmd = config.commands.find(
    (c) => c.namespace === ns && c.resource === resource && c.action === action,
  );
  if (!cmd) return { status: "skipped", error: "rollback command not found" };

  try {
    const result = await execute(cmd, { ...(rollbackStep.args || {}), json: true }, {
      ...context,
      config,
      server: server || "",
    });
    return { status: "executed", result };
  } catch (err) {
    return { status: "failed", error: err.message };
  }
}

async function handleActCommand({
  positional,
  flags,
  context,
  humanMode,
  output,
  outputError,
}) {
  let plan;
  try {
    plan = readPlanFromInput(positional, flags);
  } catch (err) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: `Failed to read plan: ${err.message}`,
      recoverable: false,
      suggestions: [
        'supercli plan "<intent>" --json  (generate a plan first)',
        "sc act --file plan.json  (execute from file)",
        'cat plan.json | sc act  (pipe plan via stdin)',
      ],
    });
    return;
  }

  if (!plan) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: 'Usage: sc act --file <plan.json>  |  cat plan.json | sc act  |  sc act \'<json>\'',
      recoverable: false,
      suggestions: [
        'supercli plan "<intent>" --json > plan.json  (generate a plan)',
        "sc act --file plan.json  (execute it)",
      ],
    });
    return;
  }

  if (!plan.steps || !Array.isArray(plan.steps) || plan.steps.length === 0) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: "Plan has no steps to execute",
      recoverable: false,
    });
    return;
  }

  const config = await loadConfig(context.server || "");
  const server = context.server || "";
  const execContext = { config, server };

  const dryRun = !!flags["dry-run"];
  const sortedSteps = topologicalSort(plan.steps);
  const stepMap = new Map(plan.steps.map((s) => [s.id, s]));
  const completed = new Set();
  const failed = new Set();
  const results = [];
  const rollbacks = [];
  let aborted = false;

  if (humanMode) {
    console.log("\n  ⚡ Act\n");
    console.log(`  Plan: ${plan.summary || "(no summary)"}`);
    console.log(`  Steps: ${sortedSteps.length}`);
    if (dryRun) console.log("  Mode: DRY RUN (no execution)\n");
    else console.log("");
  }

  // Execute in dependency order, running independent steps in parallel
  while (completed.size < sortedSteps.length && !aborted) {
    const ready = getReadySteps(sortedSteps, completed);
    if (ready.length === 0) {
      // No ready steps but not all completed — means remaining steps have
      // failed dependencies or a cycle slipped past validation
      const remaining = sortedSteps.filter((s) => !completed.has(s.id));
      for (const s of remaining) {
        const deps = (s.depends_on || []).filter((d) => failed.has(d));
        results.push({
          step_id: s.id,
          command: s.command,
          status: "skipped",
          reason: `dependencies failed: ${deps.join(", ")}`,
        });
        completed.add(s.id);
      }
      break;
    }

    if (dryRun) {
      for (const step of ready) {
        const argStr = Object.entries(step.args || {})
          .map(([k, v]) => `--${k}=${v}`)
          .join(" ");
        if (humanMode) {
          console.log(`  [dry-run] ${step.id}: supercli ${step.command.replace(/\./g, " ")} ${argStr}`);
        }
        results.push({
          step_id: step.id,
          command: step.command,
          args: step.args || {},
          status: "dry_run",
          dry_run_command: `supercli ${step.command.replace(/\./g, " ")} ${argStr}`,
        });
        completed.add(step.id);
      }
      continue;
    }

    if (humanMode && ready.length > 1) {
      console.log(`  Parallel: ${ready.map((s) => s.id).join(", ")}`);
    }

    // Execute ready steps in parallel
    const stepPromises = ready.map(async (step) => {
      if (humanMode) {
        process.stderr.write(`  → ${step.id}: ${step.command}...\n`);
      }
      const result = await executeStep(step, config, server, execContext);

      // Run verification if specified
      if (result.status === "success" && step.verify) {
        const verifyResult = await executeVerify(step.verify, config, server, execContext);
        result.verify = verifyResult;
        if (verifyResult.status === "failed") {
          result.status = "verify_failed";
          result.exit_code = 1;
        }
      }

      return result;
    });

    const stepResults = await Promise.all(stepPromises);

    for (const result of stepResults) {
      results.push(result);
      completed.add(result.step_id);

      if (result.status === "success") {
        if (humanMode) {
          process.stderr.write(`  ✓ ${result.step_id}\n`);
        }
      } else {
        failed.add(result.step_id);
        const step = stepMap.get(result.step_id);
        const onFailure = step?.on_failure || "abort";

        if (humanMode) {
          process.stderr.write(`  ✗ ${result.step_id}: ${result.error || result.status}\n`);
        }

        // Run rollback for this step if defined
        const rollbackStep = (plan.rollback || []).find(
          (r) => r.if_failed_step === result.step_id,
        );
        if (rollbackStep) {
          const rollbackResult = await executeRollback(rollbackStep, config, server, execContext);
          rollbacks.push({
            failed_step: result.step_id,
            rollback: rollbackResult,
          });
          if (humanMode) {
            process.stderr.write(`  ↩ rollback for ${result.step_id}: ${rollbackResult.status}\n`);
          }
        }

        if (onFailure === "abort") {
          aborted = true;
          if (humanMode) {
            process.stderr.write(`  ⛔ aborted (step ${result.step_id} failed, on_failure: abort)\n`);
          }
        }
      }
    }
  }

  const successCount = results.filter((r) => r.status === "success").length;
  const failCount = results.filter(
    (r) => r.status === "error" || r.status === "verify_failed",
  ).length;
  const skipCount = results.filter((r) => r.status === "skipped").length;
  const dryRunCount = results.filter((r) => r.status === "dry_run").length;

  const summary = {
    plan_summary: plan.summary || "",
    total_steps: sortedSteps.length,
    succeeded: successCount,
    failed: failCount,
    skipped: skipCount,
    dry_run: dryRunCount,
    rollbacks_executed: rollbacks.length,
    aborted,
    status: aborted
      ? "aborted"
      : failCount > 0
        ? "completed_with_errors"
        : "completed",
  };

  if (humanMode) {
    console.log("\n  Summary:");
    console.log(`    status: ${summary.status}`);
    console.log(`    succeeded: ${summary.succeeded}/${summary.total_steps}`);
    if (summary.failed > 0) console.log(`    failed: ${summary.failed}`);
    if (summary.skipped > 0) console.log(`    skipped: ${summary.skipped}`);
    if (summary.rollbacks_executed > 0)
      console.log(`    rollbacks: ${summary.rollbacks_executed}`);
    if (summary.aborted) console.log("    ⛔ plan was aborted");
    console.log("\n  Next: sc review  (review results — future)\n");
  } else {
    output({
      version: "1.0",
      mode: "act",
      ...summary,
      results,
      rollbacks,
    });
  }
}

module.exports = { handleActCommand };
