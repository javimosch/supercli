const { getSettings } = require("../services/pluginsService");

// Cache settings for 30 seconds to avoid repeated storage reads
let cachedSettings = null;
let cacheExpiry = 0;

async function getCachedSettings() {
  const now = Date.now();
  if (cachedSettings && now < cacheExpiry) {
    return cachedSettings;
  }
  cachedSettings = await getSettings();
  cacheExpiry = now + 30000; // 30 seconds
  return cachedSettings;
}

/**
 * Authentication middleware for API endpoints
 *
 * Flow:
 * 1. Check admin_mode_enabled - if true, skip all auth
 * 2. Check public_access - if true, allow all requests
 * 3. Allow settings endpoint when no API keys exist (for bootstrapping)
 * 4. Check X-API-Key header - validate against stored API keys
 * 5. Return 401 if no valid auth
 */
async function requireAuth(req, res, next) {
  try {
    const settings = await getCachedSettings();

    // Admin mode - skip all authentication
    if (settings.admin_mode_enabled === true) {
      return next();
    }

    // Public access - allow all requests
    if (settings.public_access === true) {
      return next();
    }

    // Allow settings and API keys endpoints when no API keys exist (bootstrapping)
    const apiKeys = Array.isArray(settings.api_keys) ? settings.api_keys : [];
    const fullPath = (req.baseUrl || "") + (req.path || "");
    if (apiKeys.length === 0 && (fullPath.includes("/settings") || fullPath.includes("/api-keys"))) {
      return next();
    }

    // Check API key
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(401).json({ error: "Unauthorized: API key required" });
    }

    // Validate API key against stored keys
    const isValid = apiKeys.some(k => k.key === apiKey);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized: Invalid API key" });
    }

    // Valid API key
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    // Fail open on error to avoid breaking existing deployments
    next();
  }
}

module.exports = { requireAuth, getCachedSettings };
