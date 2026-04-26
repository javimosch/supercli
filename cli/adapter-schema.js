const SUPPORTED_ADAPTERS = ["http", "openapi", "mcp", "process", "shell"]

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
  assertType(config.safetyLevel, "string", "safetyLevel")
  assertType(config.stream, "string", "stream")
  if (config.interactiveFlags !== undefined && !Array.isArray(config.interactiveFlags)) {
    throw asInvalid("adapterConfig.interactiveFlags must be an array")
  }
  assertType(config.requiresInteractive, "boolean", "requiresInteractive")

  if (config.non_interactive === false) {
    throw asInvalid("Interactive command execution is not supported. Set adapterConfig.non_interactive=true or remove it.")
  }

  if (config.timeout_ms !== undefined) {
    if (typeof config.timeout_ms !== "number" || Number.isNaN(config.timeout_ms) || config.timeout_ms <= 0) {
      throw asInvalid("adapterConfig.timeout_ms must be a positive number")
    }
    const maxTimeoutMs = ["mcp", "process", "shell"].includes(adapterName) ? 180000 : 15000
    if (config.timeout_ms > maxTimeoutMs) {
      throw asInvalid(`adapterConfig.timeout_ms cannot exceed ${maxTimeoutMs}ms`)
    }
  }

  if (config.stream !== undefined && !["jsonl"].includes(config.stream)) {
    throw asInvalid("adapterConfig.stream must be 'jsonl'")
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
    if (config.server !== undefined && typeof config.server !== "string") throw asInvalid("adapterConfig.server must be string")
    if (config.url !== undefined && typeof config.url !== "string") throw asInvalid("adapterConfig.url must be string")
    if (config.command !== undefined && typeof config.command !== "string") throw asInvalid("adapterConfig.command must be string")
    if (config.args !== undefined && !Array.isArray(config.args)) throw asInvalid("adapterConfig.args must be an array")
    if (config.commandArgs !== undefined && !Array.isArray(config.commandArgs)) throw asInvalid("adapterConfig.commandArgs must be an array")
    if (config.headers !== undefined && (typeof config.headers !== "object" || Array.isArray(config.headers))) throw asInvalid("adapterConfig.headers must be object")
    if (config.env !== undefined && (typeof config.env !== "object" || Array.isArray(config.env))) throw asInvalid("adapterConfig.env must be object")
    return
  }

  if (adapterName === "process") {
    if (!config.command || typeof config.command !== "string") throw asInvalid("Process adapter requires adapterConfig.command")
    if (config.baseArgs !== undefined && !Array.isArray(config.baseArgs)) throw asInvalid("adapterConfig.baseArgs must be an array")
    if (config.positionalArgs !== undefined && !Array.isArray(config.positionalArgs)) throw asInvalid("adapterConfig.positionalArgs must be an array")
    if (config.passthrough !== undefined && typeof config.passthrough !== "boolean") throw asInvalid("adapterConfig.passthrough must be boolean")
    if (config.flagsBeforePositionals !== undefined && typeof config.flagsBeforePositionals !== "boolean") throw asInvalid("adapterConfig.flagsBeforePositionals must be boolean")
    if (config.missingDependencyHelp !== undefined && typeof config.missingDependencyHelp !== "string") throw asInvalid("adapterConfig.missingDependencyHelp must be string")
    if (config.env !== undefined && (typeof config.env !== "object" || Array.isArray(config.env))) throw asInvalid("adapterConfig.env must be object")
    if (config.interactiveFlags !== undefined && config.interactiveFlags.some(v => typeof v !== "string")) {
      throw asInvalid("adapterConfig.interactiveFlags values must be strings")
    }
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
