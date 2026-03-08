#!/usr/bin/env node
/**
 * OpenAPI Adapter Integration Test
 * Registers an OpenAPI spec, creates a command, executes via CLI.
 * Requires: server running on DCLI_SERVER
 */

const { execSync } = require("child_process")
const path = require("path")

const SERVER = process.env.DCLI_SERVER || "http://127.0.0.1:3000"
const CLI = path.join(__dirname, "..", "cli", "dcli.js")

let passed = 0, failed = 0
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✅ ${name}`) }
  catch (err) { failed++; console.error(`  ❌ ${name}: ${err.message}`) }
}
function assert(cond, msg) { if (!cond) throw new Error(msg) }

function api(method, urlPath, body) {
  const bodyStr = body ? JSON.stringify(body).replace(/'/g, "'\\''") : ""
  const cmd = body
    ? `curl -s -X ${method} '${SERVER}${urlPath}' -H 'Content-Type: application/json' -d '${bodyStr}'`
    : `curl -s -X ${method} '${SERVER}${urlPath}'`
  return JSON.parse(execSync(cmd, { encoding: "utf-8" }))
}

function cli(args) {
  try {
    const out = execSync(`DCLI_SERVER=${SERVER} node ${CLI} ${args}`, { encoding: "utf-8", timeout: 15000, env: { ...process.env, DCLI_SERVER: SERVER } })
    return { ok: true, data: JSON.parse(out.trim()) }
  } catch (e) {
    return { ok: false, output: (e.stdout || "").trim(), code: e.status }
  }
}

console.log("\n⚡ OpenAPI Adapter Tests\n")

test("register OpenAPI spec", () => {
  const r = api("POST", "/api/specs", { name: "jsonplaceholder", url: "https://jsonplaceholder.typicode.com", auth: "none" })
  assert(r.name === "jsonplaceholder" || r.error, "should register spec")
})

test("create command bound to spec", () => {
  const r = api("POST", "/api/commands", {
    namespace: "oapi", resource: "todos", action: "list", adapter: "http",
    adapterConfig: { method: "GET", url: "https://jsonplaceholder.typicode.com/todos?_limit=3" },
    args: [], description: "List todos via OpenAPI-style command"
  })
  assert(r.namespace === "oapi", "should create command")
})

test("CLI config sync", () => {
  const r = cli("sync --json")
  assert(r.ok, "sync should succeed")
})

test("execute openapi-bound command", () => {
  const r = cli("oapi todos list --json")
  assert(r.ok, "execute should succeed")
  assert(r.data.command === "oapi.todos.list", "command should match")
  assert(Array.isArray(r.data.data), "should return array")
  assert(r.data.data.length === 3, "should return 3 items")
})

test("list specs via API", () => {
  const r = api("GET", "/api/specs?format=json")
  assert(Array.isArray(r), "should return array")
  assert(r.find(s => s.name === "jsonplaceholder"), "should find registered spec")
})

console.log(`\n  Results: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
