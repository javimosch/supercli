const path = require("path")

// Adapter registry — lazy-loaded
const ADAPTERS = {
  openapi: () => require("./adapters/openapi"),
  mcp: () => require("./adapters/mcp"),
  http: () => require("./adapters/http")
}

async function execute(cmd, flags, context) {
  // Workflow commands: execute steps sequentially
  const steps = cmd.type === "workflow" ? (cmd.steps || (cmd.adapterConfig && cmd.adapterConfig.steps) || []) : null
  if (cmd.type === "workflow" && steps && steps.length > 0) {
    return executeWorkflow(cmd, flags, context, steps)
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

async function executeWorkflow(workflow, flags, context, steps) {
  const results = []
  let prevOutput = null

  for (const stepDef of steps) {
    let stepCommandString = ""
    let stepArgs = {}

    if (typeof stepDef === "string") {
      stepCommandString = stepDef
    } else if (typeof stepDef === "object") {
      stepCommandString = stepDef.command
      stepArgs = stepDef.args || {}
    }

    let parts = stepCommandString.includes(".") ? stepCommandString.split(".") : stepCommandString.split(" ")
    parts = parts.filter(p => !p.startsWith("-"))
    if (parts.length < 3) {
      throw Object.assign(new Error(`Invalid workflow step: ${stepCommandString}`), {
        code: 85, type: "invalid_argument", recoverable: false
      })
    }
    const [ns, resource, action] = parts

    let stepCmd = null
    if (context.config && Array.isArray(context.config.commands)) {
      stepCmd = context.config.commands.find(c => c.namespace === ns && c.resource === resource && c.action === action)
    }

    if (!stepCmd) {
      if (!context.server) {
        throw Object.assign(new Error(`Workflow step command not found in local config and server is unavailable: ${stepCommandString}`), {
          code: 92, type: "resource_not_found", recoverable: false
        })
      }
      const r = await fetch(`${context.server}/api/command/${ns}/${resource}/${action}`)
      if (!r.ok) {
        throw Object.assign(new Error(`Workflow step command not found: ${stepCommandString}`), {
          code: 92, type: "resource_not_found", recoverable: false
        })
      }
      stepCmd = await r.json()
    }

    // Merge flags + explicit step args + previous output as context
    const mergedFlags = { ...flags, ...stepArgs }
    if (prevOutput && typeof prevOutput === "object") {
      for (const [k, v] of Object.entries(prevOutput)) {
        if (mergedFlags[k] === undefined && typeof v !== "object") {
          mergedFlags[k] = v
        }
      }
    }

    // Note: Template replacement (e.g. "{{step.0.data.summary}}") handling should ideally be done here.
    // For simplicity, doing a basic string replace for known vars on string arguments.
    for (const [k, v] of Object.entries(mergedFlags)) {
      if (typeof v === "string") {
        mergedFlags[k] = v.replace(/\{\{args\.([^}]+)\}\}/g, (_, path) => flags[path] || "")
        mergedFlags[k] = mergedFlags[k].replace(/\{\{step\.(\d+)\.([^}]+)\}\}/g, (_, idx, path) => {
          const res = results[Number(idx)]
          if (!res) return ""
          // Simple dot path resolution for data...
          let val = res
          for (const p of path.split(".")) {
            if (val && typeof val === "object") val = val[p]
            else { val = ""; break; }
          }
          return val || ""
        })
      }
    }

    const result = await module.exports.execute(stepCmd, mergedFlags, context)
    results.push({ step: stepCommandString, result })
    prevOutput = result
  }

  return { workflow: workflow.namespace + "." + workflow.resource + "." + workflow.action, steps: results }
}

module.exports = { execute }
