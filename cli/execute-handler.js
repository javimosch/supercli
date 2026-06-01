"use strict";

const { execute } = require("./executor");
const { buildLocalPlan, annotateServerPlan, outputHumanPlan } = require("./plan-runtime");

async function handleExecute(cmd, uFlags, config, { SERVER, humanMode, output, outputError, outputHumanTable, writeLog, getClientId, makeStreamEmitter }) {
  const [namespace, resource, action] = [cmd.namespace, cmd.resource, cmd.action];
  const start = Date.now();
  const result = await execute(cmd, uFlags, {
    server: SERVER || "",
    config,
    onStreamEvent: cmd.adapterConfig && cmd.adapterConfig.stream === "jsonl"
      ? makeStreamEmitter(`${namespace}.${resource}.${action}`)
      : null,
  });
  const duration = Date.now() - start;

  writeLog({
    command: `${namespace}.${resource}.${action}`,
    args: uFlags, status: "success",
    duration_ms: duration, timestamp: new Date().toISOString(),
    client_id: getClientId(),
  });

  if (humanMode) {
    process.stderr.write(`  ⚡ ${namespace}.${resource}.${action} (${duration}ms)\n`);
    if (Array.isArray(result)) {
      outputHumanTable(
        result.slice(0, 20),
        Object.keys(result[0] || {}).slice(0, 6).map((k) => ({ key: k, label: k }))
      );
      if (result.length > 20) console.log(`  ... and ${result.length - 20} more`);
    } else if (typeof result === "object") {
      for (const [k, v] of Object.entries(result)) {
        console.log(`  ${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
      }
    }
    console.log("");
  } else {
    output({ version: "1.0", command: `${namespace}.${resource}.${action}`, duration_ms: duration, data: result });
  }
}

async function handlePlan(cmd, args, { SERVER, hasServer, humanMode, output, outputError }) {
  if (!hasServer) {
    const localPlan = buildLocalPlan(cmd, args);
    if (humanMode) outputHumanPlan(localPlan);
    else output(localPlan);
    return;
  }
  try {
    const r = await fetch(`${SERVER}/api/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: `${cmd.namespace}.${cmd.resource}.${cmd.action}`, args, cmd }),
    });
    const plan = annotateServerPlan(await r.json());
    if (humanMode) outputHumanPlan(plan);
    else output(plan);
  } catch (err) {
    outputError({ code: 105, type: "integration_error", message: `Failed to create plan: ${err.message}`, recoverable: true });
  }
}

async function handleExecutePlan(planId, { SERVER, output, outputError }) {
  try {
    const r = await fetch(`${SERVER}/api/plans/${planId}/execute`, { method: "POST" });
    output(await r.json());
  } catch (err) {
    outputError({ code: 105, type: "integration_error", message: `Failed to execute plan: ${err.message}`, recoverable: true });
  }
}

module.exports = { handleExecute, handlePlan, handleExecutePlan };
