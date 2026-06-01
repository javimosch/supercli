"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { getRegistryPlugin } = require("./plugins-registry");
const { getPluginInstallGuidance } = require("./plugin-install-guidance");
const { SUPPORTED_ADAPTERS } = require("./adapter-schema");
const { getPlugin, listInstalledPlugins } = require("./plugins-store");
const { commandKey } = require("./plugins-manifest");

function checkBinary(binary, args) {
  const r = spawnSync(binary, args || ["--version"], { encoding: "utf-8", timeout: 5000 });
  if (r.error) {
    return {
      binary,
      ok: false,
      message: r.error.code === "ENOENT" ? "not installed" : r.error.message,
    };
  }
  if (r.status !== 0) {
    return {
      binary,
      ok: false,
      message: (r.stderr || "").trim() || `exit ${r.status}`,
    };
  }
  return {
    binary,
    ok: true,
    message: (r.stdout || "").trim() || "ok",
  };
}

function doctorPlugin(name) {
  const plugin = getPlugin(name);
  if (!plugin) {
    throw Object.assign(new Error(`Plugin '${name}' is not installed`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
      suggestions: ["Run: dcli plugins list"],
    });
  }

  const checks = [];
  for (const check of plugin.checks || []) {
    if (check && check.type === "binary" && check.name) {
      checks.push({ type: "binary", ...checkBinary(check.name, check.args) });
    }
  }

  const adapterCounts = {};
  let unsafeCommands = 0;
  for (const cmd of plugin.commands || []) {
    const adapter = cmd.adapter || "(missing)";
    adapterCounts[adapter] = (adapterCounts[adapter] || 0) + 1;
    if (!SUPPORTED_ADAPTERS.includes(adapter)) {
      checks.push({
        type: "policy",
        ok: false,
        message: `Command '${commandKey(cmd)}' uses unknown adapter '${adapter}'`,
      });
    }
    const cfg = cmd.adapterConfig || {};
    if (adapter === "shell") {
      if (cfg.unsafe !== true)
        checks.push({
          type: "policy",
          ok: false,
          message: `Shell command '${commandKey(cmd)}' must set adapterConfig.unsafe=true`,
        });
      else unsafeCommands += 1;
      if (cfg.non_interactive === false) {
        checks.push({
          type: "policy",
          ok: false,
          message: `Shell command '${commandKey(cmd)}' cannot disable non_interactive`,
        });
      }
    }
  }

  return {
    plugin: name,
    ok: checks.every((c) => c.ok),
    commands: (plugin.commands || []).length,
    adapter_counts: adapterCounts,
    unsafe_commands: unsafeCommands,
    checks,
    install_guidance: getPluginInstallGuidance(name),
  };
}

function doctorAllPlugins() {
  const reports = listInstalledPlugins().map((p) => doctorPlugin(p.name));
  return {
    plugins: reports,
    ok: reports.every((r) => r.ok),
    total_plugins: reports.length,
    failing_plugins: reports.filter((r) => !r.ok).map((r) => r.plugin),
  };
}

module.exports = {
  checkBinary,
  doctorPlugin,
  doctorAllPlugins,
};
