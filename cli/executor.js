const path = require("path")

// Adapter registry — lazy-loaded
const ADAPTERS = {
  openapi: () => require("./adapters/openapi"),
  mcp: () => require("./adapters/mcp"),
  http: () => require("./adapters/http")
}

async function execute(cmd, flags, context) {
  const adapterName = cmd.adapter

  if (!ADAPTERS[adapterName]) {
    // Try dynamic require for custom adapters
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

module.exports = { execute }
