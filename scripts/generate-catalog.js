#!/usr/bin/env node
"use strict"

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const PLUGINS_DIR = path.join(__dirname, "..", "plugins")
const OUTPUT_FILE = path.join(PLUGINS_DIR, "catalog.json")

function pluginChecksum(pluginDir) {
  const manifestPath = path.join(pluginDir, "plugin.json")
  const metaPath = path.join(pluginDir, "meta.json")

  const parts = []
  if (fs.existsSync(manifestPath)) {
    parts.push(fs.readFileSync(manifestPath, "utf-8"))
  }
  if (fs.existsSync(metaPath)) {
    parts.push(fs.readFileSync(metaPath, "utf-8"))
  }
  if (parts.length === 0) return null
  return crypto.createHash("sha256").update(parts.join("\n")).digest("hex").slice(0, 16)
}

function trackedPluginNames() {
  // Use git ls-files to find only git-tracked plugin dirs (skips gitignored dirs)
  const { spawnSync } = require("child_process")
  const res = spawnSync("git", ["ls-files", "--", "plugins/"], {
    encoding: "utf-8",
    cwd: path.join(__dirname, ".."),
    timeout: 15000,
  })
  if (res.error || res.status !== 0) return null  // fall back to fs scan if git unavailable
  const names = new Set()
  for (const line of res.stdout.split("\n")) {
    const m = line.match(/^plugins\/([^/]+)\//)
    if (m) names.add(m[1])
  }
  return names
}

function discoverPlugins() {
  let entries
  try {
    entries = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
  } catch {
    return []
  }

  const tracked = trackedPluginNames()

  const plugins = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    // Skip directories not tracked by git (e.g. gitignored output dirs)
    if (tracked && !tracked.has(entry.name)) continue
    const pluginDir = path.join(PLUGINS_DIR, entry.name)
    const manifestPath = path.join(pluginDir, "plugin.json")
    if (!fs.existsSync(manifestPath)) continue
    const checksum = pluginChecksum(pluginDir)
    if (!checksum) continue
    plugins.push({ name: entry.name, checksum })
  }

  plugins.sort((a, b) => a.name.localeCompare(b.name))
  return plugins
}

function main() {
  const plugins = discoverPlugins()

  const catalog = {
    version: 1,
    generated_at: new Date().toISOString(),
    count: plugins.length,
    plugins,
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2) + "\n")
  console.log(`Generated catalog with ${plugins.length} plugins → ${OUTPUT_FILE}`)
}

main()
