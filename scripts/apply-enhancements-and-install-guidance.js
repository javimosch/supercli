#!/usr/bin/env node
/**
 * Apply description enhancements to actual plugin files and create
 * install-guidance.json for plugins that lack it.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";

const PLUGINS_DIR = join(import.meta.dirname, "..", "plugins");
const ENHANCEMENTS_PATH = join(import.meta.dirname, "..", "description-enhancements.json");

/**
 * Load and parse a JSON file.
 * @param {string} p - Path to the JSON file.
 * @returns {object|null} Parsed JSON object, or null if the file does not exist.
 */
function loadJson(p) {
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf-8"));
}

/**
 * Serialize an object to JSON and write it to a file.
 * @param {string} p - Path to the output file.
 * @param {object} data - Data to serialize.
 * @returns {void}
 */
function writeJson(p, data) {
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

// Step 1: Apply high-confidence descriptions to actual meta.json files
console.log("=== Step 1: Apply high-confidence descriptions to plugin files ===");
const enhancements = loadJson(ENHANCEMENTS_PATH);
const highConf = enhancements.filter(e => e.confidence >= 85);
console.log(`Found ${highConf.length} high-confidence suggestions`);

let descUpdated = 0;
for (const e of highConf) {
  const metaPath = join(PLUGINS_DIR, e.name, "meta.json");
  const pluginPath = join(PLUGINS_DIR, e.name, "plugin.json");
  const dumpPlugin = { name: e.name, current: e.current, suggested: e.suggested };

  // Update meta.json
  if (existsSync(metaPath)) {
    const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
    if (meta.description === e.current || (meta.description || "").length < 30) {
      meta.description = e.suggested;
      writeJson(metaPath, meta);
      descUpdated++;
      console.log(`  ✓ ${e.name}: meta.json description updated`);
    }
  }

  // Also update plugin.json if its description matches
  if (existsSync(pluginPath)) {
    const plugin = JSON.parse(readFileSync(pluginPath, "utf-8"));
    if (plugin.description === e.current && plugin.description !== e.suggested) {
      plugin.description = e.suggested;
      writeJson(pluginPath, plugin);
      console.log(`  ✓ ${e.name}: plugin.json description updated`);
    }
  }
}
console.log(`\nTotal meta.json descriptions updated: ${descUpdated}`);

// Step 2: Create install-guidance.json for missing plugins
console.log("\n=== Step 2: Create install-guidance.json for missing plugins ===");

const pluginDirs = readdirSync(PLUGINS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

let created = 0;
for (const dir of pluginDirs) {
  const pluginPath = join(PLUGINS_DIR, dir, "plugin.json");
  const igPath = join(PLUGINS_DIR, dir, "install-guidance.json");
  const metaPath = join(PLUGINS_DIR, dir, "meta.json");

  if (!existsSync(pluginPath) || !existsSync(metaPath)) continue;
  if (existsSync(igPath)) continue;

  const plugin = JSON.parse(readFileSync(pluginPath, "utf-8"));
  const ig = plugin.install_guidance;
  if (!ig || !ig.install_steps || !Array.isArray(ig.install_steps)) continue;

  const guid = {
    plugin: ig.plugin || dir,
    binary: ig.binary || dir,
    check: ig.check || `which ${ig.binary || dir}`,
    install_steps: ig.install_steps,
  };
  if (ig.note) guid.note = ig.note;

  writeJson(igPath, guid);
  created++;
  console.log(`  ✓ ${dir}: install-guidance.json created`);
}
console.log(`\nTotal install-guidance.json created: ${created}`);

console.log("\n✅ All enhancements applied successfully");
