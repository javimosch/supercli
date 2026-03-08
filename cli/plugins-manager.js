const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawnSync } = require("child_process")
const { SUPPORTED_ADAPTERS } = require("./adapter-schema")
const { getRegistryPlugin } = require("./plugins-registry")
const {
  readPluginsLock,
  writePluginsLock,
  listInstalledPlugins
} = require("./plugins-store")

const BUNDLED_PLUGINS = {
  beads: path.resolve(__dirname, "..", "plugins", "beads", "plugin.json"),
  gwc: path.resolve(__dirname, "..", "plugins", "gwc", "plugin.json"),
  docker: path.resolve(__dirname, "..", "plugins", "docker", "plugin.json")
}

const PLUGIN_INSTALL_GUIDANCE = {
  beads: {
    plugin: "beads",
    binary: "br",
    check: "br --version",
    install_steps: [
      "curl -fsSL \"https://raw.githubusercontent.com/Dicklesworthstone/beads_rust/main/install.sh?$(date +%s)\" | bash",
      "br --version"
    ],
    note: "Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli)."
  },
  gwc: {
    plugin: "gwc",
    binary: "gws",
    check: "gws --version",
    install_steps: [
      "npm install -g @googleworkspace/cli",
      "gws --version"
    ],
    note: "Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli)."
  },
  commiat: {
    plugin: "commiat",
    binary: "commiat",
    check: "commiat --version",
    install_steps: [
      "npm install -g commiat",
      "commiat --version"
    ],
    note: "Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli)."
  },
  docker: {
    plugin: "docker",
    binary: "docker",
    check: "docker --version",
    install_steps: [
      "docker --version"
    ],
    note: "Install Docker Engine/Desktop using your OS package manager, then verify with docker --version."
  },
  stripe: {
    plugin: "stripe",
    binary: "stripe",
    check: "stripe --version",
    install_steps: [
      "brew install stripe/stripe-cli/stripe",
      "stripe --version",
      "stripe login"
    ],
    note: "Install Stripe CLI and authenticate with stripe login before running API commands."
  }
}

function commandKey(cmd) {
  return `${cmd.namespace}.${cmd.resource}.${cmd.action}`
}

function resolveManifestPath(ref) {
  const base = BUNDLED_PLUGINS[ref] || path.resolve(ref)
  if (!fs.existsSync(base)) return null
  const st = fs.statSync(base)
  if (st.isDirectory()) return path.join(base, "plugin.json")
  return base
}

function parseManifestFile(manifestPath) {
  let raw
  try {
    raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  } catch (err) {
    throw Object.assign(new Error(`Invalid plugin manifest at ${manifestPath}: ${err.message}`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }
  if (!raw.name || !Array.isArray(raw.commands)) {
    throw Object.assign(new Error("Invalid plugin manifest: missing name or commands"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }
  return raw
}

function resolveRepoManifestPath(baseDir, manifestPath) {
  const relative = manifestPath || "plugin.json"
  const candidate = path.resolve(baseDir, relative)
  const normalizedBase = path.resolve(baseDir) + path.sep
  if (!candidate.startsWith(normalizedBase)) {
    throw Object.assign(new Error(`Invalid manifest path '${relative}'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }
  return candidate
}

function loadManifestFromGit(repo, options = {}) {
  if (!repo || typeof repo !== "string") {
    throw Object.assign(new Error("Missing git repo URL/path for plugin install"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-plugin-"))
  try {
    const args = ["clone", "--depth", "1"]
    if (options.ref) {
      args.push("--branch", String(options.ref), "--single-branch")
    }
    args.push(repo, tmpDir)
    const clone = spawnSync("git", args, { encoding: "utf-8", timeout: 15000 })

    if (clone.error) {
      const suggestion = clone.error.code === "ENOENT"
        ? ["Install git and retry"]
        : []
      throw Object.assign(new Error(`Failed to clone plugin repo '${repo}': ${clone.error.message}`), {
        code: 105,
        type: "integration_error",
        recoverable: true,
        suggestions: suggestion
      })
    }
    if (clone.status !== 0) {
      throw Object.assign(new Error(`Failed to clone plugin repo '${repo}': ${(clone.stderr || "").trim() || `exit ${clone.status}`}`), {
        code: 105,
        type: "integration_error",
        recoverable: true
      })
    }

    const manifestPath = resolveRepoManifestPath(tmpDir, options.manifestPath)
    if (!fs.existsSync(manifestPath)) {
      throw Object.assign(new Error(`Plugin manifest not found in repo: ${options.manifestPath || "plugin.json"}`), {
        code: 92,
        type: "resource_not_found",
        recoverable: false
      })
    }

    return {
      manifest: parseManifestFile(manifestPath),
      resolvedFrom: {
        type: "git",
        repo,
        ref: options.ref || null,
        manifest_path: options.manifestPath || "plugin.json"
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

function resolveRegistrySource(name) {
  const entry = getRegistryPlugin(name)
  if (!entry) return null

  const source = entry.source || {}
  const sourceType = source.type || "bundled"

  if (sourceType === "git") {
    return {
      type: "git",
      entry,
      repo: source.repo,
      ref: source.ref,
      manifestPath: source.manifest_path
    }
  }

  const manifestPath = source.manifest_path || `plugins/${entry.name}/plugin.json`
  const absolute = path.resolve(__dirname, "..", manifestPath)
  return {
    type: "path",
    entry,
    manifestPath: absolute
  }
}

function loadPluginManifest(ref, options = {}) {
  if (options.git) {
    return loadManifestFromGit(options.git, {
      ref: options.ref,
      manifestPath: options.manifestPath
    })
  }

  const directManifestPath = resolveManifestPath(ref)
  if (directManifestPath && fs.existsSync(directManifestPath)) {
    return {
      manifest: parseManifestFile(directManifestPath),
      resolvedFrom: {
        type: "path",
        manifest_path: directManifestPath
      }
    }
  }

  const registrySource = resolveRegistrySource(ref)
  if (!registrySource) {
    throw Object.assign(new Error(`Plugin '${ref}' not found`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
      suggestions: ["Run: dcli plugins explore"]
    })
  }

  if (registrySource.type === "git") {
    return loadManifestFromGit(registrySource.repo, {
      ref: registrySource.ref,
      manifestPath: registrySource.manifestPath
    })
  }

  if (!registrySource.manifestPath || !fs.existsSync(registrySource.manifestPath)) {
    throw Object.assign(new Error(`Plugin manifest not found for '${ref}'`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false
    })
  }

  return {
    manifest: parseManifestFile(registrySource.manifestPath),
    resolvedFrom: {
      type: "registry",
      name: ref,
      manifest_path: registrySource.manifestPath
    }
  }
}

function checkBinary(binary) {
  const r = spawnSync(binary, ["--version"], { encoding: "utf-8", timeout: 5000 })
  if (r.error) {
    return {
      binary,
      ok: false,
      message: r.error.code === "ENOENT" ? "not installed" : r.error.message
    }
  }
  if (r.status !== 0) {
    return {
      binary,
      ok: false,
      message: (r.stderr || "").trim() || `exit ${r.status}`
    }
  }
  return {
    binary,
    ok: true,
    message: (r.stdout || "").trim() || "ok"
  }
}

function doctorPlugin(name) {
  const plugin = getPlugin(name)
  if (!plugin) {
    throw Object.assign(new Error(`Plugin '${name}' is not installed`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
      suggestions: ["Run: dcli plugins list"]
    })
  }

  const checks = []
  for (const check of (plugin.checks || [])) {
    if (check && check.type === "binary" && check.name) {
      const result = checkBinary(check.name)
      checks.push({ type: "binary", ...result })
    }
  }

  const adapterCounts = {}
  let unsafeCommands = 0
  for (const cmd of (plugin.commands || [])) {
    const adapter = cmd.adapter || "(missing)"
    adapterCounts[adapter] = (adapterCounts[adapter] || 0) + 1

    if (!SUPPORTED_ADAPTERS.includes(adapter)) {
      checks.push({
        type: "policy",
        ok: false,
        message: `Command '${commandKey(cmd)}' uses unknown adapter '${adapter}'`
      })
    }

    const cfg = cmd.adapterConfig || {}
    if (adapter === "shell") {
      if (cfg.unsafe !== true) {
        checks.push({
          type: "policy",
          ok: false,
          message: `Shell command '${commandKey(cmd)}' must set adapterConfig.unsafe=true`
        })
      } else {
        unsafeCommands += 1
      }
      if (cfg.non_interactive === false) {
        checks.push({
          type: "policy",
          ok: false,
          message: `Shell command '${commandKey(cmd)}' cannot disable non_interactive`
        })
      }
    }
  }

  return {
    plugin: name,
    ok: checks.every(c => c.ok),
    commands: (plugin.commands || []).length,
    adapter_counts: adapterCounts,
    unsafe_commands: unsafeCommands,
    checks,
    install_guidance: getPluginInstallGuidance(name)
  }
}

function doctorAllPlugins() {
  const reports = listInstalledPlugins().map(p => doctorPlugin(p.name))
  return {
    plugins: reports,
    ok: reports.every(r => r.ok),
    total_plugins: reports.length,
    failing_plugins: reports.filter(r => !r.ok).map(r => r.plugin)
  }
}

function installPlugin(ref, options = {}) {
  const onConflict = options.onConflict || "fail"
  if (!["fail", "skip", "replace"].includes(onConflict)) {
    throw Object.assign(new Error("Invalid --on-conflict. Use: fail, skip, replace"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  const loaded = loadPluginManifest(ref, options)
  const manifest = loaded.manifest
  const lock = readPluginsLock()
  const existing = lock.installed[manifest.name]
  const currentCommands = Array.isArray(options.currentCommands) ? options.currentCommands : []

  const existingByKey = {}
  for (const cmd of currentCommands) {
    existingByKey[commandKey(cmd)] = true
  }

  const ownerByKey = {}
  for (const [pluginName, plugin] of Object.entries(lock.installed)) {
    for (const cmd of (plugin.commands || [])) {
      ownerByKey[commandKey(cmd)] = pluginName
    }
  }

  const existingKeysForSamePlugin = new Set((existing && existing.commands ? existing.commands : []).map(commandKey))
  const conflicts = []
  const installedCommands = []

  for (const cmd of manifest.commands) {
    const key = commandKey(cmd)
    const owner = ownerByKey[key]
    if ((!existingByKey[key] && !owner) || existingKeysForSamePlugin.has(key)) {
      installedCommands.push(cmd)
      continue
    }

    if (onConflict === "skip") {
      conflicts.push({ key, owner, action: "skipped" })
      continue
    }

    if (onConflict === "replace") {
      if (owner) {
        lock.installed[owner].commands = (lock.installed[owner].commands || []).filter(c => commandKey(c) !== key)
        conflicts.push({ key, owner, action: "replaced" })
        installedCommands.push(cmd)
        continue
      }
      conflicts.push({ key, owner: "base", action: "blocked" })
      continue
    }

    conflicts.push({ key, owner, action: "blocked" })
  }

  if (onConflict === "fail" && conflicts.length > 0) {
    throw Object.assign(new Error(`Plugin install conflict for: ${conflicts.map(c => c.key).join(", ")}`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
      suggestions: [
        "Retry with --on-conflict skip",
        "Retry with --on-conflict replace"
      ]
    })
  }

  lock.installed[manifest.name] = {
    name: manifest.name,
    version: manifest.version || "0.0.0",
    description: manifest.description || "",
    source: manifest.source || ref,
    resolved_from: loaded.resolvedFrom,
    installed_at: new Date().toISOString(),
    commands: installedCommands,
    checks: manifest.checks || []
  }

  writePluginsLock(lock)
  return {
    plugin: manifest.name,
    version: manifest.version || "0.0.0",
    installed_commands: installedCommands.length,
    conflicts
  }
}

function removePlugin(name) {
  const lock = readPluginsLock()
  if (!lock.installed[name]) return false
  delete lock.installed[name]
  writePluginsLock(lock)
  return true
}

function getPlugin(name) {
  const lock = readPluginsLock()
  return lock.installed[name] || null
}

function getPluginInstallGuidance(name) {
  return PLUGIN_INSTALL_GUIDANCE[name] || null
}

module.exports = {
  installPlugin,
  removePlugin,
  getPlugin,
  listInstalledPlugins,
  getPluginInstallGuidance,
  doctorPlugin,
  doctorAllPlugins
}
