#!/usr/bin/env node
/**
 * SUPERCLI CLI Integration Tests
 * Tests all built-in commands, output modes, and error handling.
 * Requires: server running on SUPERCLI_SERVER (default http://localhost:3000)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const SERVER = process.env.SUPERCLI_SERVER || "http://127.0.0.1:3000";
const CLI = path.join(__dirname, "..", "cli", "supercli.js");
const SERVER_AVAILABLE = (() => {
  try {
    execSync(`curl -s --max-time 2 ${SERVER}/api/config > /dev/null`, {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
})();
const run = (args, opts = {}) => {
  try {
    const result = execSync(`SUPERCLI_SERVER=${SERVER} node ${CLI} ${args}`, {
      encoding: "utf-8",
      timeout: 15000,
      env: { ...process.env, SUPERCLI_SERVER: SERVER },
      ...opts,
    });
    return { ok: true, output: result.trim() };
  } catch (err) {
    return {
      ok: false,
      output: (err.stdout || "").trim(),
      stderr: (err.stderr || "").trim(),
      code: err.status,
    };
  }
};

const runNoServer = (args, opts = {}) => {
  try {
    const env = { ...process.env };
    delete env.SUPERCLI_SERVER;
    const result = execSync(`node ${CLI} ${args}`, {
      encoding: "utf-8",
      timeout: 15000,
      env,
      ...opts,
    });
    return { ok: true, output: result.trim() };
  } catch (err) {
    return {
      ok: false,
      output: (err.stdout || "").trim(),
      stderr: (err.stderr || "").trim(),
      code: err.status,
    };
  }
};

const parse = (r) => JSON.parse(r.output);

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ❌ ${name}: ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "Assertion failed");
}

console.log("\n⚡ SUPERCLI CLI Tests\n");

// ── Seed test data ──
console.log("  Seeding test data...");
try {
  execSync(
    `curl -s -X POST ${SERVER}/api/commands -H 'Content-Type: application/json' -d '${JSON.stringify(
      {
        namespace: "test",
        resource: "items",
        action: "list",
        adapter: "http",
        adapterConfig: {
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts?_limit=2",
        },
        args: [],
        description: "List test items",
      },
    )}'`,
    { encoding: "utf-8" },
  );

  execSync(
    `curl -s -X POST ${SERVER}/api/commands -H 'Content-Type: application/json' -d '${JSON.stringify(
      {
        namespace: "test",
        resource: "items",
        action: "get",
        adapter: "http",
        adapterConfig: {
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/posts/{id}",
        },
        args: [{ name: "id", type: "string", required: true }],
        description: "Get test item by ID",
      },
    )}'`,
    { encoding: "utf-8" },
  );
  console.log("  Seeded.\n");
} catch (e) {
  console.log("  (Seed skipped — data may already exist)\n");
}

// ── help ──
test("help --json returns namespaces", () => {
  const r = run("help --json");
  assert(r.ok, "help should succeed");
  const d = parse(r);
  assert(d.version === "1.0", "version should be 1.0");
  assert(Array.isArray(d.namespaces), "should have namespaces array");
});

test("no-args non-tty returns agent bootstrap payload", () => {
  const r = runNoServer("--json");
  assert(r.ok, "no-args json should succeed");
  const d = JSON.parse(r.output);
  assert(d.mode === "agent_bootstrap", "should return agent bootstrap mode");
  assert(Array.isArray(d.next), "should include next commands");
  assert(
    d.next.includes("supercli skills teach --format skill.md"),
    "should point agents to skills teach",
  );
});

// ── --help-json ──
test("--help-json returns capability discovery", () => {
  run("sync --json");
  const r = run("--help-json");
  assert(r.ok, "help-json should succeed");
  const d = parse(r);
  assert(d.name === "supercli", "name should be supercli");
  assert(d.exit_codes, "should have exit_codes");
  assert(d.flags, "should have flags");
  assert(d.total_commands > 0, "should have commands");
});

test("--help-json hides sync when SUPERCLI_SERVER is not set", () => {
  const r = runNoServer("--help-json");
  assert(r.ok, "help-json without server should succeed");
  const d = JSON.parse(r.output);
  assert(
    !d.commands.sync,
    "sync should not be exposed without SUPERCLI_SERVER",
  );
});

test("sync is unavailable when SUPERCLI_SERVER is not set", () => {
  const r = runNoServer("sync --json");
  assert(!r.ok, "sync should fail without SUPERCLI_SERVER");
  assert(r.code === 92, "sync should be treated as unknown command");
});

test("plan works in local mode without SUPERCLI_SERVER", () => {
  runNoServer("plugins install beads --json");
  const r = runNoServer("plan beads install steps --json");
  assert(r.ok, "local plan should succeed");
  const d = JSON.parse(r.output);
  assert(d.execution_mode === "local", "execution_mode should be local");
  assert(d.persisted === false, "persisted should be false");
  assert(
    Array.isArray(d.steps) && d.steps.length > 0,
    "should include plan steps",
  );
  runNoServer("plugins remove beads --json");
});

test("local mcp registry can add/list/remove without SUPERCLI_SERVER", () => {
  const add = runNoServer(
    "mcp add local-demo --url http://127.0.0.1:7777 --json",
  );
  assert(add.ok, "mcp add should succeed");

  const list = runNoServer("mcp list --json");
  assert(list.ok, "mcp list should succeed");
  const listData = JSON.parse(list.output);
  assert(
    Array.isArray(listData.mcp_servers),
    "list should include mcp_servers",
  );
  assert(
    listData.mcp_servers.find((s) => s.name === "local-demo"),
    "list should include local-demo",
  );

  const remove = runNoServer("mcp remove local-demo --json");
  assert(remove.ok, "mcp remove should succeed");
});

test("plugins install/list/show/remove works locally", () => {
  const install = runNoServer("plugins install ./plugins/beads --json");
  assert(install.ok, "plugins install should succeed");
  const installData = JSON.parse(install.output);
  assert(installData.ok === true, "install should return ok");

  const list = runNoServer("plugins list --json");
  assert(list.ok, "plugins list should succeed");
  const listData = JSON.parse(list.output);
  assert(Array.isArray(listData.plugins), "plugins list should return array");
  assert(listData.plugins.find((p) => p.name === "beads"), "beads plugin should be listed");

  const show = runNoServer("plugins show beads --json");
  assert(show.ok, "plugins show should succeed");
  const showData = JSON.parse(show.output);
  assert(showData.plugin.name === "beads", "plugins show should return beads plugin");

  const doctor = runNoServer("plugins doctor beads --json");
  assert(doctor.ok, "plugins doctor should succeed");
  const doctorData = JSON.parse(doctor.output);
  assert(doctorData.plugin === "beads", "doctor should target beads plugin");
  assert(Array.isArray(doctorData.checks), "doctor should include checks array");

  const remove = runNoServer("plugins remove beads --json");
  assert(remove.ok, "plugins remove should succeed");
});

test("beads install steps command works after plugin install", () => {
  runNoServer("plugins install beads --json");
  const r = runNoServer("beads install steps --json");
  assert(r.ok, "beads install steps should succeed");
  const d = JSON.parse(r.output);
  assert(d.data && Array.isArray(d.data.install_steps), "should include install steps array");
  runNoServer("plugins remove beads --json");
});

test("gwc plugin supports install/show/doctor and passthrough", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-gws-"));
  const gwsPath = path.join(dir, "gws");
  fs.writeFileSync(
    gwsPath,
    [
      "#!/usr/bin/env node",
      "const args = process.argv.slice(2);",
      "if (args.includes('--version')) { console.log('gws 0.0.0-test'); process.exit(0); }",
      "if (args.length === 0 || args.includes('--help')) { console.log('gws-help-ok'); process.exit(0); }",
      "console.log(JSON.stringify({ ok: true, args }));"
    ].join("\n"),
    "utf-8",
  );
  fs.chmodSync(gwsPath, 0o755);

  const env = { ...process.env, PATH: `${dir}:${process.env.PATH || ""}` };

  const install = runNoServer("plugins install ./plugins/gwc --json", { env });
  assert(install.ok, "gwc install should succeed");

  const show = runNoServer("plugins show gwc --json", { env });
  assert(show.ok, "plugins show gwc should succeed");
  const showData = JSON.parse(show.output);
  assert(showData.plugin.name === "gwc", "plugins show should return gwc plugin");

  const doctor = runNoServer("plugins doctor gwc --json", { env });
  assert(doctor.ok, "plugins doctor gwc should succeed");
  const doctorData = JSON.parse(doctor.output);
  assert(doctorData.ok === true, "gwc doctor should pass with mocked gws binary");

  const passthroughHelp = runNoServer("gwc --help --json", { env });
  assert(passthroughHelp.ok, "gwc passthrough help should succeed");
  const helpData = JSON.parse(passthroughHelp.output);
  assert(helpData.data && helpData.data.raw.includes("gws-help-ok"), "gwc help should passthrough to gws");

  const passthrough = runNoServer("gwc drive files list --params '{\"pageSize\":1}' --json", { env });
  assert(passthrough.ok, "gwc passthrough call should succeed");
  const passData = JSON.parse(passthrough.output);
  assert(passData.data && passData.data.ok === true, "gwc passthrough should return gws JSON");
  assert(Array.isArray(passData.data.args), "gwc passthrough should include forwarded args");
  assert(passData.data.args[0] === "drive", "gwc passthrough should preserve positional args");

  const installSteps = runNoServer("gwc install steps --json", { env });
  assert(installSteps.ok, "gwc install steps should use builtin command");
  const installData = JSON.parse(installSteps.output);
  assert(Array.isArray(installData.data.install_steps), "gwc install steps should include install steps");

  const remove = runNoServer("plugins remove gwc --json", { env });
  assert(remove.ok, "plugins remove gwc should succeed");
  fs.rmSync(dir, { recursive: true, force: true });
});

// ── config show ──
test("config show returns cache info", () => {
  // First sync
  run("sync --json");
  const r = run("config show --json");
  assert(r.ok, "config show should succeed");
  const d = parse(r);
  assert(d.version, "should have version");
  assert(d.cacheFile, "should have cacheFile");
});

test("sync command refreshes local config", () => {
  if (!SERVER_AVAILABLE) return;
  const r = run("sync --json");
  assert(r.ok, "sync should succeed");
  const d = parse(r);
  assert(d.ok === true, "sync should return ok");
});

// ── commands ──
test("commands --json lists all commands", () => {
  const r = run("commands --json");
  assert(r.ok, "commands should succeed");
  const d = parse(r);
  assert(Array.isArray(d.commands), "should have commands array");
  assert(d.commands.length > 0, "should have at least 1 command");
});

// ── skills list ──
test("skills list --json returns minimal metadata", () => {
  const r = run("skills list --json");
  assert(r.ok, "skills list should succeed");
  const d = parse(r);
  assert(Array.isArray(d.skills), "should return skills array");
  assert(d.skills.length > 0, "should include at least one skill");
  const first = d.skills[0];
  assert(
    Object.keys(first).sort().join(",") === "description,name",
    "skill metadata should only include name and description",
  );
  assert(
    d.skills.some((s) => s.name === "plugins.registry.usage"),
    "skills list should include plugins registry usage skill",
  );
});

// ── skills teach ──
test("skills teach defaults to skill.md output", () => {
  const r = run("skills teach");
  assert(r.ok, "skills teach should succeed");
  assert(r.output.startsWith("---"), "should start with frontmatter");
  assert(
    r.output.includes('skill_name: "teach_skills_usage"'),
    "should include teach skill name",
  );
});

// ── skills get ──
test("skills get defaults to skill.md output", () => {
  const r = run("skills get test.items.list");
  assert(r.ok, "skills get should succeed");
  assert(r.output.startsWith("---"), "should start with frontmatter");
  assert(
    r.output.includes('command: "test items list"'),
    "should include command field",
  );
});

test("skills get can include DAG section", () => {
  const r = run("skills get test.items.list --show-dag");
  assert(r.ok, "skills get with dag should succeed");
  assert(r.output.includes("dag:"), "should include dag section");
});

test("skills get plugins registry usage skill", () => {
  const r = run("skills get plugins.registry.usage");
  assert(r.ok, "plugins registry skill should succeed");
  assert(r.output.includes("plugins explore"), "plugins registry skill should include explore guidance");
});

// ── namespace listing ──
test("namespace listing returns resources", () => {
  const r = run("test --json");
  assert(r.ok, "namespace should succeed");
  const d = parse(r);
  assert(d.namespace === "test", "namespace should be test");
  assert(Array.isArray(d.resources), "should have resources");
  assert(d.resources.includes("items"), "should include items");
});

// ── resource listing ──
test("resource listing returns actions", () => {
  const r = run("test items --json");
  assert(r.ok, "resource should succeed");
  const d = parse(r);
  assert(d.resource === "items", "resource should be items");
  assert(Array.isArray(d.actions), "should have actions");
});

// ── inspect ──
test("inspect returns command schema", () => {
  const r = run("inspect test items get --json");
  assert(r.ok, "inspect should succeed");
  const d = parse(r);
  assert(d.command === "test.items.get", "command should match");
  assert(d.input_schema, "should have input_schema");
  assert(d.input_schema.required.includes("id"), "id should be required");
});

// ── --schema ──
test("--schema returns input/output schema", () => {
  const r = run("test items get --schema");
  assert(r.ok, "schema should succeed");
  const d = parse(r);
  assert(d.input_schema, "should have input_schema");
  assert(d.output_schema, "should have output_schema");
});

// ── execute command ──
test("execute command returns data envelope", () => {
  const r = run("test items list --json");
  assert(r.ok, "execute should succeed");
  const d = parse(r);
  assert(d.version === "1.0", "version should be 1.0");
  assert(d.command === "test.items.list", "command should match");
  assert(d.duration_ms >= 0, "should have duration");
  assert(Array.isArray(d.data), "data should be array");
});

// ── execute with path param ──
test("execute with required arg substitutes path param", () => {
  const r = run("test items get --id 1 --json");
  assert(r.ok, "execute should succeed");
  const d = parse(r);
  assert(d.data.id === 1, "should return item with id 1");
});

// ── --compact flag ──
test("--compact returns compressed keys", () => {
  const r = run("test items list --compact");
  assert(r.ok, "compact should succeed");
  const d = parse(r);
  assert(d.v === "1.0", "version key should be v");
  assert(d.c === "test.items.list", "command key should be c");
  assert(d.d, "data key should be d");
});

// ── validation error ──
test("missing required arg returns validation error", () => {
  const r = run("test items get --json");
  assert(!r.ok, "should fail");
  assert(r.code === 82, "exit code should be 82");
  const d = JSON.parse(r.output);
  assert(d.error.type === "validation_error", "should be validation_error");
});

// ── not found error ──
test("unknown command returns resource_not_found", () => {
  const r = run("nonexistent foo bar --json");
  assert(!r.ok, "should fail");
  assert(r.code === 92, "exit code should be 92");
});

// ── plan command ──
test("plan creates execution plan", () => {
  if (!SERVER_AVAILABLE) return;
  const r = run("plan test items list --json");
  assert(r.ok, "plan should succeed");
  const d = parse(r);
  assert(d.plan_id, "should have plan_id");
  assert(Array.isArray(d.steps), "should have steps");
  assert(d.steps.length >= 3, "should have at least 3 steps");
  assert(d.risk_level, "should have risk_level");
});

// ── Results ──
console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
