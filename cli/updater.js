"use strict"

const fs = require("fs")
const path = require("path")
const os = require("os")
const crypto = require("crypto")
const { spawnSync } = require("child_process")

const NPM_REGISTRY_URL = "https://registry.npmjs.org"
const PACKAGE_NAME = "superacli"
const FETCH_TIMEOUT_MS = 15000

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

async function fetchLatestVersion() {
  const res = await fetchWithTimeout(`${NPM_REGISTRY_URL}/${PACKAGE_NAME}/latest`)
  if (!res.ok) {
    throw Object.assign(
      new Error(`Failed to fetch latest version: ${res.status} ${res.statusText}`),
      { code: 110, type: "integration_error", recoverable: true }
    )
  }
  const data = await res.json()
  if (!data || typeof data.version !== "string" || !data.version) {
    throw Object.assign(
      new Error("Invalid npm registry response: missing version field"),
      { code: 110, type: "integration_error", recoverable: true }
    )
  }
  return data.version
}

async function downloadTarball(version, destPath) {
  const url = `${NPM_REGISTRY_URL}/${PACKAGE_NAME}/-/${PACKAGE_NAME}-${version}.tgz`
  const res = await fetchWithTimeout(url)
  if (!res.ok) {
    throw Object.assign(
      new Error(`Failed to download tarball: ${res.status} ${res.statusText}`),
      { code: 111, type: "integration_error", recoverable: true }
    )
  }
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(destPath, buf)
  return destPath
}

function computeFileHash(filePath, algorithm) {
  const alg = algorithm || "sha256"
  const buf = fs.readFileSync(filePath)
  return crypto.createHash(alg).update(buf).digest("hex")
}

function verifyIntegrity(filePath, expectedHash, algorithm) {
  const actual = computeFileHash(filePath, algorithm || "sha256")
  if (actual !== expectedHash) {
    throw Object.assign(
      new Error(`Integrity check failed: expected ${expectedHash}, got ${actual}`),
      { code: 112, type: "integrity_error", recoverable: false }
    )
  }
  return true
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry)
    const destPath = path.join(dest, entry)
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function backupCurrentInstall(installDir, backupDir) {
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true })
  }
  const parentDir = path.dirname(backupDir)
  if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true })
  copyDirSync(installDir, backupDir)
  return backupDir
}

function restoreBackup(backupDir, installDir) {
  if (!fs.existsSync(backupDir)) {
    throw Object.assign(
      new Error(`Backup not found at: ${backupDir}`),
      { code: 113, type: "rollback_error", recoverable: false }
    )
  }
  if (fs.existsSync(installDir)) {
    fs.rmSync(installDir, { recursive: true, force: true })
  }
  copyDirSync(backupDir, installDir)
  return true
}

function applyUpdate(tarballPath, installDir) {
  const result = spawnSync(
    "tar",
    ["-xzf", tarballPath, "-C", installDir, "--strip-components=1"],
    { encoding: "utf-8" }
  )
  if (result.status !== 0) {
    throw Object.assign(
      new Error(`Failed to extract update tarball: ${result.stderr || "unknown error"}`),
      { code: 114, type: "install_error", recoverable: false }
    )
  }
  return true
}

async function selfUpdate(options) {
  const opts = options || {}
  const currentVersion = opts.currentVersion
  const installDir = opts.installDir || path.dirname(path.dirname(__filename))
  const tmpDir = opts.tmpDir || os.tmpdir()
  const expectedHash = opts.expectedHash || null
  const hashAlgorithm = opts.hashAlgorithm || "sha256"

  const latestVersion = await fetchLatestVersion()

  if (latestVersion === currentVersion) {
    return { updated: false, version: currentVersion }
  }

  const tarballPath = path.join(tmpDir, `${PACKAGE_NAME}-${latestVersion}.tgz`)
  const backupDir = path.join(tmpDir, `${PACKAGE_NAME}-backup-${currentVersion}`)

  await downloadTarball(latestVersion, tarballPath)

  if (expectedHash) {
    verifyIntegrity(tarballPath, expectedHash, hashAlgorithm)
  }

  backupCurrentInstall(installDir, backupDir)

  try {
    applyUpdate(tarballPath, installDir)
  } catch (err) {
    restoreBackup(backupDir, installDir)
    throw err
  }

  return { updated: true, version: latestVersion, previousVersion: currentVersion }
}

module.exports = {
  fetchLatestVersion,
  downloadTarball,
  computeFileHash,
  verifyIntegrity,
  backupCurrentInstall,
  restoreBackup,
  applyUpdate,
  copyDirSync,
  selfUpdate,
  NPM_REGISTRY_URL,
  PACKAGE_NAME,
  FETCH_TIMEOUT_MS,
}
