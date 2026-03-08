const path = require("path")

// Adapter registry — lazy-loaded
const ADAPTERS = {
  openapi: () => require("./adapters/openapi"),
  mcp: () => require("./adapters/mcp"),
  http: () => require("./adapters/http")
}

async function execute(cmd, flags, context) {
  // Workflow commands: execute steps sequentially
  if (cmd.type === "workflow" && cmd.steps && cmd.steps.length > 0) {
    return executeWorkflow(cmd, flags, context)
  }

  const adapterName = cmd.adapter

  if (!ADAPTERS[adapterName]) {
    try {
      const custom = require(path.resolve("adapters", adapterName))
      return custom.execute(cmd, flags, context)
    } catch (e) {
      throw Object.assign(new Error(`Unknown adapter: ${adapterName}`), {
        code: 110,
        type: "internal_error",
        recoverable: false
      })
    }
  }

  const adapter = ADAPTERS[adapterName]()
  return adapter.execute(cmd, flags, context)
}

async function executeWorkflow(workflow, flags, context) {
  if (!context.server) {
    throw Object.assign(new Error("Workflow commands require DCLI_SERVER"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  const results = []
  let prevOutput = null

  for (const stepRef of workflow.steps) {
    // Step format: "namespace resource action" or "namespace.resource.action"
    const parts = stepRef.includes(".") ? stepRef.split(".") : stepRef.split(" ")
    if (parts.length !== 3) {
      throw Object.assign(new Error(`Invalid workflow step: ${stepRef}`), {
        code: 85, type: "invalid_argument", recoverable: false
      })
    }

    // Resolve step command from config
    const r = await fetch(`${context.server}/api/command/${parts[0]}/${parts[1]}/${parts[2]}`)
    if (!r.ok) {
      throw Object.assign(new Error(`Workflow step command not found: ${stepRef}`), {
        code: 92, type: "resource_not_found", recoverable: false
      })
    }
    const stepCmd = await r.json()

    // Merge flags + previous output as context
    const stepFlags = { ...flags }
    if (prevOutput && typeof prevOutput === "object") {
      for (const [k, v] of Object.entries(prevOutput)) {
        if (stepFlags[k] === undefined && typeof v !== "object") {
          stepFlags[k] = v
        }
      }
    }

    const result = await execute(stepCmd, stepFlags, context)
    results.push({ step: stepRef, result })
    prevOutput = result
  }

  return { workflow: workflow.namespace + "." + workflow.resource + "." + workflow.action, steps: results }
}

module.exports = { execute }
