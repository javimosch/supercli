#!/usr/bin/env node
"use strict"

/**
 * Reads plugin-scores.csv and enriches docs/meta-plugins.json with score metadata.
 *
 * The CSV file contains per-plugin scores and attributes (language, interactivity,
 * auth requirements, etc.). This script merges that data into the meta-plugins JSON
 * under a "score" property on each plugin object, then writes the enriched result
 * back to disk.
 *
 * Usage: node scripts/enrich-meta-plugins.js
 *
 * @module enrich-meta-plugins
 */

const fs = require('fs');
const path = require('path');

const SCORES_CSV = path.join(__dirname, '..', 'plugin-scores.csv');
const META_PLUGINS = path.join(__dirname, '..', 'docs', 'meta-plugins.json');

/**
 * Parse a CSV file and return an object mapping plugin names to their score rows.
 *
 * The first line is treated as a header row; subsequent lines are parsed into
 * objects keyed by those headers. The result is keyed by the "name" column.
 *
 * @param {string} filePath - Absolute or relative path to the CSV file.
 * @returns {Object<string, Object>} Object where keys are plugin names and values
 *   are row objects with the CSV headers as property names.
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const scores = {};
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    scores[row.name] = row;
  }
  
  return scores;
}

/**
 * Read plugin-scores.csv, enrich docs/meta-plugins.json, and write back.
 *
 * Flow:
 * 1. Parse the CSV file with {@link parseCSV} to get a map of scores by plugin name.
 * 2. Read and parse the existing docs/meta-plugins.json.
 * 3. Map over every plugin: if a matching score row exists, attach a structured
 *    `score` object (value, no_interactive, go_rust_nodejs, language, cli, tui,
 *    auth_required, complexity, binary, json_support, install).
 * 4. Wrap the result in a top-level object with a `generated` timestamp and count.
 * 5. Write the enriched JSON back to the same file.
 *
 * Side effects:
 * - Reads plugin-scores.csv (throws if not found).
 * - Reads docs/meta-plugins.json (throws if not found or malformed).
 * - Overwrites docs/meta-plugins.json with the enriched data.
 * - Logs progress messages to the console.
 */
function enrichMetaPlugins() {
  const scores = parseCSV(SCORES_CSV);
  const metaPlugins = JSON.parse(fs.readFileSync(META_PLUGINS, 'utf8'));
  
  const enrichedPlugins = metaPlugins.plugins.map(plugin => {
    const scoreData = scores[plugin.name];
    
    if (scoreData) {
      return {
        ...plugin,
        score: {
          value: parseInt(scoreData.score, 10),
          no_interactive: scoreData.no_interactive === 'yes',
          go_rust_nodejs: scoreData.go_rust_nodejs === 'yes',
          language: scoreData.language,
          cli: scoreData.cli === 'yes',
          tui: scoreData.tui === 'yes',
          auth_required: scoreData.auth_required === 'yes',
          complexity: scoreData.complexity,
          binary: scoreData.binary === 'yes',
          json_support: scoreData.json_support === 'yes',
          install: scoreData.install
        }
      };
    }
    
    return plugin;
  });
  
  const output = {
    generated: new Date().toISOString(),
    count: enrichedPlugins.length,
    plugins: enrichedPlugins
  };
  
  fs.writeFileSync(META_PLUGINS, JSON.stringify(output, null, 2));
  console.log(`Enriched ${META_PLUGINS} with score metadata`);
  const pluginsWithScores = enrichedPlugins.filter(p => p.score).length;
  console.log(`Added scores to ${pluginsWithScores} plugins`);
}

enrichMetaPlugins();
