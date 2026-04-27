const path = require("path")
const fs = require("fs")
const { NodeVM } = require("vm2")
const { validateAdapterConfig } = require("./adapter-schema")

// Adapter registry — lazy-loaded
const ADAPTERS = {
  openapi: () => require("./adapters/openapi"),
  mcp: () => require("./adapters/mcp"),
  http: () => require("./adapters/http"),
  process: () => require("./adapters/process"),
  shell: () => require("./adapters/shell")
}

async function execute(cmd, flags, context) {
  // Workflow commands: execute steps sequentially
  const steps = cmd.type === "workflow" ? (cmd.steps || (cmd.adapterConfig && cmd.adapterConfig.steps) || []) : null
  if (cmd.type === "workflow" && steps && steps.length > 0) {
    return executeWorkflow(cmd, flags, context, steps)
  }

  const adapterName = cmd.adapter
  validateAdapterConfig(cmd)

  if (!ADAPTERS[adapterName]) {
    return executeCustomAdapter(adapterName, cmd, flags, context)
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

async function executeCustomAdapter(adapterName, cmd, flags, context) {
  // Check if adapter exists in local .supercli/adapters/ directory
  const localAdapterPath = path.join(process.cwd(), ".supercli", "adapters", `${adapterName}.js`)
  
  if (fs.existsSync(localAdapterPath)) {
    // Execute locally using vm2
    return executeLocalAdapter(localAdapterPath, cmd, flags, context)
  }
  
  // If server is available, delegate to server
  if (context.server) {
    const res = await fetch(`${context.server}/api/adapters/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd, flags })
    })
    
    if (!res.ok) {
      const err = await res.json()
      const errorMessage = err.error?.message || err.error || `Adapter '${adapterName}' execution failed`
      throw Object.assign(new Error(errorMessage), {
        code: err.error?.code || 110,
        type: err.error?.type || "internal_error",
        recoverable: err.error?.recoverable || false
      })
    }
    
    return res.json()
  }
  
  throw Object.assign(new Error(`Adapter '${adapterName}' not found locally and server is unavailable`), {
    code: 110,
    type: "internal_error",
    recoverable: false
  })
}

async function executeLocalAdapter(adapterPath, cmd, flags, context) {
  const source = fs.readFileSync(adapterPath, "utf-8")
  
  // Extract metadata from adapter (first comment block if exists)
  const metadataMatch = source.match(/\/\*\*?\s*\n([\s\S]*?)\n\s*\*\//)
  const metadata = {}
  if (metadataMatch) {
    const metaText = metadataMatch[1]
    const timeoutMatch = metaText.match(/@timeout\s+(\d+)/)
    const memoryMatch = metaText.match(/@memory\s+(\d+)/)
    const networkMatch = metaText.match(/@network\s+(true|false)/)
    if (timeoutMatch) metadata.timeout = parseInt(timeoutMatch[1])
    if (memoryMatch) metadata.memory = parseInt(memoryMatch[1])
    if (networkMatch) metadata.network = networkMatch[1] === "true"
  }
  
  const vm = new NodeVM({
    timeout: metadata.timeout || 30000,
    sandbox: {
      console: {
        log: (...args) => {},
        error: (...args) => {},
        warn: (...args) => {},
      },
    },
    require: {
      external: metadata.network !== false,
      root: path.dirname(adapterPath),
    },
    memoryLimit: (metadata.memory || 128) * 1024 * 1024,
  })
  
  const script = `
    ${source}
    module.exports = { execute }
  `
  
  const fn = vm.run(script, adapterPath)
  
  if (typeof fn.execute !== "function") {
    throw Object.assign(new Error(`Adapter must export an 'execute' function`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }
  
  return fn.execute(cmd, flags, context)
}

module.exports = { execute }
