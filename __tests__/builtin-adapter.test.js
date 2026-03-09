const { execute } = require("../cli/adapters/builtin")

describe("builtin adapter", () => {
  test("returns beads install steps", () => {
    const result = execute({ adapterConfig: { builtin: "beads_install_steps" } })
    expect(result.plugin).toBe("beads")
    expect(result.install_steps).toContain("br --version")
  })

  test("returns gwc install steps", () => {
    const result = execute({ adapterConfig: { builtin: "gwc_install_steps" } })
    expect(result.plugin).toBe("gwc")
    expect(result.install_steps).toContain("gws --version")
  })

  test("returns commiat install steps", () => {
    const result = execute({ adapterConfig: { builtin: "commiat_install_steps" } })
    expect(result.plugin).toBe("commiat")
    expect(result.install_steps).toContain("commiat --version")
  })

  test("throws for unknown builtin action", () => {
    expect(() => execute({ adapterConfig: { builtin: "unknown" } })).toThrow(/Unknown builtin action: unknown/)
  })

  test("throws for missing builtin action", () => {
    expect(() => execute({ adapterConfig: {} })).toThrow(/Unknown builtin action: \(missing\)/)
  })
})
