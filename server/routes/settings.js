const { Router } = require("express");
const { getSettings, updateSettings } = require("../services/pluginsService");

const router = Router();

// Helper function to handle errors
function handleError(res, err) {
  console.error(err);
  const status = err.status || 500;
  const error = err.error || { code: 500, type: "internal_error", message: err.message || "Internal server error" };
  res.status(status).json({ error });
}

// GET /settings - Render settings view
router.get("/settings", async (req, res) => {
  try {
    const settings = await getSettings()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("settings", { settings })
    }
    res.json(settings)
  } catch (err) {
    handleError(res, err)
  }
})

// PUT /settings - Update settings
router.put("/settings", async (req, res) => {
  try {
    const settings = await updateSettings(req.body || {})
    res.json({ ok: true, settings })
  } catch (err) {
    handleError(res, err)
  }
})

// GET /api-keys - Render API keys view
router.get("/api-keys", async (req, res) => {
  try {
    const settings = await getSettings()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("api-keys", { settings })
    }
    res.json({ api_keys: settings.api_keys || [] })
  } catch (err) {
    handleError(res, err)
  }
})

// POST /api-keys - Create API key
router.post("/api-keys", async (req, res) => {
  try {
    const { name } = req.body || {}
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required", type: "invalid_argument" })
    }

    const settings = await getSettings()
    const crypto = require("crypto")
    const key = crypto.randomBytes(32).toString("hex")

    const newApiKey = {
      name: String(name).trim(),
      key,
      created_at: new Date().toISOString()
    }

    const apiKeys = Array.isArray(settings.api_keys) ? settings.api_keys : []
    apiKeys.push(newApiKey)

    await updateSettings({ api_keys: apiKeys })
    res.status(201).json(newApiKey)
  } catch (err) {
    handleError(res, err)
  }
})

// DELETE /api-keys/:key - Delete API key
router.delete("/api-keys/:key", async (req, res) => {
  try {
    const keyToDelete = req.params.key
    const settings = await getSettings()
    const apiKeys = Array.isArray(settings.api_keys) ? settings.api_keys : []
    const filtered = apiKeys.filter(k => k.key !== keyToDelete)

    await updateSettings({ api_keys: filtered })
    res.json({ ok: true })
  } catch (err) {
    handleError(res, err)
  }
})

module.exports = router;
