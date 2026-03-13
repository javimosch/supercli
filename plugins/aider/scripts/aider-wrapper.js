const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")

const VERSION = "1.0"
const EXIT_CODES = {
  success: 0,
  invalidInput: 80,
  invalidState: 90,
  integrationFailure: 100,
  internalFailure: 110
}

const HELP = {
  version: VERSION,
  name: "aider-wrapper",
  commands: {
    models: {
      required: ["--query"],
      description: "List aider models matching a partial name."
    },
    apply: {
      required: ["--cwd", "--prompt"],
      description: "Run a one-shot aider edit task with writes enabled."
    },
    "dry-run": {
      required: ["--cwd", "--prompt"],
      description: "Run a one-shot aider edit task without modifying files."
    }
  },
  notes: [
    "The wrapper always disables auto-commits.",
    "The wrapper returns JSON with stdout, stderr, exit_code, and changed_files."
  ]
}

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith("--")) {
      args._.push(token)
      continue
    }
    const trimmed = token.slice(2)
    const eq = trimmed.indexOf("=")
    if (eq >= 0) {
      args[trimmed.slice(0, eq)] = trimmed.slice(eq + 1)
      continue
    }
    const next = argv[i + 1]
    if (!next || next.startsWith("--")) {
      args[trimmed] = true
      continue
    }
    args[trimmed] = next
    i += 1
  }
  return args
}

function printJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

function fail(code, type, message, details = {}, suggestions = []) {
  printJson({
    version: VERSION,
    status: "error",
    error: { code, type, message, details, recoverable: false, retry_after: null, suggestions }
  })
  process.exit(code)
}

function splitCsv(value) {
  if (!value) {
    return []
  }
  return String(value).split(",").map((item) => item.trim()).filter(Boolean)
}

function ensureAbsoluteDir(dir) {
  if (typeof dir !== "string" || dir.trim() === "") {
    fail(EXIT_CODES.invalidInput, "missing_cwd", "Provide --cwd with an absolute target directory.", {}, ["Example: --cwd /absolute/path/to/repo"])
  }
  if (!path.isAbsolute(dir)) {
    fail(EXIT_CODES.invalidInput, "cwd_not_absolute", `Target directory must be absolute: ${dir}`)
  }
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    fail(EXIT_CODES.invalidInput, "cwd_not_found", `Target directory not found: ${dir}`)
  }
}

function readGitState(cwd) {
  const result = spawnSync("git", ["status", "--porcelain"], {
    cwd,
    encoding: "utf-8"
  })
  if (result.error || result.status !== 0) {
    return null
  }

  const entries = new Set()
  for (const line of result.stdout.split(/\r?\n/)) {
    if (!line.trim()) {
      continue
    }
    entries.add(line.slice(3).trim())
  }
  return entries
}

function diffGitState(before, after) {
  if (!after) {
    return []
  }
  if (!before) {
    return Array.from(after).sort()
  }
  return Array.from(after).filter((item) => !before.has(item)).sort()
}

function runModels(args) {
  if (!args.query) {
    fail(EXIT_CODES.invalidInput, "missing_query", "Provide --query for aider model lookup.")
  }
  const result = spawnSync("aider", ["--list-models", String(args.query)], {
    encoding: "utf-8",
    env: { ...process.env, NO_COLOR: "1", AIDER_GITIGNORE: "false", AIDER_ANALYTICS_DISABLE: "true" }
  })
  if (result.error) {
    fail(EXIT_CODES.integrationFailure, "aider_not_available", result.error.message, {}, ["Run 'dcli aider cli setup' to install aider-chat."])
  }
  printJson({
    version: VERSION,
    status: result.status === 0 ? "success" : "error",
    data: {
      query: String(args.query),
      stdout: result.stdout,
      stderr: result.stderr,
      exit_code: result.status
    }
  })
  process.exit(result.status || 0)
}

function buildAiderArgs(mode, args) {
  const aiderArgs = [
    "--yes-always",
    "--no-auto-commits",
    "--no-gitignore",
    "--no-pretty",
    "--no-stream",
    "--no-suggest-shell-commands",
    "--no-check-update",
    "--analytics-disable",
    "--message",
    String(args.prompt)
  ]

  if (args.model) {
    aiderArgs.push("--model", String(args.model))
  }
  if (args["timeout-seconds"]) {
    aiderArgs.push("--timeout", String(args["timeout-seconds"]))
  }
  if (args.verbose) {
    aiderArgs.push("--verbose")
  }
  if (mode === "dry-run") {
    aiderArgs.push("--dry-run")
  }

  for (const file of splitCsv(args.files)) {
    aiderArgs.push("--file", file)
  }
  for (const file of splitCsv(args.read)) {
    aiderArgs.push("--read", file)
  }

  return aiderArgs
}

function runTask(mode, args) {
  ensureAbsoluteDir(args.cwd)
  if (!args.prompt) {
    fail(EXIT_CODES.invalidInput, "missing_prompt", "Provide --prompt for the aider task.")
  }

  const before = readGitState(args.cwd)
  const result = spawnSync("aider", buildAiderArgs(mode, args), {
    cwd: args.cwd,
    encoding: "utf-8",
    env: { ...process.env, NO_COLOR: "1", AIDER_GITIGNORE: "false", AIDER_ANALYTICS_DISABLE: "true" }
  })

  if (result.error) {
    fail(EXIT_CODES.integrationFailure, "aider_execution_failed", result.error.message, {}, ["Run 'dcli aider cli setup' to install aider-chat."])
  }

  const after = readGitState(args.cwd)
  const payload = {
    version: VERSION,
    status: result.status === 0 ? "success" : "error",
    data: {
      mode,
      cwd: args.cwd,
      prompt: String(args.prompt),
      model: args.model || null,
      dry_run: mode === "dry-run",
      changed_files: diffGitState(before, after),
      stdout: result.stdout,
      stderr: result.stderr,
      exit_code: result.status
    }
  }
  printJson(payload)
  process.exit(result.status || 0)
}

function main() {
  const [command, ...rest] = process.argv.slice(2)
  if (command === "help-json") {
    printJson(HELP)
    return
  }

  const args = parseArgs(rest)
  if (command === "models") {
    runModels(args)
    return
  }
  if (command === "apply" || command === "dry-run") {
    runTask(command, args)
    return
  }

  fail(EXIT_CODES.invalidInput, "unknown_command", `Unknown command: ${command || "<missing>"}`)
}

if (require.main === module) {
  main()
}
