#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

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

const DUMP_PATH = "marketing/plugins-dump.json";

// Tag vocabulary and keywords
const TAG_KEYWORDS: Record<string, string[]> = {
  "development": ["dev", "development", "build", "compiler", "language", "framework"],
  "testing": ["test", "testing", "unit", "integration", "qa", "quality"],
  "devops": ["devops", "docker", "kubernetes", "container", "deployment", "ci/cd", "pipeline"],
  "cloud": ["cloud", "aws", "azure", "gcp", "serverless", "infrastructure"],
  "database": ["database", "sql", "nosql", "postgres", "mongodb", "redis", "query"],
  "web": ["web", "http", "api", "rest", "server", "frontend", "backend"],
  "security": ["security", "crypto", "ssl", "tls", "auth", "encryption", "password"],
  "monitoring": ["monitor", "logging", "metrics", "observability", "telemetry", "analytics"],
  "data": ["data", "processing", "analytics", "ai", "ml", "machine learning", "dataset"],
  "media": ["media", "image", "video", "audio", "graphics", "conversion"],
  "productivity": ["productivity", "task", "project", "note", "todo", "document"],
  "system": ["system", "os", "linux", "unix", "windows", "process", "kernel"],
  "networking": ["network", "dns", "http", "socket", "proxy", "vpn", "ping"],
  "shell": ["shell", "bash", "zsh", "prompt", "terminal", "console"],
};

function suggestTags(plugin: Plugin): string[] {
  const existing = new Set(plugin.tags);
  const suggested = new Set<string>();

  const text = `${plugin.name} ${plugin.description}`.toLowerCase();

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (!existing.has(tag) && keywords.some(kw => text.includes(kw))) {
      suggested.add(tag);
    }
  }

  return Array.from(suggested).sort();
}

function guessSourceUrl(plugin: Plugin): string | null {
  // If already has a specific source, skip
  if (plugin.source && plugin.source !== "https://github.com") {
    return null;
  }

  // Common patterns
  const patterns = [
    { pattern: /^([\w-]+)$/, format: (m: string) => `https://github.com/javimosch/${m}` },
    { pattern: /^([\w-]+)$/, format: (m: string) => `https://github.com/${m}/${m}` },
  ];

  // Return best guess (second pattern is more common)
  return `https://github.com/${plugin.name}/${plugin.name}`;
}

function analyzePlugin(plugin: Plugin): Suggestion {
  const issues: string[] = [];
  const suggestions: Suggestion["suggestions"] = {};

  // Check description length
  if (plugin.description.length < 30) {
    issues.push("Very short description (< 30 chars)");
    suggestions.descriptionTip = `Current: "${plugin.description}" - Consider expanding with purpose/features`;
  }

  // Check source URL
  if (!plugin.source || plugin.source === "https://github.com") {
    issues.push("Generic or missing source URL");
    suggestions.sourceUrl = guessSourceUrl(plugin);
  }

  // Check tags
  if (plugin.tags.length < 3) {
    issues.push(`Minimal tags (${plugin.tags.length} only)`);
    const additional = suggestTags(plugin);
    if (additional.length > 0) {
      suggestions.additionalTags = additional;
    }
  }

  return {
    name: plugin.name,
    issues,
    suggestions,
  };
}

async function main() {
  console.log("🔧 Plugin Quality Auto-Fixer");
  console.log("============================\n");

  const plugins: Plugin[] = JSON.parse(readFileSync(DUMP_PATH, "utf-8"));
  const suggestions: Suggestion[] = [];

  let processed = 0;
  for (const plugin of plugins) {
    const suggestion = analyzePlugin(plugin);
    if (suggestion.issues.length > 0) {
      suggestions.push(suggestion);
    }
    processed++;
    if (processed % 200 === 0) {
      process.stdout.write(`\rProcessed: ${processed}/${plugins.length}`);
    }
  }
  console.log(`\rProcessed: ${plugins.length}/${plugins.length}`);

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalPlugins: plugins.length,
    pluginsNeedingFixes: suggestions.length,
    summary: {
      shortDescription: suggestions.filter(s => s.issues.some(i => i.includes("short description"))).length,
      genericSource: suggestions.filter(s => s.issues.some(i => i.includes("source URL"))).length,
      minimalTags: suggestions.filter(s => s.issues.some(i => i.includes("tags"))).length,
    },
    suggestions: suggestions.slice(0, 50), // First 50 for display
    totalSuggestions: suggestions.length,
  };

  console.log("\n📊 Analysis Complete\n");
  console.log(`Plugins needing fixes: ${suggestions.length} (${(suggestions.length / plugins.length * 100).toFixed(1)}%)`);
  console.log(`\n  - Short descriptions: ${report.summary.shortDescription}`);
  console.log(`  - Generic source URLs: ${report.summary.genericSource}`);
  console.log(`  - Minimal tags: ${report.summary.minimalTags}`);

  console.log(`\n📝 First 10 plugins needing fixes:\n`);
  suggestions.slice(0, 10).forEach((s, i) => {
    console.log(`${i + 1}. ${s.name}`);
    s.issues.forEach(issue => console.log(`   - ${issue}`));
    if (s.suggestions.sourceUrl) {
      console.log(`   ✓ Suggested source: ${s.suggestions.sourceUrl}`);
    }
    if (s.suggestions.additionalTags?.length) {
      console.log(`   ✓ Suggested tags: ${s.suggestions.additionalTags.join(", ")}`);
    }
    console.log();
  });

  // Save full report
  writeFileSync("plugin-quality-report.json", JSON.stringify(report, null, 2));
  console.log(`\n✓ Full report saved to: plugin-quality-report.json`);
  console.log(`  (${report.totalSuggestions} total plugins with suggestions)`);
}

main().catch(console.error);
