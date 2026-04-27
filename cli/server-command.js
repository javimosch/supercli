const fs = require("fs")
const path = require("path")

const SERVER = process.env.SUPERCLI_SERVER

function getServerUrl() {
  return SERVER ? SERVER.replace(/\/$/, "") : null
}

async function serverFetch(endpoint, options = {}) {
  const base = getServerUrl()
  if (!base) {
    throw new Error("SUPERCLI_SERVER not set. Set it to your server URL.")
  }
  const url = `${base}${endpoint}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Server error ${res.status}: ${text}`)
  }
  return res.json()
}

function readJsonFile(filePath) {
  const fullPath = path.resolve(filePath)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`)
  }
  const content = fs.readFileSync(fullPath, "utf-8")
  return JSON.parse(content)
}

function readFileBuffer(filePath) {
  const fullPath = path.resolve(filePath)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`)
  }
  return fs.readFileSync(fullPath)
}

async function handleServerCommand(options) {
  const { positional, flags, humanMode, output, outputHumanTable, outputError } = options
  const resource = positional[1]
  const action = positional[2]
  const arg = positional[3]

  if (!resource) {
    outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli server <resource> <action> [args]", recoverable: false })
    return true
  }

  if (!getServerUrl()) {
    outputError({ code: 85, type: "invalid_argument", message: "SUPERCLI_SERVER not set", recoverable: false })
    return true
  }

  try {
    switch (resource) {
      case "status":
        return await handleStatus({ humanMode, output })
      case "plugins":
        return await handlePlugins({ action, arg, flags, humanMode, output, outputHumanTable })
      case "mcp":
        return await handleMcp({ action, arg, flags, humanMode, output, outputHumanTable })
      case "commands":
        return await handleCommands({ action, arg, flags, humanMode, output, outputHumanTable })
      case "specs":
        return await handleSpecs({ action, arg, flags, humanMode, output, outputHumanTable })
      case "openapi":
        return await handleOpenapi({ action, arg, flags, humanMode, output })
      case "jobs":
        return await handleJobs({ action, flags, humanMode, output, outputHumanTable })
      case "adapters":
        return await handleAdapters({ action, arg, flags, humanMode, output, outputHumanTable, positional })
      default:
        outputError({ code: 85, type: "invalid_argument", message: `Unknown server resource: ${resource}`, recoverable: false })
        return true
    }
  } catch (err) {
    outputError({ code: 500, type: "server_error", message: err.message, recoverable: false })
    return true
  }
}

async function handleStatus({ humanMode, output }) {
  const settings = await serverFetch("/api/plugins/settings")
  const result = {
    admin_mode: settings.admin_mode_enabled === true,
    server: getServerUrl(),
    max_zip_mb: settings.max_zip_mb,
    default_hooks_policy: settings.default_hooks_policy,
  }
  if (humanMode) {
    console.log(`\n  ⚡ Server Status\n`)
    console.log(`  Server: ${result.server}`)
    console.log(`  Admin Mode: ${result.admin_mode ? "ENABLED (⚠️ CLI modifications allowed)" : "disabled"}`)
    console.log(`  Max ZIP Size: ${result.max_zip_mb}MB`)
    console.log(`  Hooks Policy: ${result.default_hooks_policy}`)
    console.log("")
  } else {
    output(result)
  }
  return true
}

async function handlePlugins({ action, arg, flags, humanMode, output, outputHumanTable }) {
  if (action === "list") {
    const data = await serverFetch("/api/plugins?format=json")
    if (humanMode) {
      console.log("\n  ⚡ Server Plugins\n")
      outputHumanTable(data.plugins, [
        { key: "name", label: "Name" },
        { key: "source_type", label: "Type" },
        { key: "enabled", label: "Enabled" },
        { key: "version", label: "Version" },
      ])
      console.log("")
    } else {
      output(data)
    }
    return true
  }

  if (action === "add") {
    let payload
    const zipPath = flags["from-zip"]
    const jsonPath = flags["from-json"]

    if (zipPath) {
      const buffer = readFileBuffer(zipPath)
      const base64 = buffer.toString("base64")
      const manifest = flags.manifest ? JSON.parse(flags.manifest) : {}
      payload = {
        source_type: "zip",
        name: manifest.name || path.basename(zipPath, ".zip"),
        version: manifest.version || "0.1.0",
        manifest,
        archive_base64: base64,
      }
    } else if (jsonPath) {
      payload = readJsonFile(jsonPath)
      payload.source_type = "json"
    } else if (arg) {
      payload = JSON.parse(arg)
      payload.source_type = payload.source_type || "json"
    } else {
      throw new Error("Usage: supercli server plugins add '{json}' or --from-json <path> or --from-zip <path> --manifest '{json}'")
    }

    const result = await serverFetch("/api/plugins", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  if (action === "remove") {
    if (!arg) {
      throw new Error("Usage: supercli server plugins remove <name>")
    }
    const result = await serverFetch(`/api/plugins/${encodeURIComponent(arg)}`, {
      method: "DELETE",
    })
    output(result)
    return true
  }

  throw new Error(`Unknown plugins action: ${action}. Use: list, add, remove`)
}

async function handleMcp({ action, arg, flags, humanMode, output, outputHumanTable }) {
  if (action === "list") {
    const servers = await serverFetch("/api/mcp?format=json")
    if (humanMode) {
      console.log("\n  ⚡ MCP Servers\n")
      outputHumanTable(servers, [
        { key: "name", label: "Name" },
        { key: "url", label: "URL" },
        { key: "command", label: "Command" },
      ])
      console.log("")
    } else {
      output({ servers })
    }
    return true
  }

  if (action === "add") {
    let payload
    if (flags["from-json"]) {
      payload = readJsonFile(flags["from-json"])
    } else if (arg) {
      payload = JSON.parse(arg)
    } else {
      throw new Error("Usage: supercli server mcp add '{json}' or --from-json <path>")
    }

    const result = await serverFetch("/api/mcp", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  if (action === "remove") {
    if (!arg) {
      throw new Error("Usage: supercli server mcp remove <name>")
    }
    const result = await serverFetch(`/api/mcp/${encodeURIComponent(arg)}`, {
      method: "DELETE",
    })
    output(result)
    return true
  }

  throw new Error(`Unknown mcp action: ${action}. Use: list, add, remove`)
}

async function handleCommands({ action, arg, flags, humanMode, output, outputHumanTable }) {
  if (action === "list") {
    const commands = await serverFetch("/api/commands?format=json")
    if (humanMode) {
      console.log("\n  ⚡ Server Commands\n")
      outputHumanTable(commands.map(c => ({
        id: c._id,
        namespace: c.namespace,
        resource: c.resource,
        action: c.action,
        adapter: c.adapter,
      })), [
        { key: "id", label: "ID" },
        { key: "namespace", label: "NS" },
        { key: "resource", label: "Resource" },
        { key: "action", label: "Action" },
        { key: "adapter", label: "Adapter" },
      ])
      console.log("")
    } else {
      output({ commands })
    }
    return true
  }

  if (action === "add") {
    let payload
    if (flags["from-json"]) {
      payload = readJsonFile(flags["from-json"])
    } else if (arg) {
      payload = JSON.parse(arg)
    } else {
      throw new Error("Usage: supercli server commands add '{json}' or --from-json <path>")
    }

    const result = await serverFetch("/api/commands", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  if (action === "remove") {
    if (!arg) {
      throw new Error("Usage: supercli server commands remove <namespace.resource.action>")
    }
    const id = arg.startsWith("command:") ? arg : `command:${arg}`
    const result = await serverFetch(`/api/commands/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
    output(result)
    return true
  }

  throw new Error(`Unknown commands action: ${action}. Use: list, add, remove`)
}

async function handleSpecs({ action, arg, flags, humanMode, output, outputHumanTable }) {
  if (action === "list") {
    const specs = await serverFetch("/api/specs?format=json")
    if (humanMode) {
      console.log("\n  ⚡ OpenAPI Specs\n")
      outputHumanTable(specs, [
        { key: "name", label: "Name" },
        { key: "url", label: "URL" },
        { key: "auth", label: "Auth" },
      ])
      console.log("")
    } else {
      output({ specs })
    }
    return true
  }

  if (action === "add") {
    let payload
    if (flags["from-json"]) {
      payload = readJsonFile(flags["from-json"])
    } else if (arg) {
      payload = JSON.parse(arg)
    } else {
      throw new Error("Usage: supercli server specs add '{json}' or --from-json <path>")
    }

    const result = await serverFetch("/api/specs", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  if (action === "remove") {
    if (!arg) {
      throw new Error("Usage: supercli server specs remove <name>")
    }
    const id = arg.startsWith("spec:") ? arg : `spec:${arg}`
    const result = await serverFetch(`/api/specs/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
    output(result)
    return true
  }

  throw new Error(`Unknown specs action: ${action}. Use: list, add, remove`)
}

async function handleOpenapi({ action, arg, flags, humanMode, output }) {
  // OpenAPI specs are managed via specs endpoint
  if (action === "add") {
    let payload
    if (flags["from-json"]) {
      payload = readJsonFile(flags["from-json"])
    } else if (arg) {
      payload = JSON.parse(arg)
    } else {
      throw new Error("Usage: supercli server openapi add '{json}' or --from-json <path>")
    }

    const result = await serverFetch("/api/specs", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  throw new Error(`Unknown openapi action: ${action}. Use: add`)
}

async function handleJobs({ action, flags, humanMode, output, outputHumanTable }) {
  if (action === "list") {
    const jobs = await serverFetch("/api/jobs?format=json")
    if (humanMode) {
      console.log("\n  ⚡ Jobs\n")
      outputHumanTable(jobs.slice(0, 20).map(j => ({
        id: j._id,
        command: j.command,
        status: j.status,
        timestamp: j.timestamp,
      })), [
        { key: "id", label: "ID" },
        { key: "command", label: "Command" },
        { key: "status", label: "Status" },
        { key: "timestamp", label: "Timestamp" },
      ])
      console.log("")
    } else {
      output({ jobs })
    }
    return true
  }

  if (action === "prune") {
    const days = parseInt(flags["older-than"]) || 7
    const result = await serverFetch(`/api/jobs?older_than=${days}`, {
      method: "DELETE",
    })
    if (humanMode) {
      console.log(`\n  Pruned ${result.pruned} jobs older than ${result.older_than_days} days\n`)
    } else {
      output(result)
    }
    return true
  }

  throw new Error(`Unknown jobs action: ${action}. Use: list, prune`)
}

async function handleAdapters({ action, arg, flags, humanMode, output, outputHumanTable, positional }) {
  if (action === "list") {
    const data = await serverFetch("/api/adapters?format=json")
    if (humanMode) {
      console.log("\n  ⚡ Adapters\n")
      outputHumanTable(data.adapters, [
        { key: "name", label: "Name" },
        { key: "execution_context", label: "Context" },
        { key: "timeout_ms", label: "Timeout" },
        { key: "allow_network", label: "Network" },
      ])
      console.log("")
    } else {
      output(data)
    }
    return true
  }

  if (action === "add") {
    let payload
    const jsonPath = flags["from-file"]
    const sourcePath = flags["source-file"]
    const jsonData = positional[3]

    if (jsonPath) {
      payload = readJsonFile(jsonPath)
      if (sourcePath) {
        payload.source = fs.readFileSync(path.resolve(sourcePath), "utf-8")
      }
    } else if (sourcePath) {
      if (!jsonData) {
        throw new Error("Usage: supercli server adapters add '{metadata}' --source-file <path>")
      }
      payload = JSON.parse(jsonData)
      payload.source = fs.readFileSync(path.resolve(sourcePath), "utf-8")
    } else if (flags["from-stdin"]) {
      let stdinData = ""
      for await (const chunk of process.stdin) {
        stdinData += chunk
      }
      payload = JSON.parse(stdinData)
    } else if (jsonData) {
      payload = JSON.parse(jsonData)
    } else {
      throw new Error("Usage: supercli server adapters add '{json}' or --from-file <path> or --source-file <path>")
    }

    if (!payload.name || !payload.source) {
      throw new Error("Adapter requires 'name' and 'source' fields")
    }

    const result = await serverFetch("/api/adapters", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  if (action === "remove") {
    const adapterName = positional[3]
    if (!adapterName) {
      throw new Error("Usage: supercli server adapters remove <name>")
    }
    const result = await serverFetch(`/api/adapters/${encodeURIComponent(adapterName)}`, {
      method: "DELETE",
    })
    output(result)
    return true
  }

  if (action === "update") {
    const adapterName = positional[3]
    const updateData = positional[4]
    if (!adapterName) {
      throw new Error("Usage: supercli server adapters update <name> '{json}' or --from-file <path>")
    }
    let payload
    const jsonPath = flags["from-file"]
    const sourcePath = flags["source-file"]

    if (jsonPath) {
      payload = readJsonFile(jsonPath)
      if (sourcePath) {
        payload.source = fs.readFileSync(path.resolve(sourcePath), "utf-8")
      }
    } else if (sourcePath) {
      payload = JSON.parse(updateData || "{}")
      payload.source = fs.readFileSync(path.resolve(sourcePath), "utf-8")
    } else if (flags["from-stdin"]) {
      let stdinData = ""
      for await (const chunk of process.stdin) {
        stdinData += chunk
      }
      payload = JSON.parse(stdinData)
    } else {
      payload = JSON.parse(updateData || "{}")
    }

    const result = await serverFetch(`/api/adapters/${encodeURIComponent(adapterName)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
    output(result)
    return true
  }

  if (action === "packages") {
    const packageAction = arg
    const targetAdapterName = positional[4]

    if (!targetAdapterName) {
      throw new Error("Usage: supercli server adapters packages <list|add|remove> <name>")
    }

    if (packageAction === "list") {
      const data = await serverFetch(`/api/adapters/${encodeURIComponent(targetAdapterName)}/packages?format=json`)
      if (humanMode) {
        console.log(`\n  ⚡ Packages for ${targetAdapterName}\n`)
        outputHumanTable(data.packages || [], [
          { key: "package", label: "Package" },
          { key: "version", label: "Version" },
        ])
        console.log("")
      } else {
        output(data)
      }
      return true
    }

    if (packageAction === "add") {
      const packageName = flags.package
      const version = flags.version
      if (!packageName) {
        throw new Error("Usage: supercli server adapters packages add <name> --package <pkg> --version <ver>")
      }
      const result = await serverFetch(`/api/adapters/${encodeURIComponent(targetAdapterName)}/packages`, {
        method: "POST",
        body: JSON.stringify({ package: packageName, version }),
      })
      output(result)
      return true
    }

    if (packageAction === "remove") {
      const packageName = flags.package
      if (!packageName) {
        throw new Error("Usage: supercli server adapters packages remove <name> --package <pkg>")
      }
      const result = await serverFetch(`/api/adapters/${encodeURIComponent(targetAdapterName)}/packages/${encodeURIComponent(packageName)}`, {
        method: "DELETE",
      })
      output(result)
      return true
    }

    throw new Error(`Unknown packages action: ${packageAction}. Use: list, add, remove`)
  }

  throw new Error(`Unknown adapters action: ${action}. Use: list, add, remove, update, packages`)
}

module.exports = { handleServerCommand }
