#!/usr/bin/env node
/**
 * DCLI CLI Integration Tests
 * Tests all built-in commands, output modes, and error handling.
 * Requires: server running on DCLI_SERVER (default http://localhost:3000)
 */

const { execSync } = require("child_process")
const path = require("path")

const SERVER = process.env.DCLI_SERVER || "http://localhost:3000"
const CLI = path.join(__dirname, "..", "cli", "dcli.js")
const run = (args, opts = {}) => {
  try {
    const result = execSync(`DCLI_SERVER=${SERVER} node ${CLI} ${args}`, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...process.env, DCLI_SERVER: SERVER },
      ...opts
    })
    return { ok: true, output: result.trim() }
  } catch (err) {
    return { ok: false, output: (err.stdout || "").trim(), stderr: (err.stderr || "").trim(), code: err.status }
  }
}

const parse = (r) => JSON.parse(r.output)

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✅ ${name}`)
  } catch (err) {
    failed++
    console.error(`  ❌ ${name}: ${err.message}`)
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "Assertion failed")
}

console.log("\n⚡ DCLI CLI Tests\n")

// ── Seed test data ──
console.log("  Seeding test data...")
try {
  execSync(`curl -s -X POST ${SERVER}/api/commands -H 'Content-Type: application/json' -d '${JSON.stringify({
    namespace: "test", resource: "items", action: "list",
    adapter: "http",
    adapterConfig: { method: "GET", url: "https://jsonplaceholder.typicode.com/posts?_limit=2" },
    args: [], description: "List test items"
  })}'`, { encoding: "utf-8" })

  execSync(`curl -s -X POST ${SERVER}/api/commands -H 'Content-Type: application/json' -d '${JSON.stringify({
    namespace: "test", resource: "items", action: "get",
    adapter: "http",
    adapterConfig: { method: "GET", url: "https://jsonplaceholder.typicode.com/posts/{id}" },
    args: [{ name: "id", type: "string", required: true }],
    description: "Get test item by ID"
  })}'`, { encoding: "utf-8" })
  console.log("  Seeded.\n")
} catch (e) {
  console.log("  (Seed skipped — data may already exist)\n")
}

// ── help ──
test("help --json returns namespaces", () => {
  const r = run("help --json")
  assert(r.ok, "help should succeed")
  const d = parse(r)
  assert(d.version === "1.0", "version should be 1.0")
  assert(Array.isArray(d.namespaces), "should have namespaces array")
})

// ── --help-json ──
test("--help-json returns capability discovery", () => {
  const r = run("--help-json")
  assert(r.ok, "help-json should succeed")
  const d = parse(r)
  assert(d.name === "dcli", "name should be dcli")
  assert(d.exit_codes, "should have exit_codes")
  assert(d.flags, "should have flags")
  assert(d.total_commands > 0, "should have commands")
})

// ── config show ──
test("config show returns cache info", () => {
  // First refresh
  run("config refresh --json")
  const r = run("config show --json")
  assert(r.ok, "config show should succeed")
  const d = parse(r)
  assert(d.version, "should have version")
  assert(d.cacheFile, "should have cacheFile")
})

// ── commands ──
test("commands --json lists all commands", () => {
  const r = run("commands --json")
  assert(r.ok, "commands should succeed")
  const d = parse(r)
  assert(Array.isArray(d.commands), "should have commands array")
  assert(d.commands.length > 0, "should have at least 1 command")
})

// ── namespace listing ──
test("namespace listing returns resources", () => {
  const r = run("test --json")
  assert(r.ok, "namespace should succeed")
  const d = parse(r)
  assert(d.namespace === "test", "namespace should be test")
  assert(Array.isArray(d.resources), "should have resources")
  assert(d.resources.includes("items"), "should include items")
})

// ── resource listing ──
test("resource listing returns actions", () => {
  const r = run("test items --json")
  assert(r.ok, "resource should succeed")
  const d = parse(r)
  assert(d.resource === "items", "resource should be items")
  assert(Array.isArray(d.actions), "should have actions")
})

// ── inspect ──
test("inspect returns command schema", () => {
  const r = run("inspect test items get --json")
  assert(r.ok, "inspect should succeed")
  const d = parse(r)
  assert(d.command === "test.items.get", "command should match")
  assert(d.input_schema, "should have input_schema")
  assert(d.input_schema.required.includes("id"), "id should be required")
})

// ── --schema ──
test("--schema returns input/output schema", () => {
  const r = run("test items get --schema")
  assert(r.ok, "schema should succeed")
  const d = parse(r)
  assert(d.input_schema, "should have input_schema")
  assert(d.output_schema, "should have output_schema")
})

// ── execute command ──
test("execute command returns data envelope", () => {
  const r = run("test items list --json")
  assert(r.ok, "execute should succeed")
  const d = parse(r)
  assert(d.version === "1.0", "version should be 1.0")
  assert(d.command === "test.items.list", "command should match")
  assert(d.duration_ms >= 0, "should have duration")
  assert(Array.isArray(d.data), "data should be array")
})

// ── execute with path param ──
test("execute with required arg substitutes path param", () => {
  const r = run("test items get --id 1 --json")
  assert(r.ok, "execute should succeed")
  const d = parse(r)
  assert(d.data.id === 1, "should return item with id 1")
})

// ── --compact flag ──
test("--compact returns compressed keys", () => {
  const r = run("test items list --compact")
  assert(r.ok, "compact should succeed")
  const d = parse(r)
  assert(d.v === "1.0", "version key should be v")
  assert(d.c === "test.items.list", "command key should be c")
  assert(d.d, "data key should be d")
})

// ── validation error ──
test("missing required arg returns validation error", () => {
  const r = run("test items get --json")
  assert(!r.ok, "should fail")
  assert(r.code === 82, "exit code should be 82")
  const d = JSON.parse(r.output)
  assert(d.error.type === "validation_error", "should be validation_error")
})

// ── not found error ──
test("unknown command returns resource_not_found", () => {
  const r = run("nonexistent foo bar --json")
  assert(!r.ok, "should fail")
  assert(r.code === 92, "exit code should be 92")
})

// ── plan command ──
test("plan creates execution plan", () => {
  const r = run("plan test items list --json")
  assert(r.ok, "plan should succeed")
  const d = parse(r)
  assert(d.plan_id, "should have plan_id")
  assert(Array.isArray(d.steps), "should have steps")
  assert(d.steps.length >= 3, "should have at least 3 steps")
  assert(d.risk_level, "should have risk_level")
})

// ── Results ──
console.log(`\n  Results: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
