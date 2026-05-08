#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";
import * as readline from "readline";

interface Plugin {
  name: string;
  description: string;
  tags: string[];
  source: string;
  installSteps: string[];
}

// AI suggestions based on name and tags
function suggestDescription(plugin: Plugin): string {
  const { name, tags, source } = plugin;
  const tagStr = tags.slice(0, 3).join(", ");

  // Pattern-based suggestions
  const patterns: Record<string, (name: string) => string> = {
    // Languages/Runtimes
    "python": () => `Python — interpreted programming language with extensive libraries`,
    "rust": () => `Rust — systems programming language emphasizing safety and performance`,
    "go": () => `Go — compiled language designed for simplicity and concurrency`,
    "javascript": () => `JavaScript — versatile language for web and server development`,
    "bash": () => `Bash — POSIX shell interpreter and command language`,
    "zsh": () => `Zsh — advanced shell with scripting capabilities`,

    // Development Tools
    "git": () => `Git — distributed version control system for code management`,
    "docker": () => `Docker — containerization platform for application deployment`,
    "kubernetes": () => `Kubernetes — container orchestration for scalable deployments`,

    // Data Tools
    "database": () => `Database tool for querying and managing data`,
    "sql": () => `SQL query tool for relational database operations`,

    // Productivity
    "task": () => `Task management tool for organizing work and projects`,
    "note": () => `Note-taking application for capturing and organizing information`,
  };

  // Try to match tags
  for (const tag of tags) {
    if (patterns[tag]) {
      return patterns[tag](name);
    }
  }

  // Fallback: Use tags to construct description
  if (tags.length > 0) {
    return `${name} — ${tags[0]} tool for ${tags.slice(1, 3).join(" and ")}`;
  }

  return `${name} — command-line tool with features and capabilities`;
}

async function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("📝 Plugin Description Enhancer");
  console.log("=============================\n");

  // Load plugins
  const plugins: Plugin[] = JSON.parse(readFileSync("marketing/plugins-dump.json", "utf-8"));
  const shortDesc = plugins.filter((p) => (p.description || "").length < 30);

  console.log(`Found ${shortDesc.length} plugins with short descriptions (< 30 chars)\n`);

  if (shortDesc.length === 0) {
    console.log("✓ All plugins have adequate descriptions!");
    process.exit(0);
  }

  const rl = await createInterface();

  let enhanced = 0;
  let skipped = 0;
  const updates: Map<string, string> = new Map();

  for (let i = 0; i < shortDesc.length; i++) {
    const plugin = shortDesc[i];
    const suggestion = suggestDescription(plugin);

    console.log(`\n[${i + 1}/${shortDesc.length}] ${plugin.name}`);
    console.log(`Tags: ${plugin.tags.join(", ")}`);
    console.log(`Source: ${plugin.source}`);
    console.log(`Current: "${plugin.description}" (${plugin.description.length} chars)`);
    console.log(`Suggested: "${suggestion}" (${suggestion.length} chars)`);

    const response = await askQuestion(rl, "\n(a)ccept / (e)dit / (s)kip / (q)uit? ");

    if (response.toLowerCase() === "q") {
      console.log("\nStopping enhancement...");
      break;
    }

    if (response.toLowerCase() === "s") {
      skipped++;
      continue;
    }

    if (response.toLowerCase() === "a") {
      updates.set(plugin.name, suggestion);
      enhanced++;
      console.log("✓ Accepted");
    } else if (response.toLowerCase() === "e") {
      const custom = await askQuestion(rl, "Enter new description: ");
      if (custom.length >= 30) {
        updates.set(plugin.name, custom);
        enhanced++;
        console.log("✓ Custom description saved");
      } else {
        console.log("⚠ Description too short (< 30 chars), skipped");
        skipped++;
      }
    }
  }

  // Apply updates
  if (updates.size > 0) {
    console.log(`\n✅ Applying ${updates.size} description updates...`);

    for (const plugin of plugins) {
      if (updates.has(plugin.name)) {
        plugin.description = updates.get(plugin.name)!;
      }
    }

    writeFileSync("marketing/plugins-dump.json", JSON.stringify(plugins, null, 2));
    console.log("✓ plugins-dump.json updated");
  }

  console.log(`\n📊 Summary`);
  console.log(`==========`);
  console.log(`Enhanced: ${enhanced}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Remaining: ${shortDesc.length - enhanced - skipped}`);

  rl.close();
}

main().catch(console.error);
