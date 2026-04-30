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
