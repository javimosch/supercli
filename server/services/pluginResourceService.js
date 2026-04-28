/**
 * Plugin Resource Service
 * Handles registration and cleanup of server resources (MCP/OpenAPI) from plugins
 */
const { getStorage } = require("../storage/adapter")

async function registerPluginResources(pluginName, serverResources, origin = "cli") {
  const storage = getStorage()
  const results = { mcp: [], specs: [], errors: [] }
  
  try {
    // Register MCP resources
    if (serverResources.mcp && Array.isArray(serverResources.mcp)) {
      for (const mcpResource of serverResources.mcp) {
        try {
          if (!mcpResource.name || (!mcpResource.url && !mcpResource.command)) {
            results.errors.push(`Invalid MCP resource: missing name or url/command`)
            continue
          }
          
          const key = `mcp:${origin}:${pluginName}:${mcpResource.name}`
          const doc = {
            _id: key,
            name: key,
            displayName: mcpResource.name,
            pluginSource: pluginName,
            origin: origin,
            createdAt: new Date()
          }
          
          // Copy MCP properties
          if (mcpResource.url) doc.url = mcpResource.url
          if (mcpResource.command) doc.command = mcpResource.command
          if (mcpResource.args) doc.args = mcpResource.args
          if (mcpResource.headers) doc.headers = mcpResource.headers
          if (mcpResource.env) doc.env = mcpResource.env
          if (mcpResource.timeout_ms) doc.timeout_ms = mcpResource.timeout_ms
          if (mcpResource.stateful) doc.stateful = true
          
          await storage.set(key, doc)
          results.mcp.push(key)
        } catch (err) {
          results.errors.push(`Failed to register MCP ${mcpResource.name}: ${err.message}`)
        }
      }
    }
    
    // Register OpenAPI spec resources
    if (serverResources.specs && Array.isArray(serverResources.specs)) {
      for (const specResource of serverResources.specs) {
        try {
          if (!specResource.name || !specResource.url) {
            results.errors.push(`Invalid spec resource: missing name or url`)
            continue
          }
          
          const key = `spec:${origin}:${pluginName}:${specResource.name}`
          const doc = {
            _id: key,
            name: key,
            displayName: specResource.name,
            url: specResource.url,
            auth: specResource.auth || "none",
            pluginSource: pluginName,
            origin: origin,
            createdAt: new Date()
          }
          
          await storage.set(key, doc)
          results.specs.push(key)
        } catch (err) {
          results.errors.push(`Failed to register spec ${specResource.name}: ${err.message}`)
        }
      }
    }
  } catch (err) {
    results.errors.push(`Resource registration failed: ${err.message}`)
  }
  
  return results
}

async function unregisterPluginResources(pluginName, origin = "cli") {
  const storage = getStorage()
  const results = { mcp: [], specs: [], errors: [] }
  
  try {
    // Remove MCP resources by origin prefix
    const allMcpKeys = await storage.listKeys("mcp:")
    const targetMcpKeys = allMcpKeys.filter(k => k.startsWith(`mcp:${origin}:${pluginName}:`))
    for (const key of targetMcpKeys) {
      try {
        await storage.delete(key)
        results.mcp.push(key)
      } catch (err) {
        results.errors.push(`Failed to remove MCP ${key}: ${err.message}`)
      }
    }
    
    // Remove spec resources by origin prefix
    const allSpecKeys = await storage.listKeys("spec:")
    const targetSpecKeys = allSpecKeys.filter(k => k.startsWith(`spec:${origin}:${pluginName}:`))
    for (const key of targetSpecKeys) {
      try {
        await storage.delete(key)
        results.specs.push(key)
      } catch (err) {
        results.errors.push(`Failed to remove spec ${key}: ${err.message}`)
      }
    }
  } catch (err) {
    results.errors.push(`Resource cleanup failed: ${err.message}`)
  }
  
  return results
}

async function registerAllPluginResources() {
  const storage = getStorage()
  const results = { plugins: {}, totalErrors: 0, registeredMcp: 0, registeredSpecs: 0 }
  
  // Register resources from client plugins (plugin_client:*)
  const clientPluginKeys = await storage.listKeys("plugin_client:")
  for (const key of clientPluginKeys) {
    try {
      const plugin = await storage.get(key)
      if (plugin && plugin.server_resources) {
        const pluginResults = await registerPluginResources(plugin.name, plugin.server_resources, "cli")
        results.plugins[plugin.name] = pluginResults
        results.totalErrors += pluginResults.errors.length
        results.registeredMcp += pluginResults.mcp.length
        results.registeredSpecs += pluginResults.specs.length
      }
    } catch (err) {
      results.totalErrors++
    }
  }
  
  // Register resources from server plugins (plugin_server:*)
  const serverPluginKeys = await storage.listKeys("plugin_server:")
  for (const key of serverPluginKeys) {
    try {
      const plugin = await storage.get(key)
      if (plugin && plugin.manifest && plugin.manifest.server_resources) {
        const pluginResults = await registerPluginResources(plugin.name, plugin.manifest.server_resources, "server")
        results.plugins[plugin.name] = pluginResults
        results.totalErrors += pluginResults.errors.length
        results.registeredMcp += pluginResults.mcp.length
        results.registeredSpecs += pluginResults.specs.length
      }
    } catch (err) {
      results.totalErrors++
    }
  }
  
  return results
}

async function syncPluginResources() {
  const storage = getStorage()
  
  // Get all currently registered plugin resources
  const allMcpKeys = await storage.listKeys("mcp:")
  const allSpecKeys = await storage.listKeys("spec:")
  
  // Filter for plugin resources (contain origin prefix)
  const pluginMcpKeys = allMcpKeys.filter(k => k.split(':').length > 2)
  const pluginSpecKeys = allSpecKeys.filter(k => k.split(':').length > 2)
  
  // Build set of expected resources from server storage (plugin_client:* and plugin_server:*)
  const expectedMcpKeys = new Set()
  const expectedSpecKeys = new Set()
  
  const clientPluginKeys = await storage.listKeys("plugin_client:")
  const serverPluginKeys = await storage.listKeys("plugin_server:")
  
  // Read client plugins
  for (const key of clientPluginKeys) {
    try {
      const plugin = await storage.get(key)
      if (plugin && plugin.server_resources) {
        if (plugin.server_resources.mcp) {
          for (const mcp of plugin.server_resources.mcp) {
            expectedMcpKeys.add(`mcp:cli:${plugin.name}:${mcp.name}`)
          }
        }
        if (plugin.server_resources.specs) {
          for (const spec of plugin.server_resources.specs) {
            expectedSpecKeys.add(`spec:cli:${plugin.name}:${spec.name}`)
          }
        }
      }
    } catch (err) {
      // Skip if plugin read fails
    }
  }
  
  // Read server plugins
  for (const key of serverPluginKeys) {
    try {
      const plugin = await storage.get(key)
      if (plugin && plugin.manifest && plugin.manifest.server_resources) {
        if (plugin.manifest.server_resources.mcp) {
          for (const mcp of plugin.manifest.server_resources.mcp) {
            expectedMcpKeys.add(`mcp:server:${plugin.name}:${mcp.name}`)
          }
        }
        if (plugin.manifest.server_resources.specs) {
          for (const spec of plugin.manifest.server_resources.specs) {
            expectedSpecKeys.add(`spec:server:${plugin.name}:${spec.name}`)
          }
        }
      }
    } catch (err) {
      // Skip if plugin read fails
    }
  }
  
  // Remove orphaned resources (no longer in any installed plugin)
  const cleanupResults = { removedMcp: [], removedSpecs: [], errors: [] }
  
  for (const key of pluginMcpKeys) {
    if (!expectedMcpKeys.has(key)) {
      try {
        await storage.delete(key)
        cleanupResults.removedMcp.push(key)
      } catch (err) {
        cleanupResults.errors.push(`Failed to remove orphaned MCP ${key}: ${err.message}`)
      }
    }
  }
  
  for (const key of pluginSpecKeys) {
    if (!expectedSpecKeys.has(key)) {
      try {
        await storage.delete(key)
        cleanupResults.removedSpecs.push(key)
      } catch (err) {
        cleanupResults.errors.push(`Failed to remove orphaned spec ${key}: ${err.message}`)
      }
    }
  }
  
  return cleanupResults
}

module.exports = {
  registerPluginResources,
  unregisterPluginResources,
  registerAllPluginResources,
  syncPluginResources
}
