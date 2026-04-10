async function localLLMCompletion(query, config, baseUrl, model, apiKey) {
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

  const systemPrompt = `You are an AI CLI assistant router.
Available commands:
${allDefs.join("\n")}

The user wants to accomplish a goal. Map their goal into a sequence of CLI commands to run.
Respond STRICTLY with a valid JSON array of steps. For example:
[
  { "command": "resend.emails.send", "args": { "from": "user@example.com", "to": "recipient@example.com", "subject": "Hello", "text": "Message body" } }
]
Do not wrap it in markdown. Do not include any other text.`;

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
        { role: "user", content: query },
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

  const steps = JSON.parse(jsonStr);
  if (!Array.isArray(steps)) throw new Error("LLM did not return a JSON array");
  return steps;
}

async function remoteLLMCompletion(query, serverUrl) {
  const r = await fetch(`${serverUrl}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!r.ok) {
    const errorBody = await r.json().catch(() => ({}));
    throw new Error(
      `Server LLM completion failed: ${errorBody.error || r.statusText}`,
    );
  }

  const data = await r.json();
  return data.steps;
}

function parseLLMError(status, body, provider) {
  const statusCode = Number(status) || 0;
  let errorType = "unknown";
  let message = "LLM request failed.";
  let suggestions = ['supercli discover --intent "<task>" --json'];

  if (statusCode === 0) {
    errorType = "network_error";
    message = "Cannot reach LLM API. Check your network connection.";
    suggestions = [
      "Verify OPENAI_BASE_URL is correct",
      "Check your network connection",
      "Try: curl $OPENAI_BASE_URL to test connectivity",
      'supercli discover --intent "<task>" --json',
    ];
  } else if (statusCode === 401 || statusCode === 403) {
    errorType = "auth_error";
    message = "LLM API authentication failed. Check your API key.";
    suggestions = [
      "Verify OPENAI_API_KEY is set correctly",
      "Check: echo $OPENAI_API_KEY",
      "Verify your OpenAI account billing status",
      "Try: export OPENAI_API_KEY=sk-...",
      'supercli discover --intent "<task>" --json',
    ];
  } else if (statusCode === 429) {
    errorType = "rate_limit";
    message = "LLM API rate limit exceeded. Retry in a few minutes.";
    suggestions = [
      "Wait a few minutes and try again",
      "Check OpenAI usage dashboard",
      "Consider setting OPENAI_MODEL to a cheaper model",
      'supercli discover --intent "<task>" --json',
    ];
  } else if (statusCode >= 500) {
    errorType = "server_error";
    message = `LLM API server error (${statusCode}). Try again later.`;
    suggestions = [
      "Wait a few minutes and try again",
      "Check OpenAI status page",
      'supercli discover --intent "<task>" --json',
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
    message,
    apiMessage,
    suggestions,
  };
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

function formatSuggestions(steps, config) {
  const suggested_steps = [];
  const seenCommands = new Set();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const cmdStr = step.command || "";
    const parts = cmdStr.split(".");
    const ns = parts[0];
    const res = parts[1];
    const act = parts[2];

    const cmd = config.commands.find(
      (c) => c.namespace === ns && c.resource === res && c.action === act,
    );

    suggested_steps.push({
      step: i + 1,
      command: cmdStr,
      description: cmd?.description || "",
      args: step.args || {},
      dry_run: buildDryRunCommand(cmdStr, step.args),
    });

    if (cmdStr) seenCommands.add(cmdStr.split(".")[0]);
  }

  const next_steps = [];
  for (const ns of seenCommands) {
    next_steps.push(`supercli plugins learn ${ns} --json`);
    next_steps.push(`supercli inspect ${ns} --json`);
  }
  next_steps.push("supercli discover --intent \"<task>\" --json");

  return { suggested_steps, next_steps };
}

async function handleAskCommand({
  positional,
  config,
  context,
  humanMode,
  output,
  outputError,
}) {
  if (positional.length < 2) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: 'Usage: supercli ask "<your natural language query>"',
      recoverable: false,
    });
    return;
  }

  const query = positional.slice(1).join(" ");
  const hasLocalLLM = !!process.env.OPENAI_BASE_URL;
  const hasServerLLM = context.server && config.features && config.features.ask;

  if (!hasLocalLLM && !hasServerLLM) {
    outputError({
      code: 105,
      type: "integration_error",
      message: "The 'ask' feature requires LLM configuration. Export OPENAI_BASE_URL locally or ensure SUPERCLI_SERVER has it configured.",
      recoverable: false,
      suggestions: [
        "Export OPENAI_BASE_URL for local LLM",
        "Export SUPERCLI_SERVER for server-side LLM",
        'supercli discover --intent "<task>" --json',
      ],
    });
    return;
  }

  try {
    let steps = [];
    if (hasLocalLLM) {
      steps = await localLLMCompletion(
        query,
        config,
        process.env.OPENAI_BASE_URL,
        process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        process.env.OPENAI_API_KEY || "dummy",
      );
    } else {
      steps = await remoteLLMCompletion(query, context.server);
    }

    const { suggested_steps, next_steps } = formatSuggestions(steps, config);

    if (humanMode) {
      console.log("\n  ⚡ Ask\n");
      console.log(`  Query: ${query}\n`);
      console.log("  Suggested Steps:");
      for (const s of suggested_steps) {
        console.log(`    ${s.step}. ${s.command}`);
        console.log(`       ${s.dry_run}`);
      }
      console.log("\n  Next Steps:");
      for (const ns of next_steps) {
        console.log(`    → ${ns}`);
      }
      console.log("");
    } else {
      output({
        version: "1.0",
        mode: "ask_suggest",
        llm_powered: true,
        query,
        suggested_steps,
        next_steps,
      });
    }
  } catch (err) {
    let statusCode = 0;
    let errorBody = err.message || "";

    const statusMatch = err.message?.match(/(?:Error|status)[:\s]*(\d{3})/i);
    if (statusMatch) {
      statusCode = Number(statusMatch[1]);
      errorBody = err.message.replace(/Local LLM Error \d{3}:\s*/, "").trim();
    }

    const llmError = parseLLMError(statusCode, errorBody, hasLocalLLM ? "openai" : "server");
    const recoverable = ["rate_limit", "server_error", "network_error"].includes(llmError.errorType);

    outputError({
      code: 105,
      type: "integration_error",
      message: llmError.message,
      recoverable,
      details: {
        error_type: llmError.errorType,
        status_code: llmError.statusCode,
        provider: llmError.provider,
        api_message: llmError.apiMessage.substring(0, 200),
      },
      suggestions: llmError.suggestions,
    });
  }
}

module.exports = { handleAskCommand };
