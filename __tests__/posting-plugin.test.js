const fs = require("fs")
const path = require("path")

const PLUGIN_DIR = path.join(__dirname, "..", "plugins", "posting")

describe("posting plugin", () => {
  test("plugin.json exists and has required fields", () => {
    const pluginPath = path.join(PLUGIN_DIR, "plugin.json")
    expect(fs.existsSync(pluginPath)).toBe(true)
    const plugin = JSON.parse(fs.readFileSync(pluginPath, "utf-8"))
    expect(plugin.name).toBe("posting")
    expect(plugin.description).toMatch(/posting/)
    expect(plugin.description.length).toBeGreaterThanOrEqual(30)
    expect(Array.isArray(plugin.commands)).toBe(true)
    expect(plugin.commands.length).toBeGreaterThan(0)
  })

  test("meta.json exists and has valid tags", () => {
    const metaPath = path.join(PLUGIN_DIR, "meta.json")
    expect(fs.existsSync(metaPath)).toBe(true)
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    expect(Array.isArray(meta.tags)).toBe(true)
    expect(meta.tags.length).toBeGreaterThanOrEqual(3)
    expect(meta.tags.length).toBeLessThanOrEqual(8)
  })

  test("skill file exists", () => {
    const skillPath = path.join(PLUGIN_DIR, "skills", "quickstart", "SKILL.md")
    expect(fs.existsSync(skillPath)).toBe(true)
    const content = fs.readFileSync(skillPath, "utf-8")
    expect(content).toMatch(/posting/)
  })

  test("all commands have required fields", () => {
    const plugin = JSON.parse(
      fs.readFileSync(path.join(PLUGIN_DIR, "plugin.json"), "utf-8")
    )
    for (const cmd of plugin.commands) {
      expect(typeof cmd.namespace).toBe("string")
      expect(typeof cmd.resource).toBe("string")
      expect(typeof cmd.action).toBe("string")
      expect(typeof cmd.description).toBe("string")
      expect(typeof cmd.adapter).toBe("string")
    }
  })
})
