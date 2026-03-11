const { getStorage } = require("../storage/adapter")

async function getCLIConfig() {
  const storage = getStorage()
  const keys = await storage.listKeys("command:")
  const commands = await Promise.all(keys.map(k => storage.get(k)))
  const mcpKeys = await storage.listKeys("mcp:")
  const mcpServers = await Promise.all(mcpKeys.map(k => storage.get(k)))
  const specKeys = await storage.listKeys("spec:")
  const specs = await Promise.all(specKeys.map(k => storage.get(k)))
  const version = await storage.get("settings:config_version")

  return {
    version: version || "1",
    ttl: 3600,
    mcp_servers: mcpServers
      .filter(Boolean)
      .map(s => ({
        name: s.name,
        url: s.url,
        command: s.command,
        args: Array.isArray(s.args) ? s.args : undefined,
        headers: s.headers && typeof s.headers === "object" ? s.headers : undefined,
        env: s.env && typeof s.env === "object" ? s.env : undefined,
        timeout_ms: typeof s.timeout_ms === "number" ? s.timeout_ms : undefined
      })),
    specs: specs
      .filter(Boolean)
      .map(s => ({ name: s.name, url: s.url, auth: s.auth || "none" })),
    commands: commands.map(c => ({
      _id: c._id, // this will now be the natural key
      namespace: c.namespace,
      resource: c.resource,
      action: c.action,
      description: c.description || "",
      adapter: c.adapter,
      adapterConfig: c.adapterConfig || {},
      args: c.args || []
    }))
  }
}

async function bumpVersion() {
  const storage = getStorage()
  const current = await storage.get("settings:config_version")
  const next = String(parseInt(current || "0", 10) + 1)
  await storage.set("settings:config_version", next)
  return next
}

async function getNamespaces() {
  const storage = getStorage()
  const keys = await storage.listKeys("command:")
  const namespaces = new Set()
  for (const k of keys) {
    const parts = k.replace("command:", "").split(".")
    namespaces.add(parts[0])
  }
  return Array.from(namespaces)
}

async function getResources(namespace) {
  const storage = getStorage()
  const keys = await storage.listKeys(`command:${namespace}.`)
  const resources = new Set()
  for (const k of keys) {
    const parts = k.replace("command:", "").split(".")
    resources.add(parts[1])
  }
  return Array.from(resources)
}

async function getActions(namespace, resource) {
  const storage = getStorage()
  const keys = await storage.listKeys(`command:${namespace}.${resource}.`)
  const actions = new Set()
  for (const k of keys) {
    const parts = k.replace("command:", "").split(".")
    actions.add(parts[2])
  }
  return Array.from(actions)
}

async function getCommand(namespace, resource, action) {
  const storage = getStorage()
  return storage.get(`command:${namespace}.${resource}.${action}`)
}

module.exports = {
  getCLIConfig,
  bumpVersion,
  getNamespaces,
  getResources,
  getActions,
  getCommand
}
