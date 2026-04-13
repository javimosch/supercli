const fs = require("fs")

jest.mock("fs")
jest.mock("../cli/plugins-store", () => ({
  readPluginsLock: jest.fn(() => ({ installed: {} })),
}))
jest.mock("../cli/plugins-registry", () => ({
  getRegistryPlugin: jest.fn(() => null),
}))

const { readPluginsLock } = require("../cli/plugins-store")
const { getRegistryPlugin } = require("../cli/plugins-registry")
const { getPluginInstallGuidance, normalizeInstallGuidance } = require("../cli/plugin-install-guidance")

describe("plugin-install-guidance", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    readPluginsLock.mockReturnValue({ installed: {} })
    getRegistryPlugin.mockReturnValue(null)
    fs.existsSync.mockReturnValue(false)
  })

  test("normalizes valid guidance object", () => {
    const normalized = normalizeInstallGuidance({
      binary: "docker",
      check: "docker --version",
      install_steps: ["docker --version"],
      note: "ok",
    }, "demo")
    expect(normalized).toEqual({
      plugin: "demo",
      binary: "docker",
      check: "docker --version",
      install_steps: ["docker --version"],
      note: "ok",
    })
  })

  test("returns stored install guidance from installed lock", () => {
    readPluginsLock.mockReturnValue({
      installed: {
        demo: {
          name: "demo",
          install_guidance: {
            plugin: "demo",
            binary: "demo",
            check: "demo --version",
            install_steps: ["demo --version"],
            note: "stored",
          }
        }
      }
    })

    const guidance = getPluginInstallGuidance("demo")
    expect(guidance.note).toBe("stored")
  })

  test("reads guidance from bundled manifest when available", () => {
    fs.existsSync.mockImplementation((p) => String(p).endsWith("plugins/shellx/plugin.json"))
    fs.readFileSync.mockReturnValue(JSON.stringify({
      name: "shellx",
      commands: [],
      install_guidance: {
        binary: "shellx",
        check: "shellx --version",
        install_steps: ["shellx --version"],
      }
    }))

    const guidance = getPluginInstallGuidance("shellx")
    expect(guidance.binary).toBe("shellx")
    expect(guidance.check).toBe("shellx --version")
  })

  test("falls back to legacy static guidance", () => {
    fs.existsSync.mockImplementation((p) => String(p).endsWith("beads/install-guidance.json"))
    fs.readFileSync.mockReturnValue(JSON.stringify({
      plugin: "beads",
      binary: "br",
      check: "br --version",
      install_steps: ["curl -fsSL ... | bash"],
      note: "Installation delegated."
    }))
    const guidance = getPluginInstallGuidance("beads")
    expect(guidance).not.toBeNull()
    expect(guidance.plugin).toBe("beads")
  })
})
