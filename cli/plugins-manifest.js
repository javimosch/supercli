"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const { getRegistryPlugin } = require("./plugins-registry");
const { validateNodeHook } = require("./plugins-hooks");

const BUNDLED_PLUGINS = {};

function commandKey(cmd) {
  return `${cmd.namespace}.${cmd.resource}.${cmd.action}`;
}

function resolveManifestPath(ref) {
  const base = BUNDLED_PLUGINS[ref] || path.resolve(ref);
  if (!fs.existsSync(base)) return null;
  const st = fs.statSync(base);
  if (st.isDirectory()) return path.join(base, "plugin.json");
  return base;
}

function parseManifestFile(manifestPath) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch (err) {
    throw Object.assign(new Error(`Invalid plugin manifest at ${manifestPath}: ${err.message}`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  if (!raw.name || !Array.isArray(raw.commands)) {
    throw Object.assign(new Error("Invalid plugin manifest: missing name or commands"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  if (raw.server_resources) {
    if (typeof raw.server_resources !== "object" || Array.isArray(raw.server_resources)) {
      throw Object.assign(new Error("Invalid plugin manifest: server_resources must be an object"), {
        code: 85,
        type: "invalid_argument",
        recoverable: false,
      });
    }
    if (raw.server_resources.mcp && !Array.isArray(raw.server_resources.mcp)) {
      throw Object.assign(new Error("Invalid plugin manifest: server_resources.mcp must be an array"), {
        code: 85,
        type: "invalid_argument",
        recoverable: false,
      });
    }
    if (raw.server_resources.specs && !Array.isArray(raw.server_resources.specs)) {
      throw Object.assign(new Error("Invalid plugin manifest: server_resources.specs must be an array"), {
        code: 85,
        type: "invalid_argument",
        recoverable: false,
      });
    }
  }
  return raw;
}

function resolveRepoManifestPath(baseDir, manifestPath) {
  const relative = manifestPath || "plugin.json";
  const candidate = path.resolve(baseDir, relative);
  const normalizedBase = path.resolve(baseDir) + path.sep;
  if (!candidate.startsWith(normalizedBase)) {
    throw Object.assign(new Error(`Invalid manifest path '${relative}'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  return candidate;
}

function noCleanup() {
  return undefined;
}

function loadManifestFromGit(repo, options = {}) {
  if (!repo || typeof repo !== "string") {
    throw Object.assign(new Error("Missing git repo URL/path for plugin install"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-plugin-"));
  const args = ["clone", "--depth", "1"];
  if (options.ref) args.push("--branch", String(options.ref), "--single-branch");
  args.push(repo, tmpDir);
  const clone = spawnSync("git", args, { encoding: "utf-8", timeout: 15000 });
  if (clone.error) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    const suggestion = clone.error.code === "ENOENT" ? ["Install git and retry"] : [];
    throw Object.assign(new Error(`Failed to clone plugin repo '${repo}': ${clone.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: suggestion,
    });
  }
  if (clone.status !== 0) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw Object.assign(new Error(`Failed to clone plugin repo '${repo}': ${(clone.stderr || "").trim() || `exit ${clone.status}`}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    });
  }
  const manifestPath = resolveRepoManifestPath(tmpDir, options.manifestPath);
  if (!fs.existsSync(manifestPath)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw Object.assign(new Error(`Plugin manifest not found in repo: ${options.manifestPath || "plugin.json"}`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    });
  }
  return {
    manifest: parseManifestFile(manifestPath),
    manifestPath,
    resolvedFrom: { type: "git", repo, ref: options.ref || null, manifest_path: options.manifestPath || "plugin.json" },
    cleanup: () => fs.rmSync(tmpDir, { recursive: true, force: true }),
  };
}

function resolveRegistrySource(name) {
  const entry = getRegistryPlugin(name);
  if (!entry) return null;
  const source = entry.source || {};
  const sourceType = source.type || "bundled";
  if (sourceType === "git") {
    return { type: "git", repo: source.repo, ref: source.ref, manifestPath: source.manifest_path };
  }
  const manifestPath = source.manifest_path || `plugins/${entry.name}/plugin.json`;
  return {
    type: "path",
    manifestPath: path.resolve(__dirname, "..", manifestPath),
  };
}

function loadPluginManifest(ref, options = {}) {
  if (options.git) {
    return loadManifestFromGit(options.git, { ref: options.ref, manifestPath: options.manifestPath });
  }
  const directManifestPath = resolveManifestPath(ref);
  if (directManifestPath && fs.existsSync(directManifestPath)) {
    return {
      manifest: parseManifestFile(directManifestPath),
      manifestPath: directManifestPath,
      resolvedFrom: { type: "path", manifest_path: directManifestPath },
      cleanup: noCleanup,
    };
  }
  const registrySource = resolveRegistrySource(ref);
  if (!registrySource) {
    throw Object.assign(new Error(`Plugin '${ref}' not found`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
      suggestions: ["Run: dcli plugins explore"],
    });
  }
  if (registrySource.type === "git") {
    return loadManifestFromGit(registrySource.repo, { ref: registrySource.ref, manifestPath: registrySource.manifestPath });
  }
  if (!registrySource.manifestPath || !fs.existsSync(registrySource.manifestPath)) {
    throw Object.assign(new Error(`Plugin manifest not found for '${ref}'`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    });
  }
  return {
    manifest: parseManifestFile(registrySource.manifestPath),
    manifestPath: registrySource.manifestPath,
    resolvedFrom: { type: "registry", name: ref, manifest_path: registrySource.manifestPath },
    cleanup: noCleanup,
  };
}

module.exports = {
  validateNodeHook,
  commandKey,
  resolveManifestPath,
  parseManifestFile,
  resolveRepoManifestPath,
  loadManifestFromGit,
  resolveRegistrySource,
  loadPluginManifest,
  noCleanup,
};