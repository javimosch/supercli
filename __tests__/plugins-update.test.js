"use strict"

const fs = require("fs")
const path = require("path")
const os = require("os")
const child_process = require("child_process")

jest.mock("fs")
jest.mock("os", () => ({
  homedir: jest.fn(() => "/home/user"),
  tmpdir: jest.fn(() => "/tmp"),
}))
jest.mock("child_process")
jest.mock("../cli/plugins-store", () => ({
  REMOTE_BUNDLED_DIR: "/home/user/.supercli/plugins/bundled",
  REMOTE_CATALOG_FILE: "/home/user/.supercli/plugins/remote-catalog.json",
}))

const {
  diffCatalogs,
  readLocalCatalog,
  writeLocalCatalog,
  downloadTarball,
  extractPluginsFromTarball,
  updatePlugins,
} = require("../cli/plugins-update")

const CATALOG_FILE = "/home/user/.supercli/plugins/remote-catalog.json"
const BUNDLED_DIR = "/home/user/.supercli/plugins/bundled"

beforeEach(() => {
  jest.resetAllMocks()
  os.homedir.mockReturnValue("/home/user")
  os.tmpdir.mockReturnValue("/tmp")
})

// ---------------------------------------------------------------------------
// diffCatalogs — pure checksum comparison
// ---------------------------------------------------------------------------

describe("diffCatalogs", () => {
  const remote = {
    plugins: [
      { name: "alpha", checksum: "aaa" },
      { name: "beta",  checksum: "bbb" },
      { name: "gamma", checksum: "ccc" },
    ],
  }

  test("null local → all remote plugins are added", () => {
    const result = diffCatalogs(null, remote)
    expect(result.added).toEqual(["alpha", "beta", "gamma"])
    expect(result.changed).toEqual([])
    expect(result.unchanged).toEqual([])
  })

  test("empty local plugins array → all remote plugins are added", () => {
    const result = diffCatalogs({ plugins: [] }, remote)
    expect(result.added).toEqual(["alpha", "beta", "gamma"])
    expect(result.changed).toEqual([])
    expect(result.unchanged).toEqual([])
  })

  test("local catalog with identical checksums → all unchanged", () => {
    const local = { plugins: [...remote.plugins] }
    const result = diffCatalogs(local, remote)
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([])
    expect(result.unchanged).toEqual(["alpha", "beta", "gamma"])
  })

  test("stale checksum → plugin reported as changed", () => {
    const local = {
      plugins: [
        { name: "alpha", checksum: "OLD" },
        { name: "beta",  checksum: "bbb" },
        { name: "gamma", checksum: "ccc" },
      ],
    }
    const result = diffCatalogs(local, remote)
    expect(result.changed).toEqual(["alpha"])
    expect(result.unchanged).toEqual(["beta", "gamma"])
    expect(result.added).toEqual([])
  })

  test("mix: one added, one changed, one unchanged", () => {
    const local = {
      plugins: [
        { name: "beta",  checksum: "OLD" },
        { name: "gamma", checksum: "ccc" },
      ],
    }
    const result = diffCatalogs(local, remote)
    expect(result.added).toEqual(["alpha"])
    expect(result.changed).toEqual(["beta"])
    expect(result.unchanged).toEqual(["gamma"])
  })

  test("local with no plugins key → all remote plugins added", () => {
    const result = diffCatalogs({}, remote)
    expect(result.added).toEqual(["alpha", "beta", "gamma"])
  })

  test("remote with empty plugins array → everything empty", () => {
    const local = { plugins: [{ name: "alpha", checksum: "aaa" }] }
    const result = diffCatalogs(local, { plugins: [] })
    expect(result.added).toEqual([])
    expect(result.changed).toEqual([])
    expect(result.unchanged).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// readLocalCatalog — reads catalog from disk
// ---------------------------------------------------------------------------

describe("readLocalCatalog", () => {
  test("returns null when catalog file does not exist", () => {
    fs.existsSync.mockReturnValue(false)
    expect(readLocalCatalog()).toBeNull()
    expect(fs.readFileSync).not.toHaveBeenCalled()
  })

  test("returns parsed catalog when file exists and is valid", () => {
    const catalog = { plugins: [{ name: "p1", checksum: "x" }] }
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify(catalog))
    expect(readLocalCatalog()).toEqual(catalog)
  })

  test("returns null when file contains invalid JSON", () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue("NOT JSON {{{")
    expect(readLocalCatalog()).toBeNull()
  })

  test("returns null when parsed value is null", () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue("null")
    expect(readLocalCatalog()).toBeNull()
  })

  test("returns null when parsed value is not an object (e.g. a number)", () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue("42")
    expect(readLocalCatalog()).toBeNull()
  })

  test("returns null when fs.readFileSync throws", () => {
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockImplementation(() => { throw new Error("EACCES") })
    expect(readLocalCatalog()).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// writeLocalCatalog — persists catalog to disk
// ---------------------------------------------------------------------------

describe("writeLocalCatalog", () => {
  const catalogDir = path.dirname(CATALOG_FILE)
  const catalog = { plugins: [{ name: "p1", checksum: "abc" }] }

  test("creates directory when it does not exist", () => {
    fs.existsSync.mockReturnValue(false)
    writeLocalCatalog(catalog)
    expect(fs.mkdirSync).toHaveBeenCalledWith(catalogDir, { recursive: true })
  })

  test("does not call mkdirSync when directory already exists", () => {
    fs.existsSync.mockReturnValue(true)
    writeLocalCatalog(catalog)
    expect(fs.mkdirSync).not.toHaveBeenCalled()
  })

  test("writes JSON to the catalog file path", () => {
    fs.existsSync.mockReturnValue(true)
    writeLocalCatalog(catalog)
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CATALOG_FILE,
      expect.stringContaining('"name": "p1"')
    )
  })

  test("written JSON ends with a newline", () => {
    fs.existsSync.mockReturnValue(true)
    writeLocalCatalog(catalog)
    const written = fs.writeFileSync.mock.calls[0][1]
    expect(written.endsWith("\n")).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// downloadTarball — curls the archive into tmpDir
// ---------------------------------------------------------------------------

describe("downloadTarball", () => {
  const tmpDir = "/tmp/supercli-update-xyz"
  const tarPath = path.join(tmpDir, "supercli-master.tar.gz")

  test("throws integration_error when spawnSync returns an error", () => {
    child_process.spawnSync.mockReturnValue({ error: new Error("curl not found"), status: null })
    expect(() => downloadTarball(tmpDir)).toThrow("Failed to download plugin archive")
    const err = (() => { try { downloadTarball(tmpDir) } catch (e) { return e } })()
    expect(err.code).toBe(105)
    expect(err.type).toBe("integration_error")
    expect(err.recoverable).toBe(true)
  })

  test("throws when curl exits with non-zero status", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 7, stderr: "connection refused" })
    expect(() => downloadTarball(tmpDir)).toThrow("curl exited with status 7")
    const err = (() => { try { downloadTarball(tmpDir) } catch (e) { return e } })()
    expect(err.code).toBe(105)
  })

  test("throws when downloaded archive does not exist", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0, stderr: "" })
    fs.existsSync.mockReturnValue(false)
    expect(() => downloadTarball(tmpDir)).toThrow("Downloaded archive is empty")
  })

  test("throws when downloaded archive is zero bytes", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0, stderr: "" })
    fs.existsSync.mockReturnValue(true)
    fs.statSync.mockReturnValue({ size: 0 })
    expect(() => downloadTarball(tmpDir)).toThrow("Downloaded archive is empty")
  })

  test("returns tarPath on success", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0, stderr: "" })
    fs.existsSync.mockReturnValue(true)
    fs.statSync.mockReturnValue({ size: 12345 })
    expect(downloadTarball(tmpDir)).toBe(tarPath)
  })
})

// ---------------------------------------------------------------------------
// extractPluginsFromTarball — calls tar to unpack plugin dirs
// ---------------------------------------------------------------------------

describe("extractPluginsFromTarball", () => {
  const tarPath = "/tmp/supercli-master.tar.gz"
  const destDir = BUNDLED_DIR

  beforeEach(() => {
    fs.existsSync.mockReturnValue(false) // dest dir doesn't exist yet
  })

  test("creates destDir when it does not exist", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0 })
    extractPluginsFromTarball(tarPath, ["plugin-a"], destDir)
    expect(fs.mkdirSync).toHaveBeenCalledWith(destDir, { recursive: true })
  })

  test("calls tar with correct args for a single plugin", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0 })
    fs.existsSync.mockReturnValue(true)
    extractPluginsFromTarball(tarPath, ["my-plugin"], destDir)
    const call = child_process.spawnSync.mock.calls[0]
    expect(call[0]).toBe("tar")
    expect(call[1]).toContain("-xzf")
    expect(call[1]).toContain(tarPath)
    expect(call[1]).toContain("supercli-master/plugins/my-plugin")
  })

  test("tolerates tar exit code 2 (some paths not found in archive)", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 2, stderr: "not found" })
    fs.existsSync.mockReturnValue(true)
    expect(() => extractPluginsFromTarball(tarPath, ["missing-plugin"], destDir)).not.toThrow()
  })

  test("throws integration_error when tar exits with status other than 0 or 2", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 1, stderr: "permission denied" })
    fs.existsSync.mockReturnValue(true)
    expect(() => extractPluginsFromTarball(tarPath, ["p"], destDir)).toThrow("tar exited with status 1")
    const err = (() => { try { extractPluginsFromTarball(tarPath, ["p"], destDir) } catch (e) { return e } })()
    expect(err.code).toBe(105)
    expect(err.type).toBe("integration_error")
  })

  test("throws when spawnSync returns an error object", () => {
    child_process.spawnSync.mockReturnValue({ error: new Error("tar not found"), status: null })
    fs.existsSync.mockReturnValue(true)
    expect(() => extractPluginsFromTarball(tarPath, ["p"], destDir)).toThrow("Failed to extract plugin archive")
  })

  test("batches >200 plugins into multiple spawnSync calls", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0 })
    fs.existsSync.mockReturnValue(true)
    const plugins = Array.from({ length: 201 }, (_, i) => `plugin-${i}`)
    extractPluginsFromTarball(tarPath, plugins, destDir)
    expect(child_process.spawnSync).toHaveBeenCalledTimes(2)
  })

  test("exactly 200 plugins uses a single spawnSync call", () => {
    child_process.spawnSync.mockReturnValue({ error: null, status: 0 })
    fs.existsSync.mockReturnValue(true)
    const plugins = Array.from({ length: 200 }, (_, i) => `plugin-${i}`)
    extractPluginsFromTarball(tarPath, plugins, destDir)
    expect(child_process.spawnSync).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// updatePlugins — main orchestrator
// ---------------------------------------------------------------------------

describe("updatePlugins", () => {
  const remoteCatalog = {
    plugins: [
      { name: "alpha", checksum: "aaa" },
      { name: "beta",  checksum: "bbb" },
    ],
  }

  function mockFetch(catalog, ok = true) {
    global.fetch = jest.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? "OK" : "Internal Server Error",
      json: jest.fn().mockResolvedValue(catalog),
    })
  }

  afterEach(() => {
    delete global.fetch
  })

  test("check=true returns result without downloading or writing", async () => {
    mockFetch(remoteCatalog)
    // local catalog has stale checksum → would trigger update without check
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify({ plugins: [{ name: "alpha", checksum: "OLD" }] }))

    const result = await updatePlugins({ check: true })

    expect(result.check_only).toBe(true)
    expect(result.changed).toBe(1)
    expect(child_process.spawnSync).not.toHaveBeenCalled()
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })

  test("up_to_date catalog returns without downloading", async () => {
    mockFetch(remoteCatalog)
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify(remoteCatalog))

    const result = await updatePlugins()

    expect(result.up_to_date).toBe(true)
    expect(result.added).toBe(0)
    expect(result.changed).toBe(0)
    expect(child_process.spawnSync).not.toHaveBeenCalled()
  })

  test("force=true ignores local catalog and updates all plugins", async () => {
    mockFetch(remoteCatalog)
    // local catalog matches → normally would be unchanged
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify(remoteCatalog))
    fs.mkdtempSync = jest.fn().mockReturnValue("/tmp/supercli-update-abc")
    child_process.spawnSync.mockReturnValue({ error: null, status: 0, stderr: "" })
    fs.statSync.mockReturnValue({ size: 99999 })
    fs.rmSync = jest.fn()

    const result = await updatePlugins({ force: true })

    // force ignores local → all are added
    expect(result.added).toBe(2)
    expect(result.updated).toEqual(["alpha", "beta"])
  })

  test("stale catalog triggers download, extract, and catalog write", async () => {
    mockFetch(remoteCatalog)
    // local has stale alpha checksum
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ plugins: [{ name: "alpha", checksum: "OLD" }, { name: "beta", checksum: "bbb" }] })
    )
    fs.mkdtempSync = jest.fn().mockReturnValue("/tmp/supercli-update-abc")
    child_process.spawnSync.mockReturnValue({ error: null, status: 0, stderr: "" })
    fs.statSync.mockReturnValue({ size: 9999 })
    fs.rmSync = jest.fn()

    const result = await updatePlugins()

    expect(result.changed).toBe(1)
    expect(result.updated).toEqual(["alpha"])
    expect(result.extracted).toBe(1)
    // catalog must be written with the new remote catalog
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CATALOG_FILE,
      expect.stringContaining('"aaa"')
    )
  })

  test("tmpDir is cleaned up (rmSync) even when extraction throws", async () => {
    mockFetch(remoteCatalog)
    fs.existsSync.mockImplementation((p) => p !== CATALOG_FILE)
    fs.readFileSync.mockReturnValue("{}")
    fs.mkdtempSync = jest.fn().mockReturnValue("/tmp/supercli-update-fail")
    // curl succeeds but tar fails
    child_process.spawnSync
      .mockReturnValueOnce({ error: null, status: 0, stderr: "" }) // curl
      .mockReturnValueOnce({ error: null, status: 1, stderr: "bad archive" }) // tar
    fs.statSync.mockReturnValue({ size: 1 })
    fs.rmSync = jest.fn()

    await expect(updatePlugins()).rejects.toThrow()
    expect(fs.rmSync).toHaveBeenCalledWith(
      "/tmp/supercli-update-fail",
      { recursive: true, force: true }
    )
  })

  test("result includes remote_count matching remote catalog plugins length", async () => {
    mockFetch(remoteCatalog)
    fs.existsSync.mockReturnValue(true)
    fs.readFileSync.mockReturnValue(JSON.stringify(remoteCatalog))

    const result = await updatePlugins()

    expect(result.remote_count).toBe(2)
  })

  test("throws when remote catalog fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    })
    fs.existsSync.mockReturnValue(false)
    await expect(updatePlugins()).rejects.toThrow("Failed to fetch plugin catalog")
    const err = await updatePlugins().catch(e => e)
    expect(err.code).toBe(105)
  })

  test("throws when remote catalog has invalid format", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ plugins: "not-an-array" }),
    })
    fs.existsSync.mockReturnValue(false)
    await expect(updatePlugins()).rejects.toThrow("Invalid remote catalog format")
  })
})
