#!/usr/bin/env node

const fs = require("fs")
const os = require("os")
const path = require("path")

const CACHE_DIR = path.join(os.homedir(), ".dcli")
const CACHE_FILE = path.join(CACHE_DIR, "config.json")
const MCP_NAME = "summarize-sse"
const MCP_URL = process.env.MCP_SSE_URL || "http://127.0.0.1:8787"

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readConfig() {
  if (!fs.existsSync(CACHE_FILE)) {
    return { version: "1", ttl: 3600, mcp_servers: [], specs: [], commands: [] }
  }
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"))
  } catch {
    return { version: "1", ttl: 3600, mcp_servers: [], specs: [], commands: [] }
  }
}

function upsertBy(arr, predicate, value) {
  const idx = arr.findIndex(predicate)
  if (idx >= 0) arr[idx] = value
  else arr.push(value)
}

function main() {
  ensureDir(CACHE_DIR)
  const config = readConfig()
  if (!Array.isArray(config.commands)) config.commands = []
  if (!Array.isArray(config.mcp_servers)) config.mcp_servers = []
  if (!Array.isArray(config.specs)) config.specs = []

  upsertBy(config.mcp_servers, s => s && s.name === MCP_NAME, { name: MCP_NAME, url: MCP_URL })

  upsertBy(
    config.commands,
    c => c && c.namespace === "ai" && c.resource === "text" && c.action === "summarize_remote",
    {
      _id: "command:ai.text.summarize_remote",
      namespace: "ai",
      resource: "text",
      action: "summarize_remote",
      description: "Mock summarize via remote MCP SSE/HTTP server",
      adapter: "mcp",
      adapterConfig: {
        server: MCP_NAME,
        tool: "summarize"
      },
      args: [{ name: "text", type: "string", required: true }]
    }
  )

  config.fetchedAt = Date.now()
  fs.writeFileSync(CACHE_FILE, JSON.stringify(config, null, 2))
  process.stdout.write(`Installed remote demo command ai.text.summarize_remote and MCP '${MCP_NAME}' in ${CACHE_FILE}\n`)
}

main()
