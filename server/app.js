const express = require("express");
const path = require("path");
const { getStorage } = require("./storage/adapter");
const { registerAllPluginResources, syncPluginResources } = require("./services/pluginResourceService");

const dashboardRouter = require("./routes/dashboard");
const adaptersRouter = require("./routes/adapters");
const commandsRouter = require("./routes/commands");
const configRouter = require("./routes/config");
const specsRouter = require("./routes/specs");
const mcpRouter = require("./routes/mcp");
const plansRouter = require("./routes/plans");
const jobsRouter = require("./routes/jobs");
const askRouter = require("./routes/ask");
const pluginsRouter = require("./routes/plugins");
const docsRouter = require("./routes/docs");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static file serving - must be before API routes
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/docs", express.static(path.join(__dirname, "../docs")));

// API routes
app.use("/api/dashboard", dashboardRouter);
app.use("/api/adapters", adaptersRouter);
app.use("/api/config", configRouter);
app.use("/api/commands", commandsRouter);
app.use("/api/specs", specsRouter);
app.use("/api/mcp", mcpRouter);
app.use("/api/plans", plansRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/ask", askRouter);
app.use("/api/plugins", pluginsRouter);
app.use("/api/docs", docsRouter);

// Tree/command endpoints under /api (config router handles them)
app.use("/api", configRouter);

app.use("/", dashboardRouter);

// Error handler - return JSON for API requests
app.use((err, req, res, next) => {
  if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
    res.status(err.status || 500).json({
      error: {
        code: err.code || 500,
        type: err.type || 'internal_error',
        message: err.message || 'Internal server error',
        recoverable: !!err.recoverable
      }
    });
  } else {
    res.status(err.status || 500).render('error', { message: err.message || 'Internal server error' });
  }
});

// UI page redirects
app.get("/commands", (req, res) => res.redirect("/api/commands"));
app.get("/commands/new", (req, res) => res.redirect("/api/commands/new"));
app.get("/specs", (req, res) => res.redirect("/api/specs"));
app.get("/mcp", (req, res) => res.redirect("/api/mcp"));
app.get("/jobs", (req, res) => res.redirect("/api/jobs"));
app.get("/plugins", (req, res) => res.redirect("/api/plugins"));
app.get("/adapters", (req, res) => res.redirect("/api/adapters"));
app.get("/docs", (req, res) => res.redirect("/api/docs"));

// Doc sub-page redirects
app.get("/api/plugins.html", (req, res) => res.redirect("/docs/plugins.html"));
app.get("/api/adapters.html", (req, res) => res.redirect("/docs/adapters.html"));
app.get("/api/server.md", (req, res) => res.redirect("/docs/server.md"));
app.get("/api/changelog.html", (req, res) => res.redirect("/docs/changelog.html"));

async function start() {
  try {
    // Initialize storage singleton
    getStorage();

    // Sync plugin resources (cleanup orphaned)
    console.log("[Plugin Resources] Syncing plugin resources...");
    const syncResults = await syncPluginResources();
    if (syncResults.removedMcp.length > 0 || syncResults.removedSpecs.length > 0) {
      console.log(`[Plugin Resources] Cleaned up ${syncResults.removedMcp.length} MCP and ${syncResults.removedSpecs.length} orphaned specs`);
    }
    if (syncResults.errors.length > 0) {
      console.warn(`[Plugin Resources] ${syncResults.errors.length} sync errors`);
    }

    // Register plugin resources (self-healing)
    console.log("[Plugin Resources] Registering plugin resources...");
    const resourceResults = await registerAllPluginResources();
    if (resourceResults.totalErrors > 0) {
      console.warn(`[Plugin Resources] ${resourceResults.totalErrors} errors during registration`);
    }
    console.log(`[Plugin Resources] Registered ${resourceResults.registeredMcp} MCP servers and ${resourceResults.registeredSpecs} OpenAPI specs`);

    app.listen(PORT, () => {
      console.log(`SUPERCLI server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
}

start();
