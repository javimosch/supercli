const { Router } = require("express");
const { getSettings } = require("../services/pluginsService");

const router = Router();

// Self-describing index — the hub's guide surface. Unauthenticated by design:
// a worker pointed at SUPERCLI_SERVER must be able to discover auth requirements.
const ROUTES = {
  "GET /api": "this index — start here",
  "GET /llms.txt": "plain-text endpoint summary for agents",
  "GET /api/plugins": "plugin catalog pulled by workers (open)",
  "GET /api/settings": "server settings (?format=json — used by sc server status)",
  "POST /api/clients/heartbeat": "worker heartbeat — upserts client last_seen",
  "GET /api/clients": "registered workers",
  "POST /api/jobs": "ingest one job-log entry (worker daemon ships here)",
  "GET /api/jobs": "execution history",
  "GET /api/dashboard": "aggregated stats (?format=json for agents)",
  "GET|POST /api/commands|adapters|specs|mcp|plans|ask": "management CRUD (X-API-Key)",
};

router.get("/", async (req, res) => {
  let authOpen = null;
  try {
    const s = await getSettings();
    authOpen = s.admin_mode_enabled === true || s.public_access === true;
  } catch (_) {}
  res.json({
    ok: true,
    name: "supercli-server",
    service: "supercli-management",
    dashboard: "/",
    routes: ROUTES,
    auth: {
      header: "X-API-Key",
      env: "SUPERCLI_API_KEY",
      required: authOpen === false ? true : authOpen === true ? false : "unknown",
      mint_keys_at: "/api-keys",
    },
    workers: "point SUPERCLI_SERVER here — sc sync pulls config down, sc daemon ships job logs up",
  });
});

module.exports = router;
