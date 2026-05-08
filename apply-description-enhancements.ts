#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";

interface Enhancement {
  name: string;
  current: string;
  suggested: string;
  confidence: number;
}

// Confidence threshold for auto-apply
const AUTO_APPLY_THRESHOLD = 85;

async function main() {
  console.log("✨ Applying Description Enhancements");
  console.log("===================================\n");

  // Load data
  const plugins = JSON.parse(readFileSync("marketing/plugins-dump.json", "utf-8"));
  const enhancements: Enhancement[] = JSON.parse(readFileSync("description-enhancements.json", "utf-8"));

  // Separate by confidence
  const highConf = enhancements.filter((e) => e.confidence >= AUTO_APPLY_THRESHOLD);
  const mediumConf = enhancements.filter((e) => e.confidence < AUTO_APPLY_THRESHOLD);

  console.log(`High-confidence (>= ${AUTO_APPLY_THRESHOLD}): ${highConf.length}`);
  console.log(`Medium-confidence (< ${AUTO_APPLY_THRESHOLD}): ${mediumConf.length}\n`);

  // Create map for fast lookup
  const pluginMap = new Map(plugins.map((p) => [p.name, p]));

  // Apply high-confidence enhancements
  console.log(`📝 Applying ${highConf.length} high-confidence enhancements...\n`);

  let applied = 0;
  for (const enhancement of highConf) {
    const plugin = pluginMap.get(enhancement.name);
    if (plugin && plugin.description === enhancement.current) {
      plugin.description = enhancement.suggested;
      applied++;
      console.log(`✓ ${enhancement.name}`);
    }
  }

  console.log(`\n✅ Applied: ${applied} high-confidence enhancements`);

  // Show medium-confidence for review
  if (mediumConf.length > 0) {
    console.log(`\n⚠️  ${mediumConf.length} medium-confidence suggestions (manual review recommended):`);
    mediumConf.forEach((e) => {
      console.log(`\n  ${e.name} (confidence: ${e.confidence}%)`);
      console.log(`    → "${e.suggested}"`);
    });
  }

  // Save updated plugins
  writeFileSync("marketing/plugins-dump.json", JSON.stringify(pluginMap.get(...pluginMap.keys()) ? plugins : plugins, null, 2));

  // Re-check quality
  const afterShort = plugins.filter((p) => (p.description || "").length < 30);
  console.log(`\n📊 Quality After Enhancement`);
  console.log(`===========================`);
  console.log(`Short descriptions remaining: ${afterShort.length}`);
  console.log(`Average description length: ${Math.round(plugins.reduce((sum, p) => sum + (p.description || "").length, 0) / plugins.length)} chars`);

  console.log(`\n✓ plugins-dump.json updated`);
}

main().catch(console.error);
