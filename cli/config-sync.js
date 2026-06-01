"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  listInstalledPlugins,
  readServerPluginsLock,
  writeServerPluginsLock,
  SUPERCLI_PLUGINS_DIR,
} = require("./plugins-store");
const {
  readCache,
  writeCache,
  emptyConfig,
  normalizeConfig,
  fetchRemoteConfig,
  getClientId,
} = require("./config-core");

function safePluginName(name) {
  return String(name || "").replace(/[^a-zA-Z0-9._-]/g, "-");
}

function safePluginVersion(version) {
  const value = String(version || "0.0.0").replace(/[^a-zA-Z0-9._-]/g, "-");
  return value || "0.0.0";
}

function resolveHooksPolicy(plugin, settings) {
  const pluginPolicy = String(plugin.hooks_policy || "inherit");
  if (pluginPolicy === "allow" || pluginPolicy === "deny") return pluginPolicy;
  return String(settings.default_hooks_policy || "deny");
}

function runServerPluginPostInstall(pluginDir, plugin, hookPolicy) {
  const manifest = plugin.manifest || {};
  if (!manifest.post_install || hookPolicy !== "allow") {
    return { policy: hookPolicy, executed: false, reason: hookPolicy !== "allow" ? "policy_denied" : "hook_missing" };
  }
  if (manifest.post_install.runtime && manifest.post_install.runtime !== "node") {
    return { policy: hookPolicy, executed: false, reason: "unsupported_runtime" };
  }
  const scriptRel = String(manifest.post_install.script || "");
  if (!scriptRel) return { policy: hookPolicy, executed: false, reason: "hook_missing" };
  const scriptPath = path.resolve(pluginDir, scriptRel);
  const normalizedBase = path.resolve(pluginDir) + path.sep;
  if (!scriptPath.startsWith(normalizedBase) || !fs.existsSync(scriptPath)) {
    return { policy: hookPolicy, executed: false, reason: "script_not_found" };
  }
  const timeoutMs = Number(manifest.post_install.timeout_ms);
  const resolvedTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.min(timeoutMs, 15000) : 15000;
  const result = spawnSync("node", [scriptPath], {
    encoding: "utf-8",
    timeout: resolvedTimeout,
    env: { ...process.env, SUPERCLI_PLUGIN_NAME: plugin.name, SUPERCLI_PLUGIN_DIR: pluginDir },
  });
  if (result.error) {
    return { policy: hookPolicy, executed: true, ok: false, error: result.error.message };
  }
  if (result.status !== 0) {
    return { policy: hookPolicy, executed: true, ok: false, error: (result.stderr || "").trim() || `exit ${result.status}` };
  }
  return { policy: hookPolicy, executed: true, ok: true };
}

function ensurePluginDir(rootDir, pluginName, pluginVersion) {
  const dir = path.join(rootDir, safePluginName(pluginName), safePluginVersion(pluginVersion));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function extractZipToDir(archivePath, targetDir) {
  const extract = spawnSync("unzip", ["-o", archivePath, "-d", targetDir], {
    encoding: "utf-8",
    timeout: 15000,
  });
  if (extract.error) {
    const msg = extract.error.code === "ENOENT" ? "'unzip' command is required for ZIP server plugins" : extract.error.message;
    throw Object.assign(new Error(msg), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: ["Install unzip and run: supercli sync"],
    });
  }
  if (extract.status !== 0) {
    throw Object.assign(new Error(`Failed to extract ZIP server plugin: ${(extract.stderr || "").trim() || `exit ${extract.status}`}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    });
  }
}

async function syncServerPlugins(server) {
  const lock = readServerPluginsLock();
  const installed = lock.installed || {};
  const r = await fetch(`${server}/api/plugins?format=json`);
  if (r.status === 404) {
    return { total: 0, enabled: 0, updated: [], unchanged: [], removed: [], shadowed_by_local: [], hook_results: [], skipped: true, reason: "server_plugins_endpoint_missing" };
  }
  if (!r.ok) throw new Error(`Failed to fetch server plugins: ${r.status} ${r.statusText}`);
  const payload = await r.json();
  const settings = payload.settings || { max_zip_mb: 10, default_hooks_policy: "deny" };
  const allPlugins = Array.isArray(payload.plugins) ? payload.plugins : [];
  const enabledPlugins = allPlugins.filter(p => p && p.enabled !== false);
  const pluginRoot = path.join(SUPERCLI_PLUGINS_DIR, "server");
  fs.mkdirSync(pluginRoot, { recursive: true });
  const localPlugins = listInstalledPlugins();
  const localNames = new Set(localPlugins.map(p => p.name));
  const nextInstalled = {};
  const diagnostics = { total: allPlugins.length, enabled: enabledPlugins.length, updated: [], unchanged: [], removed: [], shadowed_by_local: [], hook_results: [] };
  const expectedNames = new Set(enabledPlugins.map(p => p.name));
  for (const [name, oldPlugin] of Object.entries(installed)) {
    if (expectedNames.has(name)) continue;
    const oldPath = oldPlugin && oldPlugin.plugin_dir;
    if (oldPath && fs.existsSync(oldPath)) fs.rmSync(oldPath, { recursive: true, force: true });
    diagnostics.removed.push(name);
  }
  for (const plugin of enabledPlugins) {
    if (!plugin || !plugin.name) continue;
    if (localNames.has(plugin.name)) { diagnostics.shadowed_by_local.push(plugin.name); continue; }
    const previous = installed[plugin.name];
    const checksumUnchanged = previous && previous.checksum === plugin.checksum;
    if (checksumUnchanged) { nextInstalled[plugin.name] = previous; diagnostics.unchanged.push(plugin.name); continue; }
    const pluginDir = ensurePluginDir(pluginRoot, plugin.name, plugin.version);
    try {
      const manifest = plugin.manifest || null;
      if (!manifest || typeof manifest !== "object") {
        throw Object.assign(new Error(`Server plugin '${plugin.name}' is missing manifest`), {
          code: 105,
          type: "integration_error",
          recoverable: true,
        });
      }
      fs.writeFileSync(path.join(pluginDir, "plugin.json"), JSON.stringify(manifest, null, 2));
      if (plugin.source_type === "zip") {
        const zipRes = await fetch(`${server}/api/plugins/${encodeURIComponent(plugin.name)}/archive`);
        if (!zipRes.ok) {
          throw Object.assign(new Error(`Failed to download ZIP for server plugin '${plugin.name}'`), {
            code: 105,
            type: "integration_error",
            recoverable: true,
          });
        }
        const bytes = Buffer.from(await zipRes.arrayBuffer());
        const archivePath = path.join(pluginDir, "plugin.zip");
        fs.writeFileSync(archivePath, bytes);
        extractZipToDir(archivePath, pluginDir);
      }
    } catch (err) {
      try { fs.rmSync(pluginDir, { recursive: true, force: true }); } catch {}
      throw err;
    }
    const hookPolicy = resolveHooksPolicy(plugin, settings);
    const hookResult = runServerPluginPostInstall(pluginDir, { name: plugin.name, manifest }, hookPolicy);
    diagnostics.hook_results.push({ plugin: plugin.name, ...hookResult });
    nextInstalled[plugin.name] = {
      name: plugin.name,
      version: plugin.version,
      description: plugin.description || "",
      source: "server",
      source_type: plugin.source_type,
      checksum: plugin.checksum,
      has_learn: plugin.has_learn === true,
      tags: plugin.tags || [],
      hooks_policy: plugin.hooks_policy || "inherit",
      plugin_dir: pluginDir,
      installed_at: new Date().toISOString(),
      commands: Array.isArray(manifest.commands) ? manifest.commands.map(cmd => ({ ...cmd, plugin_name: plugin.name, plugin_dir: pluginDir })) : [],
    };
    diagnostics.updated.push(plugin.name);
  }
  writeServerPluginsLock({ version: 1, fetched_at: new Date().toISOString(), settings, installed: nextInstalled });
  return diagnostics;
}

async function syncClientPluginResources(server) {
  const { readPluginsLock } = require("./plugins-store");
  const lock = readPluginsLock();
  const installed = lock.installed || {};
  const clientId = getClientId();
  const pluginsWithResources = [];
  for (const [name, plugin] of Object.entries(installed)) {
    if (plugin.server_resources && (plugin.server_resources.mcp || plugin.server_resources.specs)) {
      pluginsWithResources.push({ name: name, server_resources: plugin.server_resources });
    }
  }
  if (pluginsWithResources.length === 0) return { synced: 0, errors: [] };
  try {
    const r = await fetch(`${server}/api/plugins/client-resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, plugins: pluginsWithResources }),
    });
    if (!r.ok) throw new Error(`Failed to sync plugin resources: ${r.status} ${r.statusText}`);
    const result = await r.json();
    return { synced: pluginsWithResources.length, result };
  } catch (err) {
    return { synced: 0, errors: [err.message] };
  }
}

async function syncCliAdapters(server) {
  const res = await fetch(`${server}/api/adapters`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed to fetch adapters: ${res.status}`);
  const data = await res.json();
  const adapters = data.adapters || [];
  const cliAdapters = adapters.filter(a => a.execution_context === "cli");
  const cliAdapterNames = new Set(cliAdapters.map(a => a.name));
  const adaptersDir = path.join(process.cwd(), ".supercli", "adapters");
  fs.mkdirSync(adaptersDir, { recursive: true });
  if (fs.existsSync(adaptersDir)) {
    const localFiles = fs.readdirSync(adaptersDir);
    for (const file of localFiles) {
      if (file.endsWith('.js')) {
        const adapterName = file.slice(0, -3);
        if (!cliAdapterNames.has(adapterName)) {
          fs.unlinkSync(path.join(adaptersDir, file));
        }
      }
    }
  }
  let synced = 0, failed = 0;
  for (const adapter of cliAdapters) {
    try {
      const sourceRes = await fetch(`${server}/api/adapters/${adapter.name}/source`, { headers: { Accept: "application/json" } });
      if (!sourceRes.ok) throw new Error(`Failed to fetch source for ${adapter.name}`);
      const sourceData = await sourceRes.json();
      const source = sourceData.source || "";
      const adapterPath = path.join(adaptersDir, `${adapter.name}.js`);
      const metadataHeader = `/**
 * @name ${adapter.name}
 * @description ${adapter.description || ""}
 * @context cli
 * @timeout ${adapter.timeout_ms || 30000}
 * @memory ${adapter.memory_limit_mb || 128}
 * @network ${adapter.allow_network || false}
 * @updated ${adapter.updated_at}
 */

`;
      fs.writeFileSync(adapterPath, metadataHeader + source, "utf-8");
      synced++;
    } catch (err) {
      console.error(`Failed to sync adapter ${adapter.name}:`, err.message);
      failed++;
    }
  }
  return { total: cliAdapters.length, synced, failed };
}

async function syncConfig(server) {
  const config = await fetchRemoteConfig(server);
  if (!Array.isArray(config.mcp_servers)) {
    try {
      const mcpRes = await fetch(`${server}/api/mcp?format=json`);
      config.mcp_servers = mcpRes.ok ? await mcpRes.json() : [];
    } catch { config.mcp_servers = []; }
  }
  if (!Array.isArray(config.specs)) {
    try {
      const specsRes = await fetch(`${server}/api/specs?format=json`);
      config.specs = specsRes.ok ? await specsRes.json() : [];
    } catch { config.specs = []; }
  }
  if (!Array.isArray(config.commands)) config.commands = [];
  let serverPlugins;
  try {
    serverPlugins = await syncServerPlugins(server);
  } catch (err) {
    serverPlugins = { total: 0, enabled: 0, updated: [], unchanged: [], removed: [], shadowed_by_local: [], hook_results: [], skipped: true, reason: err.message };
  }
  let clientResources = { synced: 0, errors: [] };
  try {
    clientResources = await syncClientPluginResources(server);
  } catch (err) {
    clientResources = { synced: 0, errors: [err.message] };
  }
  let cliAdapters = { total: 0, synced: 0, failed: 0 };
  try {
    cliAdapters = await syncCliAdapters(server);
  } catch (err) {
    cliAdapters = { total: 0, synced: 0, failed: 0, error: err.message };
  }
  const written = writeCache(normalizeConfig(config));
  return { ...written, server_plugins: serverPlugins, client_resources: clientResources, cli_adapters: cliAdapters };
}

module.exports = {
  safePluginName,
  safePluginVersion,
  resolveHooksPolicy,
  runServerPluginPostInstall,
  ensurePluginDir,
  extractZipToDir,
  syncServerPlugins,
  syncClientPluginResources,
  syncConfig,
  syncCliAdapters,
};
