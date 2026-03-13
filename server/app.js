const express = require("express");
const path = require("path");
const { getStorage } = require("./storage/adapter");

const commandsRouter = require("./routes/commands");
const configRouter = require("./routes/config");
const specsRouter = require("./routes/specs");
const mcpRouter = require("./routes/mcp");
const plansRouter = require("./routes/plans");
const jobsRouter = require("./routes/jobs");
const askRouter = require("./routes/ask");
const pluginsRouter = require("./routes/plugins");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/config", configRouter);
app.use("/api/commands", commandsRouter);
app.use("/api/specs", specsRouter);
app.use("/api/mcp", mcpRouter);
app.use("/api/plans", plansRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/ask", askRouter);
app.use("/api/plugins", pluginsRouter);

// Tree/command endpoints under /api (config router handles them)
app.use("/api", configRouter);

// UI page redirects
app.get("/", (req, res) => res.redirect("/api/commands"));
app.get("/commands", (req, res) => res.redirect("/api/commands"));
app.get("/commands/new", (req, res) => res.redirect("/api/commands/new"));
app.get("/specs", (req, res) => res.redirect("/api/specs"));
app.get("/mcp", (req, res) => res.redirect("/api/mcp"));
app.get("/jobs", (req, res) => res.redirect("/api/jobs"));
app.get("/plugins", (req, res) => res.redirect("/api/plugins"));

async function start() {
  try {
    // Initialize storage singleton
    getStorage();

    app.listen(PORT, () => {
      console.log(`SUPERCLI server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
}

start();
