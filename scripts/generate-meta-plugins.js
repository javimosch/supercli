#!/usr/bin/env node
"use strict"

/**
 * Generates docs/meta-plugins.json from plugin metadata.
 *
 * This script scans the plugins/ directory for meta.json files and combines
 * them with legacy entries from plugins/plugins.json to create a unified
 * plugin metadata file for documentation purposes.
 *
 * Usage: node scripts/generate-meta-plugins.js
 *
 * @module generate-meta-plugins
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const PLUGINS_JSON = path.join(PLUGINS_DIR, 'plugins.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'meta-plugins.json');

/**
 * Read and parse a JSON file.
 *
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @returns {Object|null} Parsed JSON object, or null if file doesn't exist or is invalid.
 */
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Extract plugin metadata from a plugin directory.
 *
 * Reads meta.json from the plugin directory and checks for the presence
 * of a quickstart skill file to determine if the plugin has learn content.
 *
 * @param {string} pluginDir - Absolute path to the plugin directory.
 * @returns {Object|null} Plugin metadata object with name, description, tags, and has_learn,
 *   or null if meta.json doesn't exist.
 */
function getPluginMeta(pluginDir) {
  const metaPath = path.join(pluginDir, 'meta.json');
  const meta = readJson(metaPath);
  if (!meta) return null;
  
  const name = path.basename(pluginDir);
  const hasLearn = fs.existsSync(path.join(pluginDir, 'skills', 'quickstart', 'SKILL.md'));
  
  return {
    name,
    description: meta.description || '',
    tags: meta.tags || [],
    has_learn: meta.has_learn || hasLearn
  };
}

/**
 * Collect plugin metadata from legacy plugins.json entries.
 *
 * Reads plugins/plugins.json and extracts metadata for plugins that don't
 * have a meta.json file (i.e., legacy plugins). Skips plugins that have
 * been migrated to the new meta.json format.
 *
 * @returns {Array<Object>} Array of plugin metadata objects from legacy entries.
 */
function collectFromPluginsJson() {
  const data = readJson(PLUGINS_JSON);
  if (!data || !data.plugins) return [];
  
  return data.plugins.map(plugin => {
    const sourcePath = plugin.source?.manifest_path || '';
    const name = plugin.name;
    const pluginDir = path.join(PLUGINS_DIR, name);
    
    const metaPath = path.join(pluginDir, 'meta.json');
    if (fs.existsSync(metaPath)) {
      return null;
    }
    
    return {
      name,
      description: plugin.description || '',
      tags: plugin.tags || [],
      has_learn: plugin.has_learn || false,
      source: sourcePath
    };
  }).filter(Boolean);
}

/**
 * Main function to generate meta-plugins.json.
 *
 * Combines plugin metadata from meta.json files (new format) and plugins.json
 * (legacy format), deduplicates by name, sorts alphabetically, and writes
 * the unified output to docs/meta-plugins.json.
 *
 * Side effects:
 * - Reads plugins/ directory and plugins/plugins.json.
 * - Creates or overwrites docs/meta-plugins.json.
 * - Logs progress to the console.
 */
function main() {
  const plugins = [];
  const seen = new Set();
  
  const metaDirs = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(PLUGINS_DIR, entry.name));
  
  for (const dir of metaDirs) {
    const meta = getPluginMeta(dir);
    if (meta) {
      plugins.push(meta);
      seen.add(meta.name);
    }
  }
  
  const legacyPlugins = collectFromPluginsJson();
  for (const plugin of legacyPlugins) {
    if (!seen.has(plugin.name)) {
      plugins.push(plugin);
      seen.add(plugin.name);
    }
  }
  
  plugins.sort((a, b) => a.name.localeCompare(b.name));
  
  const output = {
    generated: new Date().toISOString(),
    count: plugins.length,
    plugins
  };
  
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Generated ${OUTPUT_FILE} with ${plugins.length} plugins`);
}

main();
