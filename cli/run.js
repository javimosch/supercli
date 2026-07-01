"use strict";

/**
 * `sc run <plugin> <resource> <action> [args...]`
 *
 * One-shot: syncs plugin catalog → installs plugin (if not already) → executes command.
 * Designed for first-time / npx users — a single tweetable command.
 */

const { updatePlugins } = require("./plugins-update");
const { installPlugin, getPlugin } = require("./plugins-install");
const { loadConfig } = require("./config");
const { execute } = require("./executor");
const { makeOutput, makeOutputError, makeStreamEmitter } = require("./output");

async function handleRunCommand({ positional, flags, humanMode, output, outputError }) {
  const pluginName = positional[1];
  const resource = positional[2];
  const action = positional[3];

  if (!pluginName) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: "Usage: supercli run <plugin> <resource> <action> [--args]",
      suggestions: ["Example: supercli run claude-session-optimizer self auto"],
      recoverable: false,
    });
    return;
  }

  if (!resource || !action) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: `Usage: supercli run ${pluginName} <resource> <action> [--args]`,
      suggestions: [`Run: supercli plugins explore --name ${pluginName} --json`],
      recoverable: false,
    });
    return;
  }

  // ── Step 1: Sync plugin catalog from GitHub ──────────────────────────
  try {
    if (humanMode) process.stderr.write("Syncing plugin catalog...\n");
    const updateResult = await updatePlugins({ check: false });
    if (humanMode && updateResult.added + updateResult.changed > 0) {
      process.stderr.write(`  → ${updateResult.added} new, ${updateResult.changed} changed\n`);
    }
  } catch (err) {
    // Non-fatal: if update fails, try anyway with local catalog
    if (humanMode) process.stderr.write(`  ⚠ Catalog sync failed (${err.message}), continuing with local catalog\n`);
  }

  // ── Step 2: Install plugin if not already ─────────────────────────────
  const existing = getPlugin(pluginName);
  if (!existing) {
    try {
      if (humanMode) process.stderr.write(`Installing plugin: ${pluginName}...\n`);
      const config = await loadConfig();
      const result = installPlugin(pluginName, {
        onConflict: "replace",
        currentCommands: config.commands || [],
      });
      if (humanMode) process.stderr.write(`  → ${result.installed_commands} commands registered\n`);
    } catch (err) {
      outputError({
        code: 92,
        type: "resource_not_found",
        message: `Plugin '${pluginName}' not found after catalog sync.`,
        suggestions: [
          "Check the plugin name and try again",
          "Run: supercli plugins explore --json",
        ],
        recoverable: false,
      });
      return;
    }
  }

  // ── Step 3: Reload config and execute ────────────────────────────────
  const config = await loadConfig();
  const fullCommand = `${pluginName}.${resource}.${action}`;
  const cmd = config.commands.find(
    (c) => c.namespace === pluginName && c.resource === resource && c.action === action
  );

  if (!cmd) {
    outputError({
      code: 92,
      type: "resource_not_found",
      message: `Command '${fullCommand}' not found in plugin '${pluginName}'.`,
      suggestions: [
        `Run: supercli ${pluginName} --help`,
        `Run: supercli plugins explore --name ${pluginName} --json`,
      ],
      recoverable: false,
    });
    return;
  }

  // Build flags from remaining args (skip positional[0..3])
  const positionalArgs = positional.slice(4);
  const cmdFlags = { ...flags };
  if (cmd.adapterConfig && cmd.adapterConfig.passthrough === true) {
    // For passthrough commands, pass remaining args as __rawArgs
    cmdFlags.__rawArgs = positionalArgs;
  } else if (positionalArgs.length > 0) {
    // For normal commands, try to map positional args
    const positionalArgNames = Array.isArray(cmd.adapterConfig?.positionalArgs)
      ? cmd.adapterConfig.positionalArgs : [];
    let idx = 0;
    for (const name of positionalArgNames) {
      if (idx >= positionalArgs.length) break;
      if (cmdFlags[name] !== undefined) continue;
      cmdFlags[name] = positionalArgs[idx++];
    }
    const rest = positionalArgs.slice(idx);
    if (rest.length > 0) cmdFlags.__positionalArgs = rest;
  }

  const start = Date.now();
  try {
    const result = await execute(cmd, cmdFlags, {
      onStreamEvent: cmd.adapterConfig?.stream === "jsonl"
        ? makeStreamEmitter(`${pluginName}.run`, { humanMode, output }) : null,
    });

    const envelope = {
      version: "1.0",
      command: fullCommand,
      duration_ms: Date.now() - start,
      data: result,
    };

    if (humanMode && result && typeof result === "object" && result.passthrough === true) return;
    output(envelope);
  } catch (err) {
    outputError({
      code: err.code || 110,
      type: err.type || "internal_error",
      message: err.message || "Command execution failed",
      recoverable: err.recoverable !== false,
      suggestions: err.suggestions || [],
    });
  }
}

module.exports = { handleRunCommand };
