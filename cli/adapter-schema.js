const SUPPORTED_ADAPTERS = ["http", "openapi", "mcp", "process", "builtin", "shell"]

function asInvalid(message, suggestions = []) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
    suggestions
  })
}

function assertType(value, expected, field) {
  if (value === undefined || value === null) return
  if (typeof value !== expected) throw asInvalid(`adapterConfig.${field} must be ${expected}`)
}

function validateCommonConfig(adapterName, config) {
  if (!config || typeof config !== "object") throw asInvalid(`Adapter '${adapterName}' requires adapterConfig object`)

  assertType(config.parseJson, "boolean", "parseJson")
  assertType(config.unsafe, "boolean", "unsafe")
  assertType(config.non_interactive, "boolean", "non_interactive")
  assertType(config.cwd, "string", "cwd")

  if (config.non_interactive === false) {
    throw asInvalid("Interactive command execution is not supported. Set adapterConfig.non_interactive=true or remove it.")
  }

  if (config.timeout_ms !== undefined) {
    if (typeof config.timeout_ms !== "number" || Number.isNaN(config.timeout_ms) || config.timeout_ms <= 0) {
      throw asInvalid("adapterConfig.timeout_ms must be a positive number")
    }
    if (config.timeout_ms > 15000) {
      throw asInvalid("adapterConfig.timeout_ms cannot exceed 15000ms")
    }
  }
}

function validateAdapterConfig(cmd) {
  const adapterName = cmd.adapter
  if (!SUPPORTED_ADAPTERS.includes(adapterName)) return

  const config = cmd.adapterConfig || {}
  validateCommonConfig(adapterName, config)

  if (adapterName === "http") {
    if (!config.url || typeof config.url !== "string") throw asInvalid("HTTP adapter requires adapterConfig.url")
    if (config.method !== undefined && typeof config.method !== "string") throw asInvalid("adapterConfig.method must be string")
    return
  }

  if (adapterName === "openapi") {
    if (!config.spec || typeof config.spec !== "string") throw asInvalid("OpenAPI adapter requires adapterConfig.spec")
    if (!config.operationId || typeof config.operationId !== "string") throw asInvalid("OpenAPI adapter requires adapterConfig.operationId")
    return
  }

  if (adapterName === "mcp") {
    if (!config.tool || typeof config.tool !== "string") throw asInvalid("MCP adapter requires adapterConfig.tool")
    const sources = [config.server, config.url, config.command].filter(Boolean)
    if (sources.length === 0) throw asInvalid("MCP adapter requires one source: adapterConfig.server, adapterConfig.url, or adapterConfig.command")
    return
  }

  if (adapterName === "process") {
    if (!config.command || typeof config.command !== "string") throw asInvalid("Process adapter requires adapterConfig.command")
    if (config.baseArgs !== undefined && !Array.isArray(config.baseArgs)) throw asInvalid("adapterConfig.baseArgs must be an array")
    if (config.positionalArgs !== undefined && !Array.isArray(config.positionalArgs)) throw asInvalid("adapterConfig.positionalArgs must be an array")
    if (config.passthrough !== undefined && typeof config.passthrough !== "boolean") throw asInvalid("adapterConfig.passthrough must be boolean")
    if (config.missingDependencyHelp !== undefined && typeof config.missingDependencyHelp !== "string") throw asInvalid("adapterConfig.missingDependencyHelp must be string")
    if (config.env !== undefined && (typeof config.env !== "object" || Array.isArray(config.env))) throw asInvalid("adapterConfig.env must be object")
    return
  }

  if (adapterName === "builtin") {
    if (!config.builtin || typeof config.builtin !== "string") throw asInvalid("Builtin adapter requires adapterConfig.builtin")
    return
  }

  if (adapterName === "shell") {
    if (config.unsafe !== true) {
      throw asInvalid("Shell adapter requires adapterConfig.unsafe=true")
    }
    if (!config.script || typeof config.script !== "string") throw asInvalid("Shell adapter requires adapterConfig.script")
    if (config.shell !== undefined && typeof config.shell !== "string") throw asInvalid("adapterConfig.shell must be string")
    if (config.env !== undefined && (typeof config.env !== "object" || Array.isArray(config.env))) throw asInvalid("adapterConfig.env must be object")
    return
  }
}

module.exports = {
  SUPPORTED_ADAPTERS,
  validateAdapterConfig
}
