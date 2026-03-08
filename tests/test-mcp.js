#!/usr/bin/env node
/**
 * MCP Adapter Integration Test
 * Spins up a mock MCP server, registers it, creates command, executes via CLI.
 * Requires: server running on DCLI_SERVER
 */

const http = require("http")
const { exec } = require("child_process")
const util = require("util")
const path = require("path")

const execAsync = util.promisify(exec)
const SERVER = process.env.DCLI_SERVER || "http://127.0.0.1:3000"
const CLI = path.join(__dirname, "..", "cli", "dcli.js")
const MCP_PORT = 4567

let passed = 0, failed = 0
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ✅ ${name}`) }
  catch (err) { failed++; console.error(`  ❌ ${name}: ${err.message}`); console.error(err.stack) }
}
function assert(cond, msg) { if (!cond) throw new Error(msg) }

async function api(method, urlPath, body) {
  const bodyStr = body ? JSON.stringify(body).replace(/'/g, "'\\''") : ""
  const cmd = body
    ? `curl -s -X ${method} '${SERVER}${urlPath}' -H 'Content-Type: application/json' -d '${bodyStr}'`
    : `curl -s -X ${method} '${SERVER}${urlPath}'`
  const { stdout } = await execAsync(cmd, { encoding: "utf-8" })
  return JSON.parse(stdout)
}

async function cli(args) {
  try {
    const { stdout } = await execAsync(`DCLI_SERVER=${SERVER} node ${CLI} ${args}`, { encoding: "utf-8", timeout: 15000, env: { ...process.env, DCLI_SERVER: SERVER } })
    return { ok: true, data: JSON.parse(stdout.trim()) }
  } catch (e) {
    return { ok: false, output: (e.stdout || "").trim(), code: e.code || e.status }
  }
}

async function cliLocal(args) {
  try {
    const env = { ...process.env }
    delete env.DCLI_SERVER
    const { stdout } = await execAsync(`node ${CLI} ${args}`, { encoding: "utf-8", timeout: 15000, env })
    return { ok: true, data: JSON.parse(stdout.trim()) }
  } catch (e) {
    return { ok: false, output: (e.stdout || "").trim(), code: e.code || e.status }
  }
}

async function run() {
  console.log("\n⚡ MCP Adapter Tests\n")

  // ── Start mock MCP server ──
  let mockServer
  await test("start mock MCP server", async () => {
    return new Promise((resolve) => {
      mockServer = http.createServer((req, res) => {
        if (req.method === "POST" && req.url === "/tool") {
          let body = ""
          req.on("data", c => body += c)
          req.on("end", () => {
            const { tool, input } = JSON.parse(body)
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ tool, result: `Processed by ${tool}`, input_received: input }))
          })
        } else {
          res.writeHead(404)
          res.end()
        }
      })
      mockServer.listen(MCP_PORT, resolve)
    })
  })

  await test("register MCP server", async () => {
    const r = await api("POST", "/api/mcp", { name: "test-mcp", url: `http://127.0.0.1:${MCP_PORT}` })
    assert(r.name === "test-mcp" || r.error, "should register")
  })

  await test("create MCP command", async () => {
    const r = await api("POST", "/api/commands", {
      namespace: "ai", resource: "text", action: "summarize", adapter: "mcp",
      adapterConfig: { server: "test-mcp", tool: "summarize" },
      args: [{ name: "text", type: "string", required: true }],
      description: "Summarize text via MCP"
    })
    assert(r.namespace === "ai", "should create command")
  })

  await test("sync CLI config", async () => {
    const r = await cli("sync --json")
    assert(r.ok, "sync should succeed")
  })

  await test("inspect MCP command", async () => {
    const r = await cli("inspect ai text summarize --json")
    assert(r.ok, "inspect should succeed")
    assert(r.data.adapter === "mcp", "adapter should be mcp")
  })

  await test("execute MCP command", async () => {
    const r = await cli("ai text summarize --text helloworld --json")
    assert(r.ok, "execute should succeed. output: " + (r.output || "none") + " code: " + r.code)
    assert(r.data.command === "ai.text.summarize", "command should match")
    assert(r.data.data.tool === "summarize", "tool should match")
    assert(r.data.data.result, "should have result")
  })

  await test("execute MCP command in local mode", async () => {
    const r = await cliLocal("ai text summarize --text localmode --json")
    assert(r.ok, "local execute should succeed. output: " + (r.output || "none") + " code: " + r.code)
    assert(r.data.command === "ai.text.summarize", "command should match")
    assert(r.data.data.tool === "summarize", "tool should match")
    assert(r.data.data.result, "should have result")
  })

  await test("list MCP servers", async () => {
    const r = await api("GET", "/api/mcp?format=json")
    assert(Array.isArray(r), "should return array")
    assert(r.find(s => s.name === "test-mcp"), "should find test-mcp")
  })

  if (mockServer) mockServer.close()

  console.log(`\n  Results: ${passed} passed, ${failed} failed\n`)
  process.exit(failed > 0 ? 1 : 0)
}

run()
