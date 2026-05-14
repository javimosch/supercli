"use strict"

const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawnSync } = require("child_process")
const { REMOTE_BUNDLED_DIR, REMOTE_CATALOG_FILE } = require("./plugins-store")

const GITHUB_REPO = "javimosch/supercli"
const CATALOG_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/master/plugins/catalog.json`
const TARBALL_URL = `https://github.com/${GITHUB_REPO}/archive/refs/heads/master.tar.gz`
const FETCH_TIMEOUT_MS = 15000

function readLocalCatalog() {
  try {
    if (!fs.existsSync(REMOTE_CATALOG_FILE)) return null
    const parsed = JSON.parse(fs.readFileSync(REMOTE_CATALOG_FILE, "utf-8"))
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

function writeLocalCatalog(catalog) {
  const dir = path.dirname(REMOTE_CATALOG_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(REMOTE_CATALOG_FILE, JSON.stringify(catalog, null, 2) + "\n")
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function fetchRemoteCatalog() {
  const res = await fetchWithTimeout(CATALOG_URL)
  if (!res.ok) {
    throw Object.assign(new Error(`Failed to fetch plugin catalog: ${res.status} ${res.statusText}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: ["Check your internet connection and retry"]
    })
  }
  const catalog = await res.json()
  if (!catalog || !Array.isArray(catalog.plugins)) {
    throw Object.assign(new Error("Invalid remote catalog format"), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }
  return catalog
}

function diffCatalogs(local, remote) {
  const localMap = new Map()
  if (local && Array.isArray(local.plugins)) {
    for (const p of local.plugins) localMap.set(p.name, p.checksum)
  }

  const added = []
  const changed = []
  const unchanged = []

  for (const p of remote.plugins) {
    const localChecksum = localMap.get(p.name)
    if (!localChecksum) {
      added.push(p.name)
    } else if (localChecksum !== p.checksum) {
      changed.push(p.name)
    } else {
      unchanged.push(p.name)
    }
  }

  return { added, changed, unchanged }
}

function downloadTarball(tmpDir) {
  const tarPath = path.join(tmpDir, "supercli-master.tar.gz")
  const res = spawnSync("curl", [
    "-fsSL",
    "--max-time", "15",
    "-o", tarPath,
    TARBALL_URL
  ], { encoding: "utf-8", timeout: 15000 })

  if (res.error) {
    throw Object.assign(new Error(`Failed to download plugin archive: ${res.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: ["Ensure curl is installed and your internet connection is working"]
    })
  }
  if (res.status !== 0) {
    throw Object.assign(new Error(`curl exited with status ${res.status}: ${(res.stderr || "").trim()}`), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }
  if (!fs.existsSync(tarPath) || fs.statSync(tarPath).size === 0) {
    throw Object.assign(new Error("Downloaded archive is empty"), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }
  return tarPath
}

function extractPluginsFromTarball(tarPath, pluginNames, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  // Build include patterns: supercli-master/plugins/<name>/*
  const includes = pluginNames.map(n => `supercli-master/plugins/${n}`)

  const args = [
    "-xzf", tarPath,
    "-C", destDir,
    "--strip-components=2",  // strips "supercli-master/plugins" → plugin dir lands directly in destDir
    "--wildcards",
    ...includes.map(p => `${p}/*`)
  ]

  const res = spawnSync("tar", args, { encoding: "utf-8", timeout: 15000 })

  if (res.error) {
    throw Object.assign(new Error(`Failed to extract plugin archive: ${res.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: ["Ensure tar is installed"]
    })
  }
  // tar may exit non-zero if some wildcards matched nothing — tolerate exit 1
  if (res.status !== 0 && res.status !== 1) {
    throw Object.assign(new Error(`tar exited with status ${res.status}: ${(res.stderr || "").trim()}`), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }
}

/**
 * Main entry point.
 *
 * @param {object} options
 * @param {boolean} [options.check]  - dry-run only, no writes
 * @param {boolean} [options.force]  - ignore local catalog, update everything
 * @returns {Promise<object>} result summary
 */
async function updatePlugins(options = {}) {
  const { check = false, force = false } = options

  const localCatalog = force ? null : readLocalCatalog()
  const remoteCatalog = await fetchRemoteCatalog()
  const diff = diffCatalogs(localCatalog, remoteCatalog)

  const toUpdate = [...diff.added, ...diff.changed]

  const result = {
    remote_count: remoteCatalog.plugins.length,
    added: diff.added.length,
    changed: diff.changed.length,
    unchanged: diff.unchanged.length,
    updated: toUpdate,
    check_only: check,
    up_to_date: toUpdate.length === 0,
  }

  if (check || toUpdate.length === 0) {
    return result
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-update-"))
  try {
    const tarPath = downloadTarball(tmpDir)
    extractPluginsFromTarball(tarPath, toUpdate, REMOTE_BUNDLED_DIR)
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }

  writeLocalCatalog(remoteCatalog)
  result.extracted = toUpdate.length

  return result
}

module.exports = { updatePlugins }
