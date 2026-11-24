const { Router } = require("express");
const { getStorage } = require("../storage/adapter");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// Helper function to handle errors
function handleError(res, err) {
  console.error(err);
  const status = err.status || 500;
  const error = err.error || { code: 500, type: "internal_error", message: err.message || "Internal server error" };
  res.status(status).json({ error });
}

// Worker heartbeat — upserts the client's last_seen without needing a plugin
// push. Daemon bookkeepers POST here each sync cycle so the dashboard shows
// live workers, not just workers that once pushed plugins.
router.post("/heartbeat", async (req, res) => {
  try {
    const { client_id, hostname, sc_version } = req.body || {};
    if (!client_id) {
      return res.status(400).json({ error: { code: 400, type: "validation_error", message: "client_id is required" } });
    }
    const storage = getStorage();
    const key = `client:${client_id}`;
    const existing = (await storage.get(key)) || {};
    const now = new Date().toISOString();
    await storage.set(key, {
      ...existing,
      client_id,
      hostname: hostname || existing.hostname || null,
      sc_version: sc_version || existing.sc_version || null,
      registered_at: existing.registered_at || now,
      last_seen: now,
      last_heartbeat: now,
    });
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

// List clients endpoint
router.get("/", requireAuth, async (req, res) => {
  try {
    const storage = getStorage();
    const clientKeys = await storage.listKeys("client:");
    const clients = [];
    
    for (const key of clientKeys) {
      try {
        const client = await storage.get(key);
        if (client && client.client_id) {
          clients.push(client);
        }
      } catch (err) {
        // Skip if client read fails
      }
    }
    
    // Sort by last_seen descending
    clients.sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen));
    
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("clients", { clients });
    }
    
    res.json({ clients });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
