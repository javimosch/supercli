"use strict";

// plan-intent.js — `sc plan "<intent>"` — intent-level workflow planning.
// Takes a natural language intent, uses an LLM to resolve it to a structured
// execution plan (DAG of plugin commands with dependencies + verification),
// and returns the plan as JSON. The agent (or `sc act`, future) executes it.
//
// This is the platform lock-in move from VISION.md: agents declare intent,
// not individual tools. sc plan resolves the toolchain.

async function localLLMPlan(intent, config, baseUrl, model, apiKey) {
  const namespaces = [...new Set(config.commands.map((c) => c.namespace))];
  const allDefs = [];

  for (const ns of namespaces) {
    const resources = [
      ...new Set(
        config.commands
          .filter((c) => c.namespace === ns)
          .map((c) => c.resource),
      ),
    ];
    for (const res of resources) {
      const actions = config.commands
        .filter((c) => c.namespace === ns && c.resource === res)
        .map((c) => c.action);
      for (const act of actions) {
        const cmd = config.commands.find(
          (c) => c.namespace === ns && c.resource === res && c.action === act,
        );
        if (!cmd) continue;
        const argList = (cmd.args || [])
          .map((a) => `--${a.name}${a.required ? " (required)" : ""}`)
          .join(" ");
        allDefs.push(
          `- ${ns} ${res} ${act} ${argList} : ${cmd.description || "no desc"}`,
        );
      }
    }
  }

  const systemPrompt = `You are an AI workflow planner.
Available commands:
${allDefs.join("\n")}

The user wants to accomplish a goal. Create a structured execution plan — a DAG of CLI commands with dependencies and verification steps.

Respond STRICTLY with a valid JSON object. Do not wrap it in markdown. Do not include any other text.

Format:
{
  "summary": "One-line description of the plan",
  "steps": [
    {
      "id": "build",
      "command": "namespace.resource.action",
      "args": { "flag": "value" },
      "depends_on": [],
      "verify": "namespace.resource.action --flag=value",
      "on_failure": "abort"
    }
  ],
  "rollback": [
    { "if_failed_step": "deploy", "command": "namespace.resource.action", "args": {} }
  ]
}

Rules:
- Each step has a unique "id" (short snake_case identifier).
- "depends_on" lists step IDs that must succeed before this step runs.
- "verify" is a command to check the step succeeded (or null if none).
- "on_failure" is "abort" (stop the plan) or "continue" (proceed anyway).
- "rollback" lists cleanup commands for specific failed steps.
- Steps with no dependencies can run in parallel.
- Keep plans minimal — only the steps needed to accomplish the goal.`;

  const r = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: intent },
      ],
      temperature: 0,
    }),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Local LLM Error ${r.status}: ${txt}`);
  }

  const data = await r.json();
  const content =
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;
  if (!content) throw new Error("Invalid response format from local LLM");

  let jsonStr = content.trim();
  if (jsonStr.startsWith("```json"))
    jsonStr = jsonStr
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();
  else if (jsonStr.startsWith("```"))
    jsonStr = jsonStr.replace(/^```/, "").replace(/```$/, "").trim();

  const plan = JSON.parse(jsonStr);
  if (!plan.steps || !Array.isArray(plan.steps))
    throw new Error("LLM did not return a plan with steps array");
  return plan;
}

async function remoteLLMPlan(intent, serverUrl) {
  const r = await fetch(`${serverUrl}/api/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Server error ${r.status}: ${txt}`);
  }
  const data = await r.json();
  return data.plan;
}

function validatePlan(plan) {
  const errors = [];
  const stepIds = new Set();

  for (const step of plan.steps) {
    if (!step.id) errors.push(`step missing "id": ${JSON.stringify(step).slice(0, 80)}`);
    if (step.id) stepIds.add(step.id);
    if (!step.command) errors.push(`step "${step.id}" missing "command"`);

    // Check dependencies reference valid step IDs
    for (const dep of step.depends_on || []) {
      if (!stepIds.has(dep) && !plan.steps.some((s) => s.id === dep)) {
        errors.push(`step "${step.id}" depends on unknown step "${dep}"`);
      }
    }

    // Check for circular dependencies (simple check)
    if (step.depends_on && step.depends_on.includes(step.id)) {
      errors.push(`step "${step.id}" depends on itself`);
    }
  }

  // Topological sort check — detect cycles
  const visited = new Set();
  const inProgress = new Set();
  function hasCycle(id) {
    if (inProgress.has(id)) return true;
    if (visited.has(id)) return false;
    inProgress.add(id);
    visited.add(id);
    const step = plan.steps.find((s) => s.id === id);
    for (const dep of (step && step.depends_on) || []) {
      if (hasCycle(dep)) return true;
    }
    inProgress.delete(id);
    return false;
  }
  for (const step of plan.steps) {
    if (hasCycle(step.id)) {
      errors.push(`circular dependency detected involving step "${step.id}"`);
      break;
    }
  }

  return errors;
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

function buildDryRunCommand(commandStr, args) {
  const parts = commandStr.split(".");
  const ns = parts[0];
  const res = parts[1];
  const act = parts[2];
  const argStr = Object.entries(args || {})
    .map(([k, v]) => {
      const val = String(v);
      if (val.includes(" ") || val.includes("'")) {
        return `--${k}='${val.replace(/'/g, "'\\''")}'`;
      }
      return `--${k}=${val}`;
    })
    .join(" ");
  return `supercli ${ns} ${res} ${act} ${argStr} --json`.trim();
}

async function handlePlanIntentCommand({
  positional,
  config,
  context,
  humanMode,
  output,
  outputError,
}) {
  const intent = positional.slice(1).join(" ");
  if (!intent) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: 'Usage: supercli plan "<your natural language intent>"',
      recoverable: false,
    });
    return;
  }

  const hasLocalLLM = !!process.env.OPENAI_BASE_URL;
  const hasServerLLM = context.server && config.features && config.features.ask;

  if (!hasLocalLLM && !hasServerLLM) {
    outputError({
      code: 105,
      type: "integration_error",
      message: "The 'plan' feature requires LLM configuration. Export OPENAI_BASE_URL locally or ensure SUPERCLI_SERVER has it configured.",
      recoverable: false,
      suggestions: [
        "Export OPENAI_BASE_URL for local LLM",
        "Export SUPERCLI_SERVER for server-side LLM",
        'supercli ask "<intent>" --json  (for flat step suggestions without DAG)',
      ],
    });
    return;
  }

  try {
    let plan;
    if (hasLocalLLM) {
      plan = await localLLMPlan(
        intent,
        config,
        process.env.OPENAI_BASE_URL,
        process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        process.env.OPENAI_API_KEY || "dummy",
      );
    } else {
      plan = await remoteLLMPlan(intent, context.server);
    }

    // Validate the plan
    const errors = validatePlan(plan);
    if (errors.length > 0) {
      outputError({
        code: 106,
        type: "plan_validation_error",
        message: `Plan validation failed: ${errors.join("; ")}`,
        recoverable: true,
        suggestions: [
          "Try rephrasing the intent",
          'supercli ask "<intent>" --json  (for flat step suggestions)',
        ],
      });
      return;
    }

    // Topologically sort steps for display
    const sortedSteps = topologicalSort(plan.steps).map((s, i) => ({
      ...s,
      order: i + 1,
      dry_run: buildDryRunCommand(s.command, s.args),
    }));

    if (humanMode) {
      console.log("\n  📋 Plan\n");
      console.log(`  Intent: ${intent}`);
      console.log(`  Summary: ${plan.summary || "(none)"}\n`);
      console.log("  Steps (topological order):");
      for (const s of sortedSteps) {
        const deps = s.depends_on && s.depends_on.length > 0 ? ` [after: ${s.depends_on.join(", ")}]` : "";
        console.log(`    ${s.order}. ${s.id}${deps}`);
        console.log(`       ${s.dry_run}`);
        if (s.verify) console.log(`       verify: ${s.verify}`);
        if (s.on_failure && s.on_failure !== "abort")
          console.log(`       on_failure: ${s.on_failure}`);
      }
      if (plan.rollback && plan.rollback.length > 0) {
        console.log("\n  Rollback:");
        for (const r of plan.rollback) {
          console.log(`    if "${r.if_failed_step}" fails: ${r.command}`);
        }
      }
      console.log("\n  Next: supercli act <plan-json>  (future) or execute steps manually");
      console.log("");
    } else {
      output({
        version: "1.0",
        mode: "plan_intent",
        llm_powered: true,
        intent,
        summary: plan.summary || "",
        steps: sortedSteps,
        rollback: plan.rollback || [],
        step_count: sortedSteps.length,
      });
    }
  } catch (err) {
    let statusCode = 0;
    let errorBody = err.message || "";

    const statusMatch = err.message?.match(/(?:Error|status)[:\s]*(\d{3})/i);
    if (statusMatch) {
      statusCode = Number(statusMatch[1]);
    }

    const errorInfo = parseLLMError(statusCode, errorBody, hasLocalLLM ? "local" : "server");
    outputError({
      code: 105,
      type: errorInfo.errorType,
      message: errorInfo.message,
      recoverable: errorInfo.statusCode >= 500 || errorInfo.statusCode === 429,
      suggestions: errorInfo.suggestions,
    });
  }
}

function parseLLMError(status, body, provider) {
  const statusCode = Number(status) || 0;
  let errorType = "unknown";
  let message = "LLM request failed.";
  let suggestions = ['supercli ask "<intent>" --json  (flat suggestions without DAG)'];

  if (statusCode === 0) {
    errorType = "network_error";
    message = "Cannot reach LLM API. Check your network connection.";
    suggestions = [
      "Verify OPENAI_BASE_URL is correct",
      "Check your network connection",
      'supercli ask "<intent>" --json  (flat suggestions without DAG)',
    ];
  } else if (statusCode === 401 || statusCode === 403) {
    errorType = "auth_error";
    message = "LLM API authentication failed. Check your API key.";
    suggestions = [
      "Verify OPENAI_API_KEY is set correctly",
      "Verify your OpenAI account billing status",
      'supercli ask "<intent>" --json  (flat suggestions without DAG)',
    ];
  } else if (statusCode === 429) {
    errorType = "rate_limit";
    message = "LLM API rate limit exceeded. Retry in a few minutes.";
    suggestions = [
      "Wait a few minutes and try again",
      "Consider setting OPENAI_MODEL to a cheaper model",
      'supercli ask "<intent>" --json  (flat suggestions without DAG)',
    ];
  } else if (statusCode >= 500) {
    errorType = "server_error";
    message = `LLM API server error (${statusCode}). Try again later.`;
    suggestions = [
      "Wait a few minutes and try again",
      'supercli ask "<intent>" --json  (flat suggestions without DAG)',
    ];
  }

  let apiMessage = "";
  try {
    const parsed = typeof body === "string" ? JSON.parse(body) : body;
    apiMessage = parsed?.error?.message || parsed?.message || "";
  } catch {
    apiMessage = body.substring(0, 200);
  }

  return {
    errorType,
    statusCode,
    provider,
    message: apiMessage ? `${message} (${apiMessage})` : message,
    suggestions,
  };
}

module.exports = { handlePlanIntentCommand };
