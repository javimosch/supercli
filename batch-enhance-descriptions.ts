#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";

interface Plugin {
  name: string;
  description: string;
  tags: string[];
  source: string;
  installSteps: string[];
}

interface Enhancement {
  name: string;
  current: string;
  suggested: string;
  confidence: number;
}

// Comprehensive description knowledge base
const DESCRIPTIONS: Record<string, string> = {
  // Shells
  "bash": "GNU Bash — portable shell interpreter with scripting capabilities",
  "zsh": "Zsh — advanced shell with interactive features and scripting",
  "fish": "Fish shell — user-friendly shell with intuitive syntax",
  "ksh": "Korn Shell — POSIX shell with C-like syntax",
  "tcsh": "Tcsh — C shell with command-line editing and history",
  "mksh": "mksh — lightweight POSIX shell implementation",
  "xonsh": "Xonsh — Python-powered shell blending shell and Python",
  "nushell": "Nushell — structured shell language for modern development",

  // Version Control & Development
  "git-cliff": "git-cliff — automated changelog generator from git history",
  "git": "Git — distributed version control system for code",
  "gh": "GitHub CLI — command-line interface for GitHub operations",

  // Search & Navigation
  "ripgrep-all": "ripgrep-all — search documents with ripgrep backend",
  "rg-all": "ripgrep-all variant — enhanced search across file types",
  "zoxide": "Zoxide — smart directory jumper with frecency tracking",
  "fzf": "fzf — command-line fuzzy finder for interactive filtering",

  // Terminal Tools
  "tldr": "tldr — simplified man pages with practical examples",
  "hyperfine": "Hyperfine — command benchmarking tool for performance testing",
  "watchexec": "Watchexec — runs commands on file system changes",
  "peco": "Peco — simple interactive filter for shell piping",
  "sk": "Skim — fuzzy finder written in Rust for speed",

  // Package Managers & Build
  "cargo": "Cargo — Rust package manager and build system",
  "npm": "npm — Node.js package manager for JavaScript",
  "pnpm": "pnpm — fast npm alternative with disk efficiency",
  "poetry": "Poetry — Python dependency management and packaging",
  "cargo-watch": "cargo-watch — watches files and rebuilds on changes",
  "cargo-tree": "cargo-tree — displays dependency tree for Rust projects",
  "wasm-pack": "wasm-pack — tool for building Rust WebAssembly projects",

  // Data & Serialization
  "serde": "Serde — serialization framework for Rust",
  "toml": "TOML — configuration file format parser",
  "yaml": "YAML — human-friendly data serialization format",
  "serde-json": "serde-json — JSON serialization for Rust",
  "ron": "RON — Rusty Object Notation serialization format",

  // Testing & Quality
  "proptest": "proptest — property-based testing framework for Rust",
  "quickcheck": "quickcheck — property-based testing for Rust",
  "criterion": "criterion — benchmarking library for Rust",
  "nextest": "nextest — next-generation test runner for Rust",

  // Async & Concurrency
  "tokio": "Tokio — async runtime for Rust applications",
  "async-std": "async-std — async/await for Rust",

  // Parsing & Language Tools
  "tree-sitter": "Tree-sitter — incremental parsing system for programming languages",
  "lalrpop": "LALRPOP — LR parser generator for Rust",
  "nom": "nom — parser combinator library for Rust",
  "nom-derive": "nom-derive — derive macros for nom parsers",

  // Web & Networking
  "surf": "Surf — async HTTP client library for Rust",
  "httpie": "HTTPie — user-friendly HTTP client for command line",

  // Cloud & Infrastructure
  "nomad": "Nomad — workload orchestrator across datacenters",
  "docker": "Docker — containerization platform for application deployment",
  "kubernetes": "Kubernetes — container orchestration for scalable deployments",
  "libp2p": "libp2p — peer-to-peer networking library",

  // CLI Tools
  "structopt": "structopt — derive macros for CLI argument parsing",
  "pico-args": "pico-args — minimal argument parser for Rust",
  "getopts": "getopts — command-line argument parsing library",

  // Utilities
  "tree-climb": "tree-climb — recursively search directory tree",
  "tree-query": "tree-query — query tree structures",
  "tree-walk": "tree-walk — traverse directory trees",
  "num-format": "num-format — format numbers with separators",
  "pickle": "pickle — serialization format",
  "rand": "rand — Rust random number generator library",
  "html-minifier": "html-minifier — HTML compression and minification",

  // Cloud Providers
  "linode-cli": "Linode CLI — command-line tool for Linode cloud",
  "vultr-cli": "Vultr CLI — command-line interface for Vultr cloud",
  "scaleway": "Scaleway CLI — command-line tool for Scaleway cloud",
  "googlews": "Google Workspace CLI — manage Google Workspace services",
  "hostvn": "HostVN CLI — Vietnam hosting provider interface",

  // Web Frameworks
  "yew": "Yew — Rust framework for building web frontends",
  "trunk": "Trunk — build system for Rust web applications",

  // Specialized
  "openpilot": "OpenPilot — open-source autonomous driving system",
  "massgen": "Massgen — multi-agent system coordination tool",
  "matchmaker": "Matchmaker — pattern matching utility",
  "graphify-out": "Graphify output — knowledge graph utilities",
};

function enhanceDescription(plugin: Plugin): Enhancement {
  const { name, description, tags } = plugin;

  // Try direct lookup first
  if (DESCRIPTIONS[name]) {
    return {
      name,
      current: description,
      suggested: DESCRIPTIONS[name],
      confidence: 95,
    };
  }

  // Try lowercase match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(DESCRIPTIONS)) {
    if (key.toLowerCase() === lowerName) {
      return {
        name,
        current: description,
        suggested: value,
        confidence: 90,
      };
    }
  }

  // Try partial match in tags
  for (const tag of tags) {
    if (DESCRIPTIONS[tag]) {
      const suggestion = `${name} — ${tag} tool`;
      return {
        name,
        current: description,
        suggested: suggestion,
        confidence: 60,
      };
    }
  }

  // Fallback: construct from tags
  if (tags.length >= 2) {
    const suggestion = `${name} — ${tags[0]} tool for ${tags[1]}`;
    return {
      name,
      current: description,
      suggested: suggestion,
      confidence: 40,
    };
  }

  return {
    name,
    current: description,
    suggested: `${name} — command-line utility`,
    confidence: 30,
  };
}

async function main() {
  console.log("🔧 Batch Description Enhancement");
  console.log("================================\n");

  // Load plugins
  const plugins: Plugin[] = JSON.parse(readFileSync("marketing/plugins-dump.json", "utf-8"));
  const shortDesc = plugins.filter((p) => (p.description || "").length < 30);

  console.log(`Processing ${shortDesc.length} plugins with short descriptions\n`);

  // Generate suggestions
  const enhancements = shortDesc.map((p) => enhanceDescription(p));

  // Sort by confidence
  enhancements.sort((a, b) => b.confidence - a.confidence);

  // Display high-confidence suggestions
  console.log("🎯 High-Confidence Suggestions (Confidence >= 85):\n");
  const highConf = enhancements.filter((e) => e.confidence >= 85);
  highConf.slice(0, 20).forEach((e) => {
    console.log(`${e.name}`);
    console.log(`  Current: "${e.current}"`);
    console.log(`  → "${e.suggested}"`);
    console.log();
  });

  console.log(`\n📊 Confidence Distribution:`);
  console.log(`  >= 85: ${enhancements.filter((e) => e.confidence >= 85).length}`);
  console.log(`  70-84: ${enhancements.filter((e) => e.confidence >= 70 && e.confidence < 85).length}`);
  console.log(`  50-69: ${enhancements.filter((e) => e.confidence >= 50 && e.confidence < 70).length}`);
  console.log(`  < 50:  ${enhancements.filter((e) => e.confidence < 50).length}`);

  // Save report
  writeFileSync("description-enhancements.json", JSON.stringify(enhancements, null, 2));
  console.log("\n✓ Full report saved to: description-enhancements.json");

  // Ask for auto-apply
  console.log("\n💡 Suggestion: Review description-enhancements.json to see all suggestions");
  console.log("   Then run: bun apply-description-enhancements.ts");
}

main().catch(console.error);
