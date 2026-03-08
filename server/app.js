const express = require("express")
const path = require("path")
const { connect } = require("./db")

const commandsRouter = require("./routes/commands")
const configRouter = require("./routes/config")
const specsRouter = require("./routes/specs")
const mcpRouter = require("./routes/mcp")

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use("/static", express.static(path.join(__dirname, "public")))

// API routes
app.use("/api/config", configRouter)
app.use("/api/commands", commandsRouter)
app.use("/api/specs", specsRouter)
app.use("/api/mcp", mcpRouter)

// Tree/command endpoints under /api (config router handles them)
app.use("/api", configRouter)

// UI page redirects
app.get("/", (req, res) => res.redirect("/api/commands"))
app.get("/commands", (req, res) => res.redirect("/api/commands"))
app.get("/commands/new", (req, res) => res.redirect("/api/commands/new"))
app.get("/specs", (req, res) => res.redirect("/api/specs"))
app.get("/mcp", (req, res) => res.redirect("/api/mcp"))

async function start() {
  try {
    await connect()
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`DCLI server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("Failed to start:", err.message)
    process.exit(1)
  }
}

start()
