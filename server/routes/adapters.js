const { Router } = require("express")
const { NodeVM } = require("vm2")
const path = require("path")
const adaptersService = require("../services/adaptersService")

const router = Router()

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
  })
}

// UI: List adapters page
router.get("/", async (req, res, next) => {
  try {
    const adapters = await adaptersService.listAdapters()
    if (req.headers.accept?.includes("application/json")) {
      return res.json({ adapters })
    }
    res.render("adapters", { adapters })
  } catch (err) {
    next(err)
  }
})

// UI: New adapter page
router.get("/new", (req, res) => {
  res.render("adapter-edit", { adapter: null })
})

// UI: Edit adapter page
router.get("/:name/edit", async (req, res, next) => {
  try {
    const { name } = req.params
    const adapter = await adaptersService.getAdapter(name)
    if (!adapter) {
      return res.status(404).render("error", { message: `Adapter '${name}' not found` })
    }
    const source = await adaptersService.getAdapterSource(name)
    res.render("adapter-edit", { adapter: { ...adapter, source } })
  } catch (err) {
    next(err)
  }
})

// UI: Adapter packages page
router.get("/:name/packages", async (req, res, next) => {
  try {
    const { name } = req.params
    const adapter = await adaptersService.getAdapter(name)
    if (!adapter) {
      return res.status(404).render("error", { message: `Adapter '${name}' not found` })
    }
    const packages = await adaptersService.getAdapterPackages(name)
    res.render("adapter-packages", { adapter, packages })
  } catch (err) {
    next(err)
  }
})

// Get single adapter
router.get("/:name", async (req, res, next) => {
  try {
    const { name } = req.params
    const adapter = await adaptersService.getAdapter(name)
    if (!adapter) {
      return res.status(404).json({ error: `Adapter '${name}' not found` })
    }
    res.json({ adapter })
  } catch (err) {
    next(err)
  }
})

// Get adapter source code
router.get("/:name/source", async (req, res, next) => {
  try {
    const { name } = req.params
    const source = await adaptersService.getAdapterSource(name)
    if (!source) {
      return res.status(404).json({ error: `Adapter '${name}' not found` })
    }
    res.json({ source })
  } catch (err) {
    next(err)
  }
})

// Create adapter
router.post("/", async (req, res, next) => {
  try {
    const { name, description, execution_context, source, dependencies, timeout_ms, memory_limit_mb, allow_network } = req.body
    
    if (!name || !source) {
      throw invalid("name and source are required")
    }
    
    const adapter = await adaptersService.createAdapter({
      name,
      description,
      execution_context,
      source,
      dependencies,
      timeout_ms,
      memory_limit_mb,
      allow_network,
    })
    
    res.status(201).json({ adapter })
  } catch (err) {
    next(err)
  }
})

// Update adapter
router.put("/:name", async (req, res, next) => {
  try {
    const { name } = req.params
    const { description, execution_context, source, dependencies, timeout_ms, memory_limit_mb, allow_network } = req.body
    
    const adapter = await adaptersService.updateAdapter(name, {
      description,
      execution_context,
      source,
      dependencies,
      timeout_ms,
      memory_limit_mb,
      allow_network,
    })
    
    res.json({ adapter })
  } catch (err) {
    next(err)
  }
})

// Delete adapter
router.delete("/:name", async (req, res, next) => {
  try {
    const { name } = req.params
    const deleted = await adaptersService.deleteAdapter(name)
    if (!deleted) {
      return res.status(404).json({ error: `Adapter '${name}' not found` })
    }
    res.json({ ok: true, message: `Adapter '${name}' deleted` })
  } catch (err) {
    next(err)
  }
})

// Get adapter packages
router.get("/:name/packages", async (req, res, next) => {
  try {
    const { name } = req.params
    const packages = await adaptersService.getAdapterPackages(name)
    res.json({ packages })
  } catch (err) {
    next(err)
  }
})

// Add package to adapter
router.post("/:name/packages", async (req, res, next) => {
  try {
    const { name } = req.params
    const { package: packageName, version, packages } = req.body
    
    // Handle prune all (set packages array)
    if (packages !== undefined) {
      const result = await adaptersService.setAdapterPackages(name, packages)
      res.json({ packages: result })
      return
    }
    
    // Handle add single package
    if (!packageName) {
      throw invalid("package is required")
    }
    
    const result = await adaptersService.addAdapterPackage(name, packageName, version)
    res.json({ packages: result })
  } catch (err) {
    next(err)
  }
})

// Remove package from adapter
router.delete("/:name/packages/:package", async (req, res, next) => {
  try {
    const { name, package: packageName } = req.params
    const packages = await adaptersService.removeAdapterPackage(name, packageName)
    res.json({ packages })
  } catch (err) {
    next(err)
  }
})

// Test run adapter (server context only)
router.post("/:name/test", async (req, res, next) => {
  try {
    const { name } = req.params
    const { flags = {}, context = {} } = req.body
    
    const adapter = await adaptersService.getAdapter(name)
    if (!adapter) {
      return res.status(404).json({ error: `Adapter '${name}' not found` })
    }
    
    if (adapter.execution_context === "cli") {
      return res.status(400).json({ 
        error: "Cannot test CLI-context adapter on server. Test locally using the CLI." 
      })
    }
    
    const source = await adaptersService.getAdapterSource(name)
    if (!source) {
      return res.status(404).json({ error: `Adapter '${name}' source not found` })
    }
    
    const startTime = Date.now()
    
    try {
      const vm = new NodeVM({
        timeout: adapter.timeout_ms,
        sandbox: {
          console: {
            log: (...args) => {},
            error: (...args) => {},
            warn: (...args) => {},
          },
        },
        require: {
          external: adapter.allow_network,
          root: process.cwd(),
        },
        memoryLimit: adapter.memory_limit_mb * 1024 * 1024,
      })
      
      const script = `
        ${source}
        module.exports = { execute }
      `
      
      const fn = vm.run(script, "adapter.js")
      
      if (typeof fn.execute !== "function") {
        throw new Error("Adapter must export an 'execute' function")
      }
      
      const mockCmd = {
        namespace: "test",
        resource: "test",
        action: "test",
        adapter: name,
        adapterConfig: {},
        args: [],
      }
      
      const result = await fn.execute(mockCmd, flags, context)
      
      const duration = Date.now() - startTime
      
      res.json({
        ok: true,
        result,
        duration_ms: duration,
        message: "Adapter executed successfully",
      })
    } catch (execErr) {
      const duration = Date.now() - startTime
      res.json({
        ok: false,
        error: execErr.message,
        duration_ms: duration,
        message: "Adapter execution failed",
      })
    }
  } catch (err) {
    next(err)
  }
})

// Execute adapter on server (for CLI delegation)
router.post("/execute", async (req, res, next) => {
  try {
    const { cmd, flags = {}, context = {} } = req.body
    
    if (!cmd || !cmd.adapter) {
      throw invalid("cmd.adapter is required")
    }
    
    const adapter = await adaptersService.getAdapter(cmd.adapter)
    if (!adapter) {
      return res.status(404).json({ error: `Adapter '${cmd.adapter}' not found` })
    }
    
    if (adapter.execution_context === "cli") {
      return res.status(400).json({ 
        error: "CLI-context adapters must be executed locally" 
      })
    }
    
    const source = await adaptersService.getAdapterSource(cmd.adapter)
    if (!source) {
      return res.status(404).json({ error: `Adapter '${cmd.adapter}' source not found` })
    }
    
    const adapterDir = path.join(process.cwd(), "supercli_storage", "adapters", cmd.adapter)
    const adapterNodeModules = path.join(adapterDir, "node_modules")
    
    const vm = new NodeVM({
      timeout: adapter.timeout_ms,
      sandbox: {
        console: {
          log: (...args) => {},
          error: (...args) => {},
          warn: (...args) => {},
        },
      },
      require: {
        external: true,
        root: [adapterDir, adapterNodeModules],
        builtin: ["*"],
        resolve: (moduleName) => {
          try {
            return require.resolve(moduleName, { paths: [adapterNodeModules] })
          } catch {
            return require.resolve(moduleName)
          }
        }
      },
      memoryLimit: adapter.memory_limit_mb * 1024 * 1024,
    })
    
    const script = `
      ${source}
      module.exports = { execute }
    `
    
    const fn = vm.run(script, "adapter.js")
    
    if (typeof fn.execute !== "function") {
      throw invalid("Adapter must export an 'execute' function")
    }
    
    const result = await fn.execute(cmd, flags, context)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
