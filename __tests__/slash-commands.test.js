"use strict"

const fs = require("fs")
const os = require("os")
const path = require("path")

const {
  listSlashCommands,
  addSlashCommand,
  removeSlashCommand,
  slashCommandsFile,
} = require("../cli/slash-commands")

describe("slash-commands", () => {
  let tempHome

  beforeEach(() => {
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-slash-"))
    process.env.SUPERCLI_HOME = tempHome
  })

  afterEach(() => {
    delete process.env.SUPERCLI_HOME
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  // ── slashCommandsFile ─────────────────────────────────────────────────────

  test("slashCommandsFile returns path inside SUPERCLI_HOME", () => {
    expect(slashCommandsFile()).toBe(path.join(tempHome, "slash-commands.json"))
  })

  // ── listSlashCommands ─────────────────────────────────────────────────────

  test("listSlashCommands returns empty array when file does not exist", () => {
    expect(listSlashCommands()).toEqual([])
  })

  test("listSlashCommands returns commands from persisted file", () => {
    const cmd = { name: "deploy", description: "deploy app", run: "npm run deploy" }
    fs.writeFileSync(slashCommandsFile(), JSON.stringify([cmd]))
    expect(listSlashCommands()).toEqual([cmd])
  })

  test("listSlashCommands returns empty array for invalid JSON", () => {
    fs.writeFileSync(slashCommandsFile(), "not-valid-json{")
    expect(listSlashCommands()).toEqual([])
  })

  test("listSlashCommands returns empty array when file contains a non-array", () => {
    fs.writeFileSync(slashCommandsFile(), JSON.stringify({ name: "deploy" }))
    expect(listSlashCommands()).toEqual([])
  })

  test("listSlashCommands returns empty array when file contains null", () => {
    fs.writeFileSync(slashCommandsFile(), "null")
    expect(listSlashCommands()).toEqual([])
  })

  // ── addSlashCommand ───────────────────────────────────────────────────────

  test("addSlashCommand throws when entry is null", () => {
    expect(() => addSlashCommand(null)).toThrow("entry must be a non-null object")
  })

  test("addSlashCommand throws when entry is a string", () => {
    expect(() => addSlashCommand("deploy")).toThrow("entry must be a non-null object")
  })

  test("addSlashCommand throws when entry is an array", () => {
    expect(() => addSlashCommand([])).toThrow("entry must be a non-null object")
  })

  test("addSlashCommand throws when name is missing", () => {
    expect(() => addSlashCommand({ description: "no name" })).toThrow("name is required")
  })

  test("addSlashCommand throws when name is blank whitespace", () => {
    expect(() => addSlashCommand({ name: "   " })).toThrow("name is required")
  })

  test("addSlashCommand persists a new command and returns it", () => {
    const result = addSlashCommand({ name: "test", run: "npm test" })
    expect(result).toEqual({ name: "test", run: "npm test" })
    expect(listSlashCommands()).toEqual([{ name: "test", run: "npm test" }])
  })

  test("addSlashCommand trims whitespace from name", () => {
    const result = addSlashCommand({ name: "  lint  ", run: "npm run lint" })
    expect(result.name).toBe("lint")
  })

  test("addSlashCommand upserts when name already exists", () => {
    addSlashCommand({ name: "build", run: "npm run build" })
    addSlashCommand({ name: "build", run: "make build", description: "updated" })
    const commands = listSlashCommands()
    expect(commands).toHaveLength(1)
    expect(commands[0].run).toBe("make build")
    expect(commands[0].description).toBe("updated")
  })

  test("addSlashCommand appends when name is different", () => {
    addSlashCommand({ name: "a", run: "echo a" })
    addSlashCommand({ name: "b", run: "echo b" })
    expect(listSlashCommands()).toHaveLength(2)
  })

  test("addSlashCommand preserves extra fields on the entry", () => {
    const result = addSlashCommand({ name: "deploy", env: "production", region: "us-east-1" })
    expect(result.env).toBe("production")
    expect(result.region).toBe("us-east-1")
  })

  test("addSlashCommand creates the directory if it does not exist", () => {
    const nested = path.join(tempHome, "nested")
    process.env.SUPERCLI_HOME = nested
    addSlashCommand({ name: "x" })
    expect(fs.existsSync(path.join(nested, "slash-commands.json"))).toBe(true)
  })

  // ── removeSlashCommand ────────────────────────────────────────────────────

  test("removeSlashCommand throws when name is not a string", () => {
    expect(() => removeSlashCommand(42)).toThrow("name must be a non-empty string")
  })

  test("removeSlashCommand throws when name is empty string", () => {
    expect(() => removeSlashCommand("")).toThrow("name must be a non-empty string")
  })

  test("removeSlashCommand throws when name is blank whitespace", () => {
    expect(() => removeSlashCommand("   ")).toThrow("name must be a non-empty string")
  })

  test("removeSlashCommand returns 0 when command does not exist", () => {
    expect(removeSlashCommand("missing")).toBe(0)
  })

  test("removeSlashCommand returns 1 and removes the matching command", () => {
    addSlashCommand({ name: "release", run: "npm run release" })
    const count = removeSlashCommand("release")
    expect(count).toBe(1)
    expect(listSlashCommands()).toEqual([])
  })

  test("removeSlashCommand removes only the matching command", () => {
    addSlashCommand({ name: "alpha" })
    addSlashCommand({ name: "beta" })
    removeSlashCommand("alpha")
    const remaining = listSlashCommands()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].name).toBe("beta")
  })

  test("removeSlashCommand trims name before matching", () => {
    addSlashCommand({ name: "trim-me" })
    expect(removeSlashCommand("  trim-me  ")).toBe(1)
    expect(listSlashCommands()).toEqual([])
  })

  // ── round-trip ────────────────────────────────────────────────────────────

  test("full lifecycle: add → list → remove → list", () => {
    addSlashCommand({ name: "foo", run: "echo foo" })
    addSlashCommand({ name: "bar", run: "echo bar" })
    expect(listSlashCommands()).toHaveLength(2)

    removeSlashCommand("foo")
    const remaining = listSlashCommands()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].name).toBe("bar")

    removeSlashCommand("bar")
    expect(listSlashCommands()).toHaveLength(0)
  })
})
