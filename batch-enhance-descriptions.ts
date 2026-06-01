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

// Tag category templates for common tag words
const TAG_TEMPLATES: Record<string, string> = {
  "utility": "command-line utility",
  "utilities": "utility toolset",
  "system": "system administration tool",
  "network": "networking and connectivity tool",
  "networking": "networking tool",
  "testing": "testing and analysis tool",
  "tests": "testing tool",
  "test": "testing utility",
  "x11": "X11 graphical utility",
  "email": "email client and utility",
  "editor": "text editor",
  "language": "programming language tool",
  "dev": "software development tool",
  "development": "development tool",
  "python": "Python programming utility",
  "node": "Node.js development tool",
  "javascript": "JavaScript development tool",
  "cli": "command-line interface tool",
  "media": "media processing tool",
  "kubernetes": "Kubernetes container orchestration tool",
  "k8s": "Kubernetes tool",
  "security": "security and auditing tool",
  "database": "database management tool",
  "db": "database tool",
  "monitoring": "system monitoring tool",
  "encoding": "encoding and decoding utility",
  "encryption": "encryption and security utility",
  "productivity": "productivity tool",
  "golang": "Go language utility",
  "go": "Go programming tool",
  "android": "Android development tool",
  "java": "Java development tool",
  "rust": "Rust programming tool",
  "music": "music and audio tool",
  "audio": "audio processing tool",
  "video": "video processing tool",
  "git": "Git version control tool",
  "docker": "Docker container tool",
  "aws": "Amazon Web Services tool",
  "cloud": "cloud computing tool",
  "compression": "compression and archiving utility",
  "archive": "archiving utility",
  "backup": "backup and restore tool",
  "terminal": "terminal emulator",
  "font": "font management tool",
  "theme": "theme management tool",
  "image": "image processing tool",
  "images": "image processing tool",
  "ascii": "ASCII art and text utility",
  "documents": "document processing tool",
  "documentation": "documentation tool",
  "pdf": "PDF processing tool",
  "markdown": "Markdown processing tool",
  "json": "JSON processing tool",
  "xml": "XML processing tool",
  "css": "CSS and styling tool",
  "html": "HTML processing tool",
  "browser": "web browser tool",
  "web": "web development tool",
  "api": "API development tool",
  "server": "server management tool",
  "proxy": "proxy and tunneling tool",
  "vpn": "VPN and networking tool",
  "dns": "DNS management tool",
  "ssh": "SSH and remote access tool",
  "automation": "automation tool",
  "build": "build and compilation tool",
  "package": "package management tool",
  "packages": "package manager",
  "plugin": "plugin management tool",
  "config": "configuration management tool",
  "logging": "logging and observability tool",
  "analytics": "analytics and data tool",
  "ai": "AI and machine learning tool",
  "ml": "machine learning tool",
  "data": "data processing tool",
  "scraping": "web scraping tool",
  "search": "search and indexing tool",
  "linting": "code linting and quality tool",
  "linter": "code linting tool",
  "formatter": "code formatting tool",
  "debug": "debugging tool",
  "profiling": "profiling and performance tool",
  "benchmark": "benchmarking tool",
  "converter": "file format conversion tool",
  "convert": "file conversion utility",
  "generator": "code and file generation tool",
  "template": "templating engine",
  "render": "rendering engine",
  "game": "game development tool",
  "gamedev": "game development tool",
  "blockchain": "blockchain and Web3 tool",
  "crypto": "cryptocurrency tool",
  "hardware": "hardware tool",
  "embedded": "embedded systems tool",
  "iot": "IoT development tool",
  "science": "scientific computing tool",
  "math": "mathematical tool",
  "geo": "geospatial tool",
  "maps": "mapping and GIS tool",
  "font-utils": "font utility",
  "input": "input method utility",
  "display": "display management tool",
  "window": "window management tool",
  "wm": "window manager tool",
};

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

function isUrlTag(tag: string): boolean {
  return tag.startsWith("//") || tag.startsWith("https://") || tag.startsWith("http://");
}

function cleanTags(tags: string[], name: string): string[] {
  return tags.filter((t) => !isUrlTag(t) && t.toLowerCase() !== name.toLowerCase());
}

function getTagTemplate(tag: string): string | undefined {
  const lower = tag.toLowerCase();
  return TAG_TEMPLATES[lower] || TAG_TEMPLATES[tag];
}

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

  // Clean tags: remove URL-like tags and self-referential tags
  const clean = cleanTags(tags, name);

  // Try partially matching a cleaned tag against DESCRIPTIONS
  for (const tag of clean) {
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

  // Try tag template match on cleaned tags
  for (const tag of clean) {
    const template = getTagTemplate(tag);
    if (template) {
      const suggestion = `${name} — ${template}`;
      return {
        name,
        current: description,
        suggested: suggestion,
        confidence: 55,
      };
    }
  }

  // Enrich existing description if it's meaningful but short
  const desc = description || "";
  if (desc.length > 5 && desc !== name && !desc.toLowerCase().includes(name.toLowerCase())) {
    const enriched = `${desc.charAt(0).toUpperCase() + desc.slice(1)} — command-line tool`;
    if (enriched.length > desc.length) {
      return {
        name,
        current: description,
        suggested: enriched,
        confidence: 50,
      };
    }
  }

  // Fallback: construct from cleaned tags
  if (clean.length >= 2) {
    const s1 = getTagTemplate(clean[0]) || `${clean[0]} tool`;
    const suggestion = `${name} — ${s1}`;
    return {
      name,
      current: description,
      suggested: suggestion,
      confidence: 45,
    };
  }

  if (clean.length === 1) {
    const template = getTagTemplate(clean[0]);
    if (template) {
      return {
        name,
        current: description,
        suggested: `${name} — ${template}`,
        confidence: 45,
      };
    }
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
