#!/usr/bin/env bun
/**
 * Dump all supercli plugin metadata to a JSON file for the marketing scheduler.
 * Reads plugin.json from each plugin directory and outputs plugins-dump.json.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const PLUGINS_DIR = join(import.meta.dir, "..", "plugins");
const OUTPUT_PATH = join(import.meta.dir, "plugins-dump.json");

interface PluginEntry {
  name: string;
  description: string;
  tags: string[];
  source: string;
  installSteps: string[];
}

function loadPluginJson(dir: string): Record<string, unknown> | null {
  const path = join(PLUGINS_DIR, dir, "plugin.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function loadMetaJson(dir: string): Record<string, unknown> | null {
  const path = join(PLUGINS_DIR, dir, "meta.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function loadInstallGuidance(dir: string): Record<string, unknown> | null {
  const path = join(PLUGINS_DIR, dir, "install-guidance.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function main() {
  const entries = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const plugins: PluginEntry[] = [];

  let missingPluginJson = 0;
  let missingMetaJson = 0;

  for (const dir of entries) {
    const pluginJson = loadPluginJson(dir);
    const metaJson = loadMetaJson(dir);
    const installGuidance = loadInstallGuidance(dir);

    if (!pluginJson) {
      missingPluginJson++;
      continue;
    }

    const rawName = pluginJson.name as string;
    // Skip generic template names, use directory name instead
    const name = (rawName && rawName !== "TOOL" && rawName !== "PLUGIN_NAME" ? rawName : dir) as string;
    const description = metaJson?.description as string || pluginJson.description as string || "";
    const tags = (metaJson?.tags as string[]) || [];
    // Fix incomplete source URLs (e.g., just "https")
    let source = (pluginJson.source as string) || "";
    if (source === "https" || source === "http" || source === "https://") {
      source = "";
    }

    // Extract install steps from plugin.json's install_guidance or install-guidance.json
    let installSteps: string[] = [];
    const igFromPlugin = pluginJson.install_guidance as Record<string, unknown> | undefined;
    if (igFromPlugin?.install_steps && Array.isArray(igFromPlugin.install_steps)) {
      installSteps = igFromPlugin.install_steps as string[];
    } else if (installGuidance?.install_steps && Array.isArray(installGuidance.install_steps)) {
      installSteps = installGuidance.install_steps as string[];
    }

    plugins.push({ name, description, tags, source, installSteps });
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(plugins, null, 2));

  console.log(`Dumped ${plugins.length} plugins to ${OUTPUT_PATH}`);
  console.log(`Missing plugin.json: ${missingPluginJson}`);
  console.log(`Directories scanned: ${entries.length}`);
}

main();
