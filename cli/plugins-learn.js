const fs = require("fs")
const path = require("path")
const os = require("os")
const { spawnSync } = require("child_process")
const { getPlugin } = require("./plugins-manager")
const { getRegistryPlugin } = require("./plugins-registry")

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
  })
}

function notFound(message, suggestions = []) {
  return Object.assign(new Error(message), {
    code: 92,
    type: "resource_not_found",
    recoverable: false,
    suggestions,
  })
}

function integration(message, suggestions = []) {
  return Object.assign(new Error(message), {
    code: 105,
    type: "integration_error",
    recoverable: true,
    suggestions,
  })
}

function parseManifest(manifestPath) {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
  } catch (err) {
    throw invalid(`Invalid plugin manifest at ${manifestPath}: ${err.message}`)
  }
}

function resolveBundledManifestPath(pluginName) {
  return path.resolve(__dirname, "..", "plugins", pluginName, "plugin.json")
}

function readMetaFile(metaPath) {
  try {
    if (!fs.existsSync(metaPath)) return null
    const parsed = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

function resolveLearnMarkdown(manifest, manifestPath, meta = null) {
  const learn = manifest.learn

  if (!learn) {
    const metaPath = path.join(path.dirname(manifestPath), "meta.json")
    const metaData = meta || readMetaFile(metaPath)
    if (metaData && metaData.has_learn === true) {
      const defaultLearnFile = path.join(path.dirname(manifestPath), "skills", "quickstart", "SKILL.md")
      if (fs.existsSync(defaultLearnFile)) {
        return fs.readFileSync(defaultLearnFile, "utf-8")
      }
    }
    throw notFound(`Plugin '${manifest.name}' does not define learn content`, [
      "Use: supercli plugins show <name>",
      "Use: supercli plugins explore --name <name>",
    ])
  }

  if (typeof learn === "string") return learn

  if (!learn || typeof learn !== "object" || Array.isArray(learn)) {
    throw invalid("Invalid plugin learn definition: expected string or object")
  }

  if (learn.text && learn.file) {
    throw invalid("Invalid plugin learn definition: use either learn.text or learn.file")
  }

  if (typeof learn.text === "string") return learn.text

  if (typeof learn.file === "string") {
    const base = path.dirname(manifestPath)
    const filePath = path.resolve(base, learn.file)
    const normalizedBase = path.resolve(base) + path.sep
    if (!filePath.startsWith(normalizedBase)) {
      throw invalid(`Invalid learn.file path '${learn.file}'`)
    }
    if (!fs.existsSync(filePath)) {
      throw notFound(`Learn file not found: ${learn.file}`)
    }
    return fs.readFileSync(filePath, "utf-8")
  }

  throw invalid("Invalid plugin learn definition: expected learn.text or learn.file")
}

function loadManifestFromGit(repo, ref, manifestPath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "supercli-plugin-learn-"))
  try {
    const args = ["clone", "--depth", "1"]
    if (ref) args.push("--branch", String(ref), "--single-branch")
    args.push(repo, tmpDir)
    const clone = spawnSync("git", args, { encoding: "utf-8", timeout: 15000 })
    if (clone.error) {
      throw integration(`Failed to clone plugin repo '${repo}': ${clone.error.message}`, ["Check internet connectivity"])
    }
    if (clone.status !== 0) {
      throw integration(`Failed to clone plugin repo '${repo}': ${(clone.stderr || "").trim() || `exit ${clone.status}`}`)
    }

    const rel = manifestPath || "plugin.json"
    const full = path.resolve(tmpDir, rel)
    const normalized = path.resolve(tmpDir) + path.sep
    if (!full.startsWith(normalized)) {
      throw invalid(`Invalid manifest path '${rel}'`)
    }
    if (!fs.existsSync(full)) {
      throw notFound(`Plugin manifest not found in repo: ${rel}`)
    }
    return { manifest: parseManifest(full), manifestPath: full }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

function resolveManifestFromInstalled(installed) {
  const source = installed && installed.resolved_from
  if (!source || typeof source !== "object") return null

  if ((source.type === "path" || source.type === "registry") && source.manifest_path) {
    if (!fs.existsSync(source.manifest_path)) return null
    return {
      manifest: parseManifest(source.manifest_path),
      manifestPath: source.manifest_path,
      source: source.type,
    }
  }

  if (source.type === "git" && source.repo) {
    const loaded = loadManifestFromGit(source.repo, source.ref, source.manifest_path)
    return { ...loaded, source: "git" }
  }

  return null
}

function resolveManifestFromRegistry(name) {
  const entry = getRegistryPlugin(name)
  if (!entry) return null

  const source = entry.source || {}
  if ((source.type || "bundled") === "git") {
    const loaded = loadManifestFromGit(source.repo, source.ref, source.manifest_path)
    return { ...loaded, source: "registry-git" }
  }

  const manifestPath = source.manifest_path
    ? path.resolve(__dirname, "..", source.manifest_path)
    : resolveBundledManifestPath(name)
  if (!fs.existsSync(manifestPath)) {
    throw notFound(`Plugin manifest not found for '${name}'`)
  }
  return {
    manifest: parseManifest(manifestPath),
    manifestPath,
    source: "registry-bundled",
  }
}

function getPluginLearn(pluginName) {
  const installed = getPlugin(pluginName)
  const installedLoaded = installed ? resolveManifestFromInstalled(installed) : null
  const loaded = installedLoaded || resolveManifestFromRegistry(pluginName)

  if (!loaded) {
    throw notFound(`Plugin '${pluginName}' not found`, ["Run: supercli plugins explore"])
  }

  const metaPath = path.join(path.dirname(loaded.manifestPath), "meta.json")
  const meta = readMetaFile(metaPath)
  const markdown = resolveLearnMarkdown(loaded.manifest, loaded.manifestPath, meta)
  return {
    plugin: loaded.manifest.name || pluginName,
    installed: !!installed,
    source: loaded.source,
    learn_markdown: markdown,
  }
}

module.exports = {
  getPluginLearn,
  resolveLearnMarkdown,
}
