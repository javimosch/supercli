const { execute } = require("./executor")

async function localLLMCompletion(query, config, baseUrl, model, apiKey) {
  const namespaces = [...new Set(config.commands.map(c => c.namespace))]
  const allDefs = []
  
  for (const ns of namespaces) {
    const resources = [...new Set(config.commands.filter(c => c.namespace === ns).map(c => c.resource))]
    for (const res of resources) {
      const actions = config.commands.filter(c => c.namespace === ns && c.resource === res).map(c => c.action)
      for (const act of actions) {
        const cmd = config.commands.find(c => c.namespace === ns && c.resource === res && c.action === act)
        if (!cmd) continue
        const argList = (cmd.args || []).map(a => `--${a.name}${a.required ? " (required)" : ""}`).join(" ")
        allDefs.push(`- ${ns} ${res} ${act} ${argList} : ${cmd.description || "no desc"}`)
      }
    }
  }

  const systemPrompt = `You are an AI CLI assistant router.
Available commands:
${allDefs.join("\n")}

The user wants to accomplish a goal. Map their goal into a sequence of CLI commands to run.
Respond STRICTLY with a valid JSON array of steps. For example:
[
  { "command": "aws.instances.list", "args": { "region": "us-east-1" } },
  { "command": "ai.summarize.text", "args": { "text": "{{step.0.data.summary}}" } }
]
Do not wrap it in markdown. Do not include any other text.`

  const r = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0
    })
  })

  if (!r.ok) {
    const txt = await r.text()
    throw new Error(`Local LLM Error ${r.status}: ${txt}`)
  }

  const data = await r.json()
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
  if (!content) throw new Error("Invalid response format from local LLM")
  
  let jsonStr = content.trim()
  if (jsonStr.startsWith("```json")) jsonStr = jsonStr.replace(/^```json/, "").replace(/```$/, "").trim()
  else if (jsonStr.startsWith("```")) jsonStr = jsonStr.replace(/^```/, "").replace(/```$/, "").trim()

  const steps = JSON.parse(jsonStr)
  if (!Array.isArray(steps)) throw new Error("LLM did not return a JSON array")
  return steps
}

async function remoteLLMCompletion(query, serverUrl) {
  const r = await fetch(`${serverUrl}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  })

  if (!r.ok) {
    const errorBody = await r.json().catch(() => ({}))
    throw new Error(`Server LLM completion failed: ${errorBody.error || r.statusText}`)
  }

  const data = await r.json()
  return data.steps
}

async function handleAskCommand({ positional, config, context, humanMode, output, outputError }) {
  if (positional.length < 2) {
    outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli ask \"<your natural language query>\"", recoverable: false })
    return
  }

  const query = positional.slice(1).join(" ")
  const hasLocalLLM = !!process.env.OPENAI_BASE_URL
  const hasServerLLM = context.server && config.features && config.features.ask

  if (!hasLocalLLM && !hasServerLLM) {
    outputError({
      code: 105,
      type: "integration_error",
      message: "The 'ask' feature is not configured. Export OPENAI_BASE_URL locally or ensure the DCLI_SERVER has it configured.",
      recoverable: false
    })
    return
  }

  if (humanMode) {
    console.log(`\n  🤖 Thinking... (${hasLocalLLM ? "local" : "server"} resolution)`)
  }

  try {
    let steps = []
    if (hasLocalLLM) {
      steps = await localLLMCompletion(
        query,
        config,
        process.env.OPENAI_BASE_URL,
        process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        process.env.OPENAI_API_KEY || "dummy"
      )
    } else {
      steps = await remoteLLMCompletion(query, context.server)
    }

    if (humanMode) {
      console.log(`  📋 Plan:`)
      steps.forEach((s, i) => {
        const argStr = Object.entries(s.args || {}).map(([k, v]) => `--${k}="${v}"`).join(" ")
        console.log(`    ${i + 1}. ${s.command.replace(/\./g, " ")} ${argStr}`)
      })
      console.log(`\n  ▶ Executing...`)
    }

    // Map to a virtual workflow command and execute
    const virtualCommand = {
      namespace: "system",
      resource: "ai",
      action: "ask",
      type: "workflow",
      adapterConfig: { steps }
    }

    const start = Date.now()
    const result = await execute(virtualCommand, {}, context)
    const duration = Date.now() - start

    const envelope = {
      version: "1.0",
      command: "ask",
      duration_ms: duration,
      data: result
    }

    if (!humanMode) {
      output(envelope)
    } else {
      console.log(`\n  ✅ Success (${duration}ms)\n`)
      console.log(JSON.stringify(envelope.data, null, 2))
      console.log("")
    }

  } catch (err) {
    outputError({ code: 105, type: "integration_error", message: err.message, recoverable: true })
  }
}

module.exports = { handleAskCommand }
