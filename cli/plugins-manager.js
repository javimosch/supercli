const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawnSync } = require("child_process")
const { SUPPORTED_ADAPTERS } = require("./adapter-schema")
const { getRegistryPlugin } = require("./plugins-registry")
const { getPluginInstallGuidance } = require("./plugin-install-guidance")
const {
  readPluginsLock,
  writePluginsLock,
  listInstalledPlugins
} = require("./plugins-store")

const BUNDLED_PLUGINS = {}

function validateNodeHook(hook, kind) {
  if (!hook) return null
  if (!hook.script || typeof hook.script !== "string") {
    throw Object.assign(new Error(`Invalid plugin manifest: ${kind}.script must be a string`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  const runtime = hook.runtime || "node"
  if (runtime !== "node") {
    throw Object.assign(new Error(`Invalid plugin manifest: ${kind}.runtime must be 'node'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  const timeoutMs = hook.timeout_ms === undefined ? 15000 : Number(hook.timeout_ms)
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 15000) {
    throw Object.assign(new Error(`Invalid plugin manifest: ${kind}.timeout_ms must be a positive number <= 15000`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  return {
    script: hook.script,
    runtime,
    timeout_ms: timeoutMs
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

function noCleanup() {
  return undefined
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
  const args = ["clone", "--depth", "1"]
  if (options.ref) args.push("--branch", String(options.ref), "--single-branch")
  args.push(repo, tmpDir)
  const clone = spawnSync("git", args, { encoding: "utf-8", timeout: 15000 })

  if (clone.error) {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    const suggestion = clone.error.code === "ENOENT" ? ["Install git and retry"] : []
    throw Object.assign(new Error(`Failed to clone plugin repo '${repo}': ${clone.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: suggestion
    })
  }
  if (clone.status !== 0) {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    throw Object.assign(new Error(`Failed to clone plugin repo '${repo}': ${(clone.stderr || "").trim() || `exit ${clone.status}`}`), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }

  const manifestPath = resolveRepoManifestPath(tmpDir, options.manifestPath)
  if (!fs.existsSync(manifestPath)) {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    throw Object.assign(new Error(`Plugin manifest not found in repo: ${options.manifestPath || "plugin.json"}`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false
    })
  }

  return {
    manifest: parseManifestFile(manifestPath),
    manifestPath,
    resolvedFrom: {
      type: "git",
      repo,
      ref: options.ref || null,
      manifest_path: options.manifestPath || "plugin.json"
    },
    cleanup: () => fs.rmSync(tmpDir, { recursive: true, force: true })
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
      repo: source.repo,
      ref: source.ref,
      manifestPath: source.manifest_path
    }
  }

  const manifestPath = source.manifest_path || `plugins/${entry.name}/plugin.json`
  return {
    type: "path",
    manifestPath: path.resolve(__dirname, "..", manifestPath)
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
      manifestPath: directManifestPath,
      resolvedFrom: {
        type: "path",
        manifest_path: directManifestPath
      },
      cleanup: noCleanup
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
    manifestPath: registrySource.manifestPath,
    resolvedFrom: {
      type: "registry",
      name: ref,
      manifest_path: registrySource.manifestPath
    },
    cleanup: noCleanup
  }
}

function parsePostInstallResult(stdout) {
  const text = (stdout || "").trim()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

function resolveHookScriptPath(manifestDir, script, kind) {
  const scriptPath = path.resolve(manifestDir, script)
  const normalizedBase = path.resolve(manifestDir) + path.sep
  if (!scriptPath.startsWith(normalizedBase)) {
    throw Object.assign(new Error(`Invalid ${kind} script path '${script}'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }
  if (!fs.existsSync(scriptPath)) {
    throw Object.assign(new Error(`${kind} script not found: ${script}`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false
    })
  }
  return scriptPath
}

function runNodeHook(pluginName, kind, hook, scriptPath, env = {}) {
  const result = spawnSync("node", [scriptPath], {
    encoding: "utf-8",
    timeout: hook.timeout_ms,
    env: {
      ...process.env,
      ...env,
      SUPERCLI_PLUGIN_NAME: pluginName,
      SUPERCLI_PLUGIN_DIR: path.dirname(scriptPath)
    }
  })

  if (result.error) {
    throw Object.assign(new Error(`${kind} hook failed for '${pluginName}': ${result.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }
  if (result.status !== 0) {
    throw Object.assign(new Error(`${kind} hook failed for '${pluginName}': ${(result.stderr || "").trim() || `exit ${result.status}`}`), {
      code: 105,
      type: "integration_error",
      recoverable: true
    })
  }

  return parsePostInstallResult(result.stdout)
}

function runPostInstall(manifest, manifestPath) {
  const hook = validateNodeHook(manifest.post_install, "post_install")
  if (!hook) return null
  const manifestDir = path.dirname(manifestPath)
  const scriptPath = resolveHookScriptPath(manifestDir, hook.script, "post-install")
  return runNodeHook(manifest.name, "Post-install", hook, scriptPath)
}

function serializeHook(manifestPath, hook, kind) {
  const validHook = validateNodeHook(hook, kind)
  if (!validHook) return null
  const manifestDir = path.dirname(manifestPath)
  const scriptPath = resolveHookScriptPath(manifestDir, validHook.script, kind.replace(/_/g, "-"))
  return {
    runtime: validHook.runtime,
    timeout_ms: validHook.timeout_ms,
    script_path: scriptPath,
    script_name: path.basename(scriptPath),
    script_source: fs.readFileSync(scriptPath, "utf-8")
  }
}

function runStoredHook(pluginName, kind, storedHook) {
  if (!storedHook) return null
  const runtime = storedHook.runtime || "node"
  if (runtime !== "node") {
    throw Object.assign(new Error(`Unsupported stored ${kind} runtime '${runtime}' for '${pluginName}'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  if (storedHook.script_path && fs.existsSync(storedHook.script_path)) {
    return runNodeHook(pluginName, `Post-${kind}`, {
      runtime,
      timeout_ms: Number(storedHook.timeout_ms) || 15000
    }, storedHook.script_path)
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-plugin-hook-"))
  try {
    const scriptName = storedHook.script_name || `${kind}.js`
    const scriptPath = path.join(tmpDir, scriptName)
    fs.writeFileSync(scriptPath, storedHook.script_source || "")
    return runNodeHook(pluginName, `Post-${kind}`, {
      runtime,
      timeout_ms: Number(storedHook.timeout_ms) || 15000
    }, scriptPath)
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

function checkBinary(binary, args) {
  const r = spawnSync(binary, args || ["--version"], { encoding: "utf-8", timeout: 5000 })
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
      checks.push({ type: "binary", ...checkBinary(check.name, check.args) })
    }
  }

  const adapterCounts = {}
  let unsafeCommands = 0
  for (const cmd of (plugin.commands || [])) {
    const adapter = cmd.adapter || "(missing)"
    adapterCounts[adapter] = (adapterCounts[adapter] || 0) + 1
    if (!SUPPORTED_ADAPTERS.includes(adapter)) {
      checks.push({ type: "policy", ok: false, message: `Command '${commandKey(cmd)}' uses unknown adapter '${adapter}'` })
    }
    const cfg = cmd.adapterConfig || {}
    if (adapter === "shell") {
      if (cfg.unsafe !== true) checks.push({ type: "policy", ok: false, message: `Shell command '${commandKey(cmd)}' must set adapterConfig.unsafe=true` })
      else unsafeCommands += 1
      if (cfg.non_interactive === false) {
        checks.push({ type: "policy", ok: false, message: `Shell command '${commandKey(cmd)}' cannot disable non_interactive` })
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
  try {
    const manifest = loaded.manifest
    const lock = readPluginsLock()
    const existing = lock.installed[manifest.name]
    const currentCommands = Array.isArray(options.currentCommands) ? options.currentCommands : []

    const existingByKey = {}
    for (const cmd of currentCommands) existingByKey[commandKey(cmd)] = true

    const ownerByKey = {}
    for (const [pluginName, plugin] of Object.entries(lock.installed)) {
      for (const cmd of (plugin.commands || [])) ownerByKey[commandKey(cmd)] = pluginName
    }

    const existingKeysForSamePlugin = new Set((existing && existing.commands ? existing.commands : []).map(commandKey))
    const conflicts = []
    const installedCommands = []
    const pluginDir = path.dirname(loaded.manifestPath)

    for (const cmd of manifest.commands) {
      const key = commandKey(cmd)
      const owner = ownerByKey[key]
      if ((!existingByKey[key] && !owner) || existingKeysForSamePlugin.has(key)) {
        cmd.plugin_name = manifest.name
        cmd.plugin_dir = pluginDir
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
        suggestions: ["Retry with --on-conflict skip", "Retry with --on-conflict replace"]
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
      checks: manifest.checks || [],
      lifecycle_hooks: {
        post_uninstall: serializeHook(loaded.manifestPath, manifest.post_uninstall, "post_uninstall")
      }
    }

    const postInstall = runPostInstall(manifest, loaded.manifestPath)
    writePluginsLock(lock)
    return {
      plugin: manifest.name,
      version: manifest.version || "0.0.0",
      installed_commands: installedCommands.length,
      conflicts,
      post_install: postInstall
    }
  } finally {
    if (typeof loaded.cleanup === "function") loaded.cleanup()
  }
}

function removePlugin(name) {
  const lock = readPluginsLock()
  const plugin = lock.installed[name]
  if (!plugin) return false
  runStoredHook(name, "uninstall", plugin.lifecycle_hooks && plugin.lifecycle_hooks.post_uninstall)
  delete lock.installed[name]
  writePluginsLock(lock)
  return true
}

function getPlugin(name) {
  const lock = readPluginsLock()
  return lock.installed[name] || null
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
