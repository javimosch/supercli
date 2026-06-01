"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const { readPluginsLock, writePluginsLock, listInstalledPlugins, getPlugin } = require("./plugins-store");
const { loadPluginManifest, commandKey } = require("./plugins-manifest");
const { validateNodeHook } = require("./plugins-hooks");
const { syncClientPluginResources } = require("./config");

function parsePostInstallResult(stdout) {
  const text = (stdout || "").trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function resolveHookScriptPath(manifestDir, script, kind) {
  const scriptPath = path.resolve(manifestDir, script);
  const normalizedBase = path.resolve(manifestDir) + path.sep;
  if (!scriptPath.startsWith(normalizedBase)) {
    throw Object.assign(new Error(`Invalid ${kind} script path '${script}'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  if (!fs.existsSync(scriptPath)) {
    throw Object.assign(new Error(`${kind} script not found: ${script}`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    });
  }
  return scriptPath;
}

function runNodeHook(pluginName, kind, hook, scriptPath, env = {}) {
  const result = spawnSync("node", [scriptPath], {
    encoding: "utf-8",
    timeout: hook.timeout_ms,
    env: {
      ...process.env,
      ...env,
      SUPERCLI_PLUGIN_NAME: pluginName,
      SUPERCLI_PLUGIN_DIR: path.dirname(scriptPath),
    },
  });

  if (result.error) {
    throw Object.assign(new Error(`${kind} hook failed for '${pluginName}': ${result.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    });
  }
  if (result.status !== 0) {
    throw Object.assign(new Error(`${kind} hook failed for '${pluginName}': ${(result.stderr || "").trim() || `exit ${result.status}`}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    });
  }

  return parsePostInstallResult(result.stdout);
}

function runPostInstall(manifest, manifestPath) {
  const hook = validateNodeHook(manifest.post_install, "post_install");
  if (!hook) return null;
  const manifestDir = path.dirname(manifestPath);
  const scriptPath = resolveHookScriptPath(manifestDir, hook.script, "post-install");
  return runNodeHook(manifest.name, "Post-install", hook, scriptPath);
}

function serializeHook(manifestPath, hook, kind) {
  const validHook = validateNodeHook(hook, kind);
  if (!validHook) return null;
  const manifestDir = path.dirname(manifestPath);
  const scriptPath = resolveHookScriptPath(manifestDir, validHook.script, kind.replace(/_/g, "-"));
  return {
    runtime: validHook.runtime,
    timeout_ms: validHook.timeout_ms,
    script_path: scriptPath,
    script_name: path.basename(scriptPath),
    script_source: fs.readFileSync(scriptPath, "utf-8"),
  };
}

function runStoredHook(pluginName, kind, storedHook) {
  if (!storedHook) return null;
  const runtime = storedHook.runtime || "node";
  if (runtime !== "node") {
    throw Object.assign(new Error(`Unsupported stored ${kind} runtime '${runtime}' for '${pluginName}'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }

  if (storedHook.script_path && fs.existsSync(storedHook.script_path)) {
    return runNodeHook(pluginName, `Post-${kind}`, {
      runtime,
      timeout_ms: Number(storedHook.timeout_ms) || 15000,
    }, storedHook.script_path);
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dcli-plugin-hook-"));
  try {
    const scriptName = storedHook.script_name || `${kind}.js`;
    const scriptPath = path.join(tmpDir, scriptName);
    fs.writeFileSync(scriptPath, storedHook.script_source || "");
    return runNodeHook(pluginName, `Post-${kind}`, {
      runtime,
      timeout_ms: Number(storedHook.timeout_ms) || 15000,
    }, scriptPath);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function installPlugin(ref, options = {}) {
  const onConflict = options.onConflict || "fail";
  if (!["fail", "skip", "replace"].includes(onConflict)) {
    throw Object.assign(new Error("Invalid --on-conflict. Use: fail, skip, replace"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }

  const loaded = loadPluginManifest(ref, options);
  try {
    const manifest = loaded.manifest;
    const lock = readPluginsLock();
    const existing = lock.installed[manifest.name];
    const currentCommands = Array.isArray(options.currentCommands) ? options.currentCommands : [];

    const existingByKey = {};
    for (const cmd of currentCommands) existingByKey[commandKey(cmd)] = true;

    const ownerByKey = {};
    for (const [pluginName, plugin] of Object.entries(lock.installed)) {
      for (const cmd of plugin.commands || []) ownerByKey[commandKey(cmd)] = pluginName;
    }

    const existingKeysForSamePlugin = new Set((existing && existing.commands ? existing.commands : []).map(commandKey));
    const conflicts = [];
    const installedCommands = [];
    const pluginDir = path.dirname(loaded.manifestPath);

    for (const cmd of manifest.commands) {
      const key = commandKey(cmd);
      const owner = ownerByKey[key];
      if ((!existingByKey[key] && !owner) || existingKeysForSamePlugin.has(key)) {
        cmd.plugin_name = manifest.name;
        cmd.plugin_dir = pluginDir;
        installedCommands.push(cmd);
        continue;
      }
      if (onConflict === "skip") {
        conflicts.push({ key, owner, action: "skipped" });
        continue;
      }
      if (onConflict === "replace") {
        if (owner) {
          lock.installed[owner].commands = (lock.installed[owner].commands || []).filter((c) => commandKey(c) !== key);
          conflicts.push({ key, owner, action: "replaced" });
          installedCommands.push(cmd);
          continue;
        }
        conflicts.push({ key, owner: "base", action: "blocked" });
        continue;
      }
      conflicts.push({ key, owner, action: "blocked" });
    }

    if (onConflict === "fail" && conflicts.length > 0) {
      throw Object.assign(new Error(`Plugin install conflict for: ${conflicts.map((c) => c.key).join(", ")}`), {
        code: 85,
        type: "invalid_argument",
        recoverable: false,
        suggestions: ["Retry with --on-conflict skip", "Retry with --on-conflict replace"],
      });
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
      server_resources: manifest.server_resources || {},
      lifecycle_hooks: {
        post_uninstall: serializeHook(loaded.manifestPath, manifest.post_uninstall, "post_uninstall"),
      },
    };

    const postInstall = runPostInstall(manifest, loaded.manifestPath);
    writePluginsLock(lock);

    const server = process.env.SUPERCLI_SERVER;
    if (server && manifest.server_resources) {
      syncClientPluginResources(server).catch((err) => {
        console.warn(`[Plugin ${manifest.name}] Failed to sync resources to server:`, err.message);
      });
    }

    return {
      plugin: manifest.name,
      version: manifest.version || "0.0.0",
      installed_commands: installedCommands.length,
      conflicts,
      post_install: postInstall,
    };
  } finally {
    if (typeof loaded.cleanup === "function") loaded.cleanup();
  }
}

function removePlugin(name, force = false) {
  const lock = readPluginsLock();
  const plugin = lock.installed[name];
  if (!plugin) return false;
  try {
    runStoredHook(name, "uninstall", plugin.lifecycle_hooks && plugin.lifecycle_hooks.post_uninstall);
  } catch (err) {
    if (!force) throw err;
    console.warn(`[Uninstall Warning] Post-uninstall hook failed for '${name}':`, err.message);
  }
  delete lock.installed[name];
  writePluginsLock(lock);
  return true;
}

module.exports = {
  installPlugin,
  removePlugin,
  getPlugin,
  listInstalledPlugins,
};
