"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { loadConfig } = require("./config-core");

function validateHooks(manifest) {
  const errors = [];
  if (manifest.hooks) {
    const validKinds = ["on_command", "on_output", "on_before", "on_after", "on_error", "on_config_change"];
    for (const key of Object.keys(manifest.hooks)) {
      if (!validKinds.includes(key)) {
        errors.push(`Invalid hook kind '${key}'. Supported: ${validKinds.join(", ")}`);
      }
    }
  }
  for (const cmd of manifest.commands) {
    if (cmd.hooks) {
      const validKinds = ["on_before", "on_after", "on_error", "on_output"];
      for (const key of Object.keys(cmd.hooks)) {
        if (!validKinds.includes(key)) {
          const keyStr = `${cmd.namespace}.${cmd.resource}.${cmd.action}`;
          errors.push(`Invalid command hook '${key}' for ${keyStr}. Supported: ${validKinds.join(", ")}`);
        }
      }
    }
  }
  return errors;
}

function executeNodeHook(hook, context) {
  const hookScript = path.resolve(path.dirname(context.pluginManifestPath), hook.script);
  if (!fs.existsSync(hookScript)) {
    throw Object.assign(new Error(`Hook script not found: ${hookScript}`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    });
  }
  const result = spawnSync(process.execPath, [hookScript, JSON.stringify(context)], {
    encoding: "utf-8",
    timeout: hook.timeout_ms || 15000,
  });
  if (result.error) {
    throw Object.assign(new Error(`Failed to execute hook: ${result.error.message}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    });
  }
  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    const msg = stderr || `Hook failed with exit code ${result.status}`;
    throw Object.assign(new Error(msg), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    });
  }
  try {
    return JSON.parse(result.stdout || "{}");
  } catch {
    return null;
  }
}

function runHook(kind, context, pluginManifest, commandManifest) {
  if (!pluginManifest.hooks && !commandManifest?.hooks) return null;
  const hookDef = commandManifest?.hooks?.[kind] || pluginManifest.hooks?.[kind];
  if (!hookDef) return null;
  context.kind = kind;
  context.pluginManifestPath = context.pluginManifestPath;
  context.pluginManifest = pluginManifest;
  if (commandManifest) context.commandManifest = commandManifest;
  if (hookDef.script) {
    return executeNodeHook(hookDef, context);
  }
  return null;
}

function executeCommandHooks(context, commandManifest) {
  const results = [];
  const pluginManifest = context.pluginManifest;
  const before = runHook("on_before", context, pluginManifest, commandManifest);
  if (before) results.push({ hook: "on_before", result: before });
  return results;
}

function executeAfterHooks(context, commandManifest, exitCode) {
  const results = [];
  const pluginManifest = context.pluginManifest;
  context.exitCode = exitCode;
  if (exitCode === 0) {
    const after = runHook("on_after", context, pluginManifest, commandManifest);
    if (after) results.push({ hook: "on_after", result: after });
  } else {
    const errorHook = runHook("on_error", context, pluginManifest, commandManifest);
    if (errorHook) results.push({ hook: "on_error", result: errorHook });
  }
  return results;
}

function executeOutputHooks(context, output) {
  const results = [];
  const pluginManifest = context.pluginManifest;
  context.output = output;
  const outputHook = runHook("on_output", context, pluginManifest, context.commandManifest);
  if (outputHook) results.push({ hook: "on_output", result: outputHook });
  return results;
}

function executeConfigChangeHooks() {
  const config = loadConfig();
  const results = [];
  if (!config.plugins || !Array.isArray(config.plugins)) return results;
  for (const plugin of config.plugins) {
    const pluginDir = path.resolve(process.cwd(), plugin.path);
    const manifestPath = path.join(pluginDir, "plugin.json");
    if (!fs.existsSync(manifestPath)) continue;
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {
      continue;
    }
    if (manifest.hooks?.on_config_change) {
      const hookDef = manifest.hooks.on_config_change;
      if (hookDef.script) {
        const hookScript = path.join(pluginDir, hookDef.script);
        if (fs.existsSync(hookScript)) {
          try {
            const result = spawnSync(process.execPath, [hookScript, JSON.stringify({ kind: "on_config_change" })], {
              encoding: "utf-8",
              timeout: hookDef.timeout_ms || 15000,
            });
            if (result.status === 0) {
              results.push({ plugin: manifest.name, result });
            }
          } catch {
            // Silently ignore hook errors during config change
          }
        }
      }
    }
  }
  return results;
}

function validateNodeHook(hook, kind) {
  if (!hook) return null;
  if (!hook.script || typeof hook.script !== "string") {
    throw Object.assign(new Error(`Invalid plugin manifest: ${kind}.script must be a string`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  const runtime = hook.runtime || "node";
  if (runtime !== "node") {
    throw Object.assign(new Error(`Invalid plugin manifest: ${kind}.runtime must be 'node'`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  const timeoutMs = hook.timeout_ms === undefined ? 15000 : Number(hook.timeout_ms);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 15000) {
    throw Object.assign(new Error(`Invalid plugin manifest: ${kind}.timeout_ms must be a positive number <= 15000`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  return {
    script: hook.script,
    runtime,
    timeout_ms: timeoutMs,
  };
}

module.exports = {
  validateHooks,
  validateNodeHook,
  executeNodeHook,
  runHook,
  executeCommandHooks,
  executeAfterHooks,
  executeOutputHooks,
  executeConfigChangeHooks,
};
