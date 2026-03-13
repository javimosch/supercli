const { Router } = require("express")
const {
  getSettings,
  updateSettings,
  listServerPlugins,
  getServerPlugin,
  upsertJsonPlugin,
  upsertZipPlugin,
  updatePluginMetadata,
  removeServerPlugin,
  getPluginArchiveBuffer,
} = require("../services/pluginsService")

const router = Router()

function handleError(res, err) {
  const status = err.code === 85 ? 400 : err.code === 92 ? 404 : 500
  res.status(status).json({ error: err.message, type: err.type || "internal_error" })
}

router.get("/", async (req, res) => {
  try {
    const plugins = await listServerPlugins()
    const settings = await getSettings()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("plugins", { plugins, settings })
    }
    res.json({ plugins, settings })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/settings", async (req, res) => {
  try {
    const settings = await getSettings()
    res.json(settings)
  } catch (err) {
    handleError(res, err)
  }
})

router.put("/settings", async (req, res) => {
  try {
    const settings = await updateSettings(req.body || {})
    res.json({ ok: true, settings })
  } catch (err) {
    handleError(res, err)
  }
})

router.post("/", async (req, res) => {
  try {
    const sourceType = String((req.body && req.body.source_type) || "json").trim().toLowerCase()
    const plugin = sourceType === "zip"
      ? await upsertZipPlugin(req.body || {})
      : await upsertJsonPlugin(req.body || {})
    res.status(201).json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

router.post("/upload", async (req, res) => {
  try {
    const plugin = await upsertZipPlugin({ ...(req.body || {}), source_type: "zip" })
    res.status(201).json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name", async (req, res) => {
  try {
    const plugin = await getServerPlugin(req.params.name)
    if (!plugin) {
      return res.status(404).json({ error: "Plugin not found", type: "resource_not_found" })
    }
    res.json(plugin)
  } catch (err) {
    handleError(res, err)
  }
})

router.patch("/:name", async (req, res) => {
  try {
    const plugin = await updatePluginMetadata(req.params.name, req.body || {})
    res.json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

router.delete("/:name", async (req, res) => {
  try {
    const removed = await removeServerPlugin(req.params.name)
    res.json({ ok: true, removed })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name/manifest", async (req, res) => {
  try {
    const plugin = await getServerPlugin(req.params.name)
    if (!plugin) {
      return res.status(404).json({ error: "Plugin not found", type: "resource_not_found" })
    }
    res.json({ name: plugin.name, manifest: plugin.manifest, checksum: plugin.checksum })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name/archive", async (req, res) => {
  try {
    const archive = await getPluginArchiveBuffer(req.params.name)
    if (!archive) {
      return res.status(404).json({ error: "Archive not found", type: "resource_not_found" })
    }
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Length", String(archive.length))
    res.send(archive)
  } catch (err) {
    handleError(res, err)
  }
})

module.exports = router
