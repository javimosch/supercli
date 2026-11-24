"use strict"

const { getClientId } = require("./config-core")
const {
  getServerUrl, serverFetch,
  handlePlugins, handleMcp, handleCommands, handleSpecs, handleOpenapi, handleJobs, handleAdapters,
} = require("./server-resources")

const API_KEY = process.env.SUPERCLI_API_KEY

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
  const [settings, index] = await Promise.all([
    serverFetch("/api/settings?format=json"),
    serverFetch("/api").catch(() => null), // older hubs lack the self-index
  ])
  const result = {
    reachable: true,
    server: getServerUrl(),
    hub: index ? index.name : null,
    auth_required: index ? index.auth.required : "unknown",
    dashboard: index ? `${getServerUrl()}${index.dashboard}` : null,
    admin_mode: settings.admin_mode_enabled === true,
    max_zip_mb: settings.max_zip_mb,
    default_hooks_policy: settings.default_hooks_policy,
    client_id: getClientId(),
  }
  if (humanMode) {
    console.log(`\n  ⚡ Server Status\n`)
    console.log(`  Server: ${result.server} (reachable)`)
    console.log(`  Auth: ${result.auth_required === false ? "open" : `X-API-Key${API_KEY ? " (key set)" : " (⚠️ no SUPERCLI_API_KEY set)"}`}`)
    console.log(`  Admin Mode: ${result.admin_mode ? "ENABLED (⚠️ CLI modifications allowed)" : "disabled"}`)
    console.log(`  Max ZIP Size: ${result.max_zip_mb}MB`)
    console.log(`  Hooks Policy: ${result.default_hooks_policy}`)
    console.log("")
  } else {
    output(result)
  }
  return true
}


module.exports = { handleServerCommand }
