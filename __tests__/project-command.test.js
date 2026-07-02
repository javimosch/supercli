"use strict"

const fs = require("fs")
const os = require("os")
const path = require("path")

const {
  listProjects,
  addProject,
  removeProject,
  projectsFile,
} = require("../cli/project-command")

describe("project-command", () => {
  let tempHome

  beforeEach(() => {
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-projects-"))
    process.env.SUPERCLI_HOME = tempHome
  })

  afterEach(() => {
    delete process.env.SUPERCLI_HOME
    fs.rmSync(tempHome, { recursive: true, force: true })
  })

  // ── projectsFile ──────────────────────────────────────────────────────────

  test("projectsFile returns path inside SUPERCLI_HOME", () => {
    expect(projectsFile()).toBe(path.join(tempHome, "projects.json"))
  })

  // ── listProjects ──────────────────────────────────────────────────────────

  test("listProjects returns empty array when file does not exist", () => {
    expect(listProjects()).toEqual([])
  })

  test("listProjects returns projects from persisted file", () => {
    const proj = { name: "myapp", path: "/home/user/myapp" }
    fs.writeFileSync(projectsFile(), JSON.stringify([proj]))
    expect(listProjects()).toEqual([proj])
  })

  test("listProjects returns empty array for invalid JSON", () => {
    fs.writeFileSync(projectsFile(), "not-valid-json{")
    expect(listProjects()).toEqual([])
  })

  test("listProjects returns empty array when file contains a non-array", () => {
    fs.writeFileSync(projectsFile(), JSON.stringify({ name: "myapp" }))
    expect(listProjects()).toEqual([])
  })

  test("listProjects returns empty array when file contains null", () => {
    fs.writeFileSync(projectsFile(), "null")
    expect(listProjects()).toEqual([])
  })

  // ── addProject ────────────────────────────────────────────────────────────

  test("addProject throws when entry is null", () => {
    expect(() => addProject(null)).toThrow("entry must be a non-null object")
  })

  test("addProject throws when entry is a string", () => {
    expect(() => addProject("myapp")).toThrow("entry must be a non-null object")
  })

  test("addProject throws when entry is an array", () => {
    expect(() => addProject([])).toThrow("entry must be a non-null object")
  })

  test("addProject throws when name is missing", () => {
    expect(() => addProject({ path: "/home/user/myapp" })).toThrow("name is required")
  })

  test("addProject throws when name is blank whitespace", () => {
    expect(() => addProject({ name: "   " })).toThrow("name is required")
  })

  test("addProject persists a new project and returns it", () => {
    const result = addProject({ name: "backend", path: "/srv/backend" })
    expect(result).toEqual({ name: "backend", path: "/srv/backend" })
    expect(listProjects()).toEqual([{ name: "backend", path: "/srv/backend" }])
  })

  test("addProject trims whitespace from name", () => {
    const result = addProject({ name: "  frontend  ", path: "/srv/frontend" })
    expect(result.name).toBe("frontend")
  })

  test("addProject upserts when name already exists", () => {
    addProject({ name: "api", path: "/srv/api-v1" })
    addProject({ name: "api", path: "/srv/api-v2", description: "updated" })
    const projects = listProjects()
    expect(projects).toHaveLength(1)
    expect(projects[0].path).toBe("/srv/api-v2")
    expect(projects[0].description).toBe("updated")
  })

  test("addProject appends when name is different", () => {
    addProject({ name: "alpha", path: "/srv/alpha" })
    addProject({ name: "beta", path: "/srv/beta" })
    expect(listProjects()).toHaveLength(2)
  })

  test("addProject preserves extra fields on the entry", () => {
    const result = addProject({ name: "infra", path: "/srv/infra", env: "production", region: "us-east-1" })
    expect(result.env).toBe("production")
    expect(result.region).toBe("us-east-1")
  })

  test("addProject creates the directory if it does not exist", () => {
    const nested = path.join(tempHome, "nested")
    process.env.SUPERCLI_HOME = nested
    addProject({ name: "x", path: "/x" })
    expect(fs.existsSync(path.join(nested, "projects.json"))).toBe(true)
  })

  // ── removeProject ─────────────────────────────────────────────────────────

  test("removeProject throws when name is not a string", () => {
    expect(() => removeProject(42)).toThrow("name must be a non-empty string")
  })

  test("removeProject throws when name is empty string", () => {
    expect(() => removeProject("")).toThrow("name must be a non-empty string")
  })

  test("removeProject throws when name is blank whitespace", () => {
    expect(() => removeProject("   ")).toThrow("name must be a non-empty string")
  })

  test("removeProject returns 0 when project does not exist", () => {
    expect(removeProject("missing")).toBe(0)
  })

  test("removeProject returns 1 and removes the matching project", () => {
    addProject({ name: "release-service", path: "/srv/release" })
    const count = removeProject("release-service")
    expect(count).toBe(1)
    expect(listProjects()).toEqual([])
  })

  test("removeProject removes only the matching project", () => {
    addProject({ name: "alpha", path: "/srv/alpha" })
    addProject({ name: "beta", path: "/srv/beta" })
    removeProject("alpha")
    const remaining = listProjects()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].name).toBe("beta")
  })

  test("removeProject trims name before matching", () => {
    addProject({ name: "trim-me", path: "/srv/trim-me" })
    expect(removeProject("  trim-me  ")).toBe(1)
    expect(listProjects()).toEqual([])
  })

  // ── round-trip ────────────────────────────────────────────────────────────

  test("full lifecycle: add → list → remove → list", () => {
    addProject({ name: "foo", path: "/srv/foo" })
    addProject({ name: "bar", path: "/srv/bar" })
    expect(listProjects()).toHaveLength(2)

    removeProject("foo")
    const remaining = listProjects()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].name).toBe("bar")

    removeProject("bar")
    expect(listProjects()).toHaveLength(0)
  })
})
