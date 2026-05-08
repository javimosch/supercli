#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";

interface Plugin {
  name: string;
  description: string;
  tags: string[];
  source: string;
  installSteps: string[];
}

interface Suggestion {
  name: string;
  issues: string[];
  suggestions: {
    sourceUrl?: string;
    additionalTags?: string[];
    descriptionTip?: string;
  };
}

interface Report {
  suggestions: Suggestion[];
}

async function main() {
  console.log("🔧 Applying Plugin Quality Fixes");
  console.log("================================\n");

  // Load suggestions and plugins
  const report: Report = JSON.parse(readFileSync("plugin-quality-report.json", "utf-8"));
  const plugins: Plugin[] = JSON.parse(readFileSync("marketing/plugins-dump.json", "utf-8"));

  const pluginMap = new Map(plugins.map(p => [p.name, p]));
  let fixed = 0;
  let sourceUrlsAdded = 0;
  let tagsAdded = 0;

  for (const suggestion of report.suggestions) {
    const plugin = pluginMap.get(suggestion.name);
    if (!plugin) continue;

    // Apply source URL fix
    if (suggestion.suggestions.sourceUrl && (!plugin.source || plugin.source === "https://github.com")) {
      plugin.source = suggestion.suggestions.sourceUrl;
      sourceUrlsAdded++;
      console.log(`✓ ${plugin.name}: Source URL added`);
    }

    // Apply tag suggestions
    if (suggestion.suggestions.additionalTags) {
      const before = plugin.tags.length;
      suggestion.suggestions.additionalTags.forEach(tag => {
        if (!plugin.tags.includes(tag)) {
          plugin.tags.push(tag);
        }
      });
      if (plugin.tags.length > before) {
        tagsAdded += plugin.tags.length - before;
        console.log(`✓ ${plugin.name}: Added ${plugin.tags.length - before} tags`);
      }
    }

    fixed++;
  }

  // Re-sort plugin array
  const updatedPlugins = Array.from(pluginMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Save updated dump
  writeFileSync("marketing/plugins-dump.json", JSON.stringify(updatedPlugins, null, 2));

  console.log(`\n✅ Quality Fixes Applied`);
  console.log(`========================`);
  console.log(`Plugins fixed: ${fixed}`);
  console.log(`Source URLs added: ${sourceUrlsAdded}`);
  console.log(`Tags added: ${tagsAdded}`);
  console.log(`\n✓ Updated plugins-dump.json with ${updatedPlugins.length} plugins`);
}

main().catch(console.error);
