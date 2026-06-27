"use strict"

jest.mock("fs")
jest.mock("child_process")

const fs = require("fs")
const childProcess = require("child_process")
const updater = require("../cli/updater")

beforeEach(() => {
  jest.resetAllMocks()
})

afterEach(() => {
  delete global.fetch
})

// ─── helpers ──────────────────────────────────────────────────────────────────

function mockFetchOk(json) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => json,
    arrayBuffer: async () => new ArrayBuffer(0),
  })
}

function mockFetchFail(status, statusText) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: status || 503,
    statusText: statusText || "Service Unavailable",
  })
}

function mockFetchAbort() {
  global.fetch = jest.fn().mockRejectedValue(
    Object.assign(new Error("The operation was aborted"), { name: "AbortError" })
  )
}

// ─── fetchLatestVersion ────────────────────────────────────────────────────────

describe("fetchLatestVersion", () => {
  test("returns version string from npm registry", async () => {
    mockFetchOk({ version: "1.32.0" })
    const v = await updater.fetchLatestVersion()
    expect(v).toBe("1.32.0")
  })

  test("requests the correct npm registry URL", async () => {
    mockFetchOk({ version: "1.32.0" })
    await updater.fetchLatestVersion()
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/${updater.PACKAGE_NAME}/latest`),
      expect.any(Object)
    )
  })

  test("throws integration_error on non-ok HTTP status", async () => {
    mockFetchFail(404, "Not Found")
    await expect(updater.fetchLatestVersion()).rejects.toMatchObject({
      code: 110,
      type: "integration_error",
    })
  })

  test("throws integration_error on 503", async () => {
    mockFetchFail(503, "Service Unavailable")
    await expect(updater.fetchLatestVersion()).rejects.toThrow(
      "Failed to fetch latest version"
    )
  })

  test("throws on missing version field in registry response", async () => {
    mockFetchOk({ name: "superacli" })
    await expect(updater.fetchLatestVersion()).rejects.toMatchObject({
      code: 110,
      type: "integration_error",
    })
  })

  test("throws on empty version string", async () => {
    mockFetchOk({ version: "" })
    await expect(updater.fetchLatestVersion()).rejects.toMatchObject({
      code: 110,
    })
  })

  test("throws on null registry response body", async () => {
    mockFetchOk(null)
    await expect(updater.fetchLatestVersion()).rejects.toMatchObject({
      code: 110,
    })
  })

  test("propagates network/abort error", async () => {
    mockFetchAbort()
    await expect(updater.fetchLatestVersion()).rejects.toThrow("aborted")
  })
})

// ─── downloadTarball ──────────────────────────────────────────────────────────

describe("downloadTarball", () => {
  test("writes file to destPath on ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    })
    fs.writeFileSync.mockImplementation(() => {})
    const dest = await updater.downloadTarball("1.32.0", "/tmp/pkg.tgz")
    expect(dest).toBe("/tmp/pkg.tgz")
    expect(fs.writeFileSync).toHaveBeenCalledWith("/tmp/pkg.tgz", expect.any(Buffer))
  })

  test("requests correct tarball URL", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(0),
    })
    fs.writeFileSync.mockImplementation(() => {})
    await updater.downloadTarball("1.32.0", "/tmp/pkg.tgz")
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`superacli-1.32.0.tgz`),
      expect.any(Object)
    )
  })

  test("throws integration_error on non-ok HTTP status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    })
    await expect(updater.downloadTarball("1.32.0", "/tmp/pkg.tgz")).rejects.toMatchObject({
      code: 111,
      type: "integration_error",
    })
  })

  test("does not write file on download failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    })
    fs.writeFileSync.mockImplementation(() => {})
    await expect(updater.downloadTarball("1.32.0", "/tmp/pkg.tgz")).rejects.toBeTruthy()
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })

  test("propagates network error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network timeout"))
    await expect(updater.downloadTarball("1.32.0", "/tmp/pkg.tgz")).rejects.toThrow(
      "network timeout"
    )
  })
})

// ─── computeFileHash ──────────────────────────────────────────────────────────

describe("computeFileHash", () => {
  test("returns sha256 hex for file content", () => {
    const content = Buffer.from("hello world")
    fs.readFileSync.mockReturnValue(content)
    const hash = updater.computeFileHash("/some/file.tgz")
    expect(typeof hash).toBe("string")
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })

  test("different content produces different hash", () => {
    fs.readFileSync
      .mockReturnValueOnce(Buffer.from("content-a"))
      .mockReturnValueOnce(Buffer.from("content-b"))
    const h1 = updater.computeFileHash("/a.tgz")
    const h2 = updater.computeFileHash("/b.tgz")
    expect(h1).not.toBe(h2)
  })

  test("same content always produces same hash", () => {
    const buf = Buffer.from("deterministic")
    fs.readFileSync.mockReturnValue(buf)
    const h1 = updater.computeFileHash("/f.tgz")
    const h2 = updater.computeFileHash("/f.tgz")
    expect(h1).toBe(h2)
  })

  test("uses specified algorithm (md5 produces 32-char hex)", () => {
    fs.readFileSync.mockReturnValue(Buffer.from("test"))
    const hash = updater.computeFileHash("/f.tgz", "md5")
    expect(hash).toHaveLength(32)
  })
})

// ─── verifyIntegrity ──────────────────────────────────────────────────────────

describe("verifyIntegrity", () => {
  test("returns true when hash matches", () => {
    const buf = Buffer.from("exact content")
    // first call: computeFileHash inside verifyIntegrity; second call never happens
    fs.readFileSync.mockReturnValue(buf)
    // compute expected hash using the real crypto to get the right value
    const crypto = require("crypto")
    const expected = crypto.createHash("sha256").update(buf).digest("hex")
    expect(updater.verifyIntegrity("/f.tgz", expected)).toBe(true)
  })

  test("throws integrity_error when hash mismatches", () => {
    fs.readFileSync.mockReturnValue(Buffer.from("real content"))
    let err = null
    try {
      updater.verifyIntegrity("/f.tgz", "deadbeef")
    } catch (e) {
      err = e
    }
    expect(err).not.toBeNull()
    expect(err.code).toBe(112)
    expect(err.type).toBe("integrity_error")
  })

  test("error message includes expected and actual hashes", () => {
    fs.readFileSync.mockReturnValue(Buffer.from("data"))
    let err = null
    try {
      updater.verifyIntegrity("/f.tgz", "expected-hash-value")
    } catch (e) {
      err = e
    }
    expect(err.message).toContain("expected-hash-value")
  })

  test("integrity_error is not recoverable", () => {
    fs.readFileSync.mockReturnValue(Buffer.from("data"))
    let err = null
    try {
      updater.verifyIntegrity("/f.tgz", "wrong")
    } catch (e) {
      err = e
    }
    expect(err.recoverable).toBe(false)
  })
})

// ─── backupCurrentInstall ─────────────────────────────────────────────────────

describe("backupCurrentInstall", () => {
  function setupFsForCopy(files) {
    // files: { [absPath]: { isDir: bool, children?: string[] } }
    fs.existsSync.mockImplementation(p => p in files)
    fs.readdirSync.mockImplementation(p => {
      const entry = files[p]
      if (!entry || !entry.isDir) return []
      return entry.children || []
    })
    fs.statSync.mockImplementation(p => ({
      isDirectory: () => !!(files[p] && files[p].isDir),
    }))
    fs.mkdirSync.mockImplementation(() => {})
    fs.rmSync.mockImplementation(() => {})
    fs.copyFileSync.mockImplementation(() => {})
  }

  test("removes existing backup before copying", () => {
    setupFsForCopy({
      "/install": { isDir: true, children: [] },
      "/backup": { isDir: true, children: [] },
      "/": { isDir: true, children: [] },
    })
    updater.backupCurrentInstall("/install", "/backup")
    expect(fs.rmSync).toHaveBeenCalledWith("/backup", expect.objectContaining({ recursive: true }))
  })

  test("does not remove backup if it does not exist", () => {
    setupFsForCopy({
      "/install": { isDir: true, children: [] },
      "/tmp": { isDir: true, children: [] },
    })
    updater.backupCurrentInstall("/install", "/tmp/backup")
    expect(fs.rmSync).not.toHaveBeenCalled()
  })

  test("returns backupDir path", () => {
    setupFsForCopy({
      "/install": { isDir: true, children: [] },
      "/tmp": { isDir: true, children: [] },
    })
    const result = updater.backupCurrentInstall("/install", "/tmp/backup")
    expect(result).toBe("/tmp/backup")
  })

  test("copies files from installDir to backupDir", () => {
    setupFsForCopy({
      "/install": { isDir: true, children: ["file.js"] },
      "/install/file.js": { isDir: false },
      "/tmp": { isDir: true, children: [] },
    })
    updater.backupCurrentInstall("/install", "/tmp/backup")
    expect(fs.copyFileSync).toHaveBeenCalledWith("/install/file.js", "/tmp/backup/file.js")
  })

  test("recurses into subdirectories", () => {
    setupFsForCopy({
      "/install": { isDir: true, children: ["sub"] },
      "/install/sub": { isDir: true, children: ["nested.js"] },
      "/install/sub/nested.js": { isDir: false },
      "/tmp": { isDir: true, children: [] },
    })
    updater.backupCurrentInstall("/install", "/tmp/backup")
    expect(fs.copyFileSync).toHaveBeenCalledWith(
      "/install/sub/nested.js",
      "/tmp/backup/sub/nested.js"
    )
  })
})

// ─── restoreBackup ────────────────────────────────────────────────────────────

describe("restoreBackup", () => {
  test("throws rollback_error when backup does not exist", () => {
    fs.existsSync.mockReturnValue(false)
    let err = null
    try {
      updater.restoreBackup("/tmp/backup", "/install")
    } catch (e) {
      err = e
    }
    expect(err).not.toBeNull()
    expect(err.code).toBe(113)
    expect(err.type).toBe("rollback_error")
  })

  test("throws with path in message when backup missing", () => {
    fs.existsSync.mockReturnValue(false)
    let err = null
    try {
      updater.restoreBackup("/tmp/missing-backup", "/install")
    } catch (e) {
      err = e
    }
    expect(err.message).toContain("/tmp/missing-backup")
  })

  test("returns true on successful restore", () => {
    fs.existsSync.mockImplementation(p => p === "/tmp/backup")
    fs.rmSync.mockImplementation(() => {})
    fs.readdirSync.mockReturnValue([])
    fs.mkdirSync.mockImplementation(() => {})
    const result = updater.restoreBackup("/tmp/backup", "/install")
    expect(result).toBe(true)
  })

  test("removes installDir before restoring backup", () => {
    fs.existsSync.mockImplementation(() => true)
    fs.rmSync.mockImplementation(() => {})
    fs.readdirSync.mockReturnValue([])
    fs.mkdirSync.mockImplementation(() => {})
    updater.restoreBackup("/tmp/backup", "/install")
    expect(fs.rmSync).toHaveBeenCalledWith("/install", expect.objectContaining({ recursive: true }))
  })

  test("does not remove installDir if it does not exist", () => {
    fs.existsSync.mockImplementation(p => p === "/tmp/backup")
    fs.rmSync.mockImplementation(() => {})
    fs.readdirSync.mockReturnValue([])
    fs.mkdirSync.mockImplementation(() => {})
    updater.restoreBackup("/tmp/backup", "/install")
    expect(fs.rmSync).not.toHaveBeenCalled()
  })
})

// ─── applyUpdate ─────────────────────────────────────────────────────────────

describe("applyUpdate", () => {
  test("calls tar with correct arguments", () => {
    childProcess.spawnSync.mockReturnValue({ status: 0, stderr: "" })
    updater.applyUpdate("/tmp/pkg.tgz", "/install")
    expect(childProcess.spawnSync).toHaveBeenCalledWith(
      "tar",
      ["-xzf", "/tmp/pkg.tgz", "-C", "/install", "--strip-components=1"],
      expect.any(Object)
    )
  })

  test("returns true on successful extraction", () => {
    childProcess.spawnSync.mockReturnValue({ status: 0, stderr: "" })
    expect(updater.applyUpdate("/tmp/pkg.tgz", "/install")).toBe(true)
  })

  test("throws install_error on non-zero exit code", () => {
    childProcess.spawnSync.mockReturnValue({ status: 1, stderr: "tar: error" })
    let err = null
    try {
      updater.applyUpdate("/tmp/pkg.tgz", "/install")
    } catch (e) {
      err = e
    }
    expect(err).not.toBeNull()
    expect(err.code).toBe(114)
    expect(err.type).toBe("install_error")
  })

  test("error message includes stderr output", () => {
    childProcess.spawnSync.mockReturnValue({ status: 2, stderr: "corrupted archive" })
    let err = null
    try {
      updater.applyUpdate("/tmp/pkg.tgz", "/install")
    } catch (e) {
      err = e
    }
    expect(err.message).toContain("corrupted archive")
  })

  test("install_error is not recoverable", () => {
    childProcess.spawnSync.mockReturnValue({ status: 1, stderr: "" })
    let err = null
    try {
      updater.applyUpdate("/tmp/pkg.tgz", "/install")
    } catch (e) {
      err = e
    }
    expect(err.recoverable).toBe(false)
  })
})

// ─── selfUpdate (orchestrator) ────────────────────────────────────────────────

describe("selfUpdate", () => {
  const INSTALL_DIR = "/install"
  const TMP_DIR = "/tmp"
  const CURRENT = "1.31.0"
  const LATEST = "1.32.0"

  function setupFs() {
    fs.existsSync.mockReturnValue(false)
    fs.mkdirSync.mockImplementation(() => {})
    fs.rmSync.mockImplementation(() => {})
    fs.readdirSync.mockReturnValue([])
    fs.writeFileSync.mockImplementation(() => {})
    fs.copyFileSync.mockImplementation(() => {})
    fs.statSync.mockImplementation(() => ({ isDirectory: () => false }))
  }

  function mockFetchSequence(latestVersion, tarballOk) {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ version: latestVersion }),
      })
      .mockResolvedValueOnce({
        ok: tarballOk !== false,
        status: tarballOk !== false ? 200 : 503,
        statusText: tarballOk !== false ? "OK" : "Service Unavailable",
        arrayBuffer: async () => new ArrayBuffer(4),
      })
  }

  test("returns {updated: false} when already on latest version", async () => {
    mockFetchOk({ version: CURRENT })
    const result = await updater.selfUpdate({
      currentVersion: CURRENT,
      installDir: INSTALL_DIR,
      tmpDir: TMP_DIR,
    })
    expect(result).toEqual({ updated: false, version: CURRENT })
  })

  test("does not download tarball when already up to date", async () => {
    mockFetchOk({ version: CURRENT })
    await updater.selfUpdate({
      currentVersion: CURRENT,
      installDir: INSTALL_DIR,
      tmpDir: TMP_DIR,
    })
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  test("returns {updated: true, version, previousVersion} after successful update", async () => {
    setupFs()
    childProcess.spawnSync.mockReturnValue({ status: 0, stderr: "" })
    mockFetchSequence(LATEST, true)
    const result = await updater.selfUpdate({
      currentVersion: CURRENT,
      installDir: INSTALL_DIR,
      tmpDir: TMP_DIR,
    })
    expect(result).toEqual({
      updated: true,
      version: LATEST,
      previousVersion: CURRENT,
    })
  })

  test("downloads tarball when new version is available", async () => {
    setupFs()
    childProcess.spawnSync.mockReturnValue({ status: 0, stderr: "" })
    mockFetchSequence(LATEST, true)
    await updater.selfUpdate({
      currentVersion: CURRENT,
      installDir: INSTALL_DIR,
      tmpDir: TMP_DIR,
    })
    expect(global.fetch).toHaveBeenCalledTimes(2)
    const secondCall = global.fetch.mock.calls[1][0]
    expect(secondCall).toContain("1.32.0")
  })

  test("skips integrity check when expectedHash is not provided", async () => {
    setupFs()
    childProcess.spawnSync.mockReturnValue({ status: 0, stderr: "" })
    mockFetchSequence(LATEST, true)
    await expect(
      updater.selfUpdate({ currentVersion: CURRENT, installDir: INSTALL_DIR, tmpDir: TMP_DIR })
    ).resolves.toMatchObject({ updated: true })
  })

  test("rolls back and re-throws when applyUpdate fails", async () => {
    setupFs()
    // Make backup appear to exist so restoreBackup doesn't throw its own error
    fs.existsSync.mockImplementation(p => p.includes("backup"))
    childProcess.spawnSync.mockReturnValue({ status: 1, stderr: "disk full" })
    mockFetchSequence(LATEST, true)
    let err = null
    try {
      await updater.selfUpdate({
        currentVersion: CURRENT,
        installDir: INSTALL_DIR,
        tmpDir: TMP_DIR,
      })
    } catch (e) {
      err = e
    }
    expect(err).not.toBeNull()
    expect(err.code).toBe(114)
  })

  test("rollback on apply failure calls copyDirSync for restore", async () => {
    setupFs()
    childProcess.spawnSync.mockReturnValue({ status: 1, stderr: "disk full" })
    // mark backup as existing so restoreBackup doesn't throw
    fs.existsSync.mockImplementation(p => p.includes("backup"))
    mockFetchSequence(LATEST, true)
    let err = null
    try {
      await updater.selfUpdate({
        currentVersion: CURRENT,
        installDir: INSTALL_DIR,
        tmpDir: TMP_DIR,
      })
    } catch (e) {
      err = e
    }
    expect(err.code).toBe(114)
    // restoreBackup called mkdirSync for installDir
    expect(fs.mkdirSync).toHaveBeenCalled()
  })

  test("throws when version fetch fails", async () => {
    mockFetchFail(503, "Service Unavailable")
    await expect(
      updater.selfUpdate({ currentVersion: CURRENT, installDir: INSTALL_DIR, tmpDir: TMP_DIR })
    ).rejects.toMatchObject({ code: 110 })
  })

  test("throws when tarball download fails", async () => {
    setupFs()
    mockFetchSequence(LATEST, false)
    await expect(
      updater.selfUpdate({ currentVersion: CURRENT, installDir: INSTALL_DIR, tmpDir: TMP_DIR })
    ).rejects.toMatchObject({ code: 111 })
  })
})

// ─── exported constants ────────────────────────────────────────────────────────

describe("module constants", () => {
  test("PACKAGE_NAME is superacli", () => {
    expect(updater.PACKAGE_NAME).toBe("superacli")
  })

  test("NPM_REGISTRY_URL points to registry.npmjs.org", () => {
    expect(updater.NPM_REGISTRY_URL).toBe("https://registry.npmjs.org")
  })

  test("FETCH_TIMEOUT_MS is a positive number", () => {
    expect(typeof updater.FETCH_TIMEOUT_MS).toBe("number")
    expect(updater.FETCH_TIMEOUT_MS).toBeGreaterThan(0)
  })
})
