const { Router } = require("express")
const configService = require("../services/configService")

const router = Router()

router.post("/", async (req, res) => {
  const { query } = req.body
  if (!query) return res.status(400).json({ error: "Missing query parameter" })

  const baseUrl = process.env.OPENAI_BASE_URL
  const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
  const apiKey = process.env.OPENAI_API_KEY || "dummy"

  if (!baseUrl) {
    return res.status(501).json({ error: "Server is not configured for LLM completions (OPENAI_BASE_URL is missing)" })
  }

  try {
    const namespaces = await configService.getNamespaces()
    const allDefs = []
    
    // Build a compact representation of all CLI commands
    for (const ns of namespaces) {
      const resources = await configService.getResources(ns)
      for (const res of resources) {
        const actions = await configService.getActions(ns, res)
        for (const act of actions) {
          const cmd = await configService.getCommand(ns, res, act)
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
      throw new Error(`LLM Error ${r.status}: ${txt}`)
    }

    const data = await r.json()
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
    if (!content) throw new Error("Invalid response format from LLM")
    
    // Attempt to extract JSON if the model ignored instructions and wrapped in markdown
    let jsonStr = content.trim()
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.replace(/^```json/, "").replace(/```$/, "").trim()
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```/, "").replace(/```$/, "").trim()
    }

    const steps = JSON.parse(jsonStr)
    if (!Array.isArray(steps)) {
      throw new Error("LLM did not return a JSON array")
    }

    res.json({ steps })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
