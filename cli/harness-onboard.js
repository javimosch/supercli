const fs = require("fs");
const path = require("path");
const { compileForHarness, getAllHarnesses, HARNESS_CONFIGS } = require("../skills/supercli/compile");

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
  });
}

function detectHarnesses(targetDir = process.cwd()) {
  const detected = [];
  const checks = [
    { name: "claude", patterns: [".claude"] },
    { name: "opencode", patterns: [".opencode"] },
    { name: "cursor", patterns: [".cursor"] },
    { name: "windsurf", patterns: [".windsurfrules", ".windsurf"] },
  ];

  for (const check of checks) {
    for (const pattern of check.patterns) {
      const fullPath = path.join(targetDir, pattern);
      if (fs.existsSync(fullPath)) {
        if (!detected.includes(check.name)) {
          detected.push(check.name);
        }
        break;
      }
    }
  }

  return detected;
}

function parseHarnesses(harnessFlag) {
  if (!harnessFlag) return null;
  const requested = String(harnessFlag).split(",").map((h) => h.trim().toLowerCase());
  const allHarnesses = getAllHarnesses();
  const invalidHarnesses = requested.filter((h) => !allHarnesses.includes(h));
  if (invalidHarnesses.length > 0) {
    throw invalid(`Unknown harnesses: ${invalidHarnesses.join(", ")}. Valid: ${allHarnesses.join(", ")}`);
  }
  return requested;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function handleHarnessOnboard({ positional, flags, humanMode, output, outputError }) {
  const targetDir = flags.target ? String(flags.target) : process.cwd();
  const dryRun = !!flags["dry-run"];
  const force = !!flags.force;

  if (flags.detect) {
    const detected = detectHarnesses(targetDir);
    output({
      version: "1.0",
      mode: "onboard_detect",
      description: "Detect AI harnesses in target directory",
      target: targetDir,
      detected,
      all_available: getAllHarnesses(),
      harness_paths: {
        claude: ".claude/skills/supercli/SKILL.md",
        opencode: ".opencode/skills/supercli/SKILL.md",
        agents: ".agents/skills/supercli/SKILL.md",
        cursor: ".cursor/rules/supercli.mdc",
        windsurf: ".windsurfrules"
      }
    });
    return;
  }

  if (!flags.harness && !flags.target) {
    if (humanMode) {
      console.log("\n  ⚡ SuperCLI Onboard\n");
      console.log("  Install supercli skill document into AI harness directories.\n");
      console.log("  Usage:");
      console.log("    supercli onboard                              # Auto-detect and install");
      console.log("    supercli onboard --detect                     # List detected harnesses");
      console.log("    supercli onboard --harness claude,opencode   # Install to specific harnesses");
      console.log("    supercli onboard --target ./project           # Install to directory");
      console.log("    supercli onboard --dry-run                   # Preview without installing");
      console.log("    supercli onboard --force                     # Overwrite existing\n");
      console.log("  Harnesses:");
      console.log("    claude, opencode, agents, cursor, windsurf\n");
    } else {
      output({
        version: "1.0",
        mode: "onboard_help",
        description: "Install supercli skill document into AI harness directories",
        usage: "supercli onboard [--harness <harnesses>] [--target <path>] [--detect] [--dry-run] [--force]",
        harnesses: {
          claude: { path: ".claude/skills/supercli/SKILL.md", format: "SKILL.md" },
          opencode: { path: ".opencode/skills/supercli/SKILL.md", format: "SKILL.md" },
          agents: { path: ".agents/skills/supercli/SKILL.md", format: "SKILL.md" },
          cursor: { path: ".cursor/rules/supercli.mdc", format: ".mdc" },
          windsurf: { path: ".windsurfrules", format: "markdown" }
        },
        flags: {
          "--harness": "Comma-separated harnesses (claude,opencode,agents,cursor,windsurf)",
          "--target": "Target directory (default: current directory)",
          "--detect": "List detected harnesses without installing",
          "--dry-run": "Preview actions without writing files",
          "--force": "Overwrite existing skill files"
        },
        examples: [
          "supercli onboard --detect --json",
          "supercli onboard --harness claude --json",
          "supercli onboard --harness claude,opencode,cursor,windsurf --force --json",
          "supercli onboard --target ./frontend --harness claude --json"
        ]
      });
    }
    return;
  }

  const requestedHarnesses = parseHarnesses(flags.harness);
  const harnessesToInstall = requestedHarnesses || detectHarnesses(targetDir);

  if (harnessesToInstall.length === 0) {
    outputError({
      code: 92,
      type: "resource_not_found",
      message: "No AI harnesses detected. Use --harness to specify explicitly.",
      suggestions: [
        `supercli onboard --harness claude,opencode,cursor,windsurf`,
      ],
    });
    return;
  }

  const results = [];

  for (const harness of harnessesToInstall) {
    const { skillPath, content } = compileForHarness(harness);
    const fullPath = path.join(targetDir, skillPath);

    const result = {
      harness,
      path: skillPath,
      fullPath,
      action: "skip",
      reason: null,
    };

    if (fs.existsSync(fullPath) && !force) {
      result.action = "skip";
      result.reason = "exists (use --force to overwrite)";
    } else {
      if (!dryRun) {
        try {
          ensureDir(fullPath);
          fs.writeFileSync(fullPath, content, "utf-8");
          result.action = "installed";
        } catch (err) {
          result.action = "error";
          result.reason = err.message;
        }
      } else {
        result.action = "would_install";
      }
    }

    results.push(result);
  }

  const installed = results.filter((r) => r.action === "installed" || r.action === "would_install");
  const skipped = results.filter((r) => r.action === "skip");
  const errors = results.filter((r) => r.action === "error");

  if (humanMode) {
    console.log("\n  ⚡ SuperCLI Onboard\n");
    console.log(`  Target: ${targetDir}\n`);

    if (installed.length > 0) {
      console.log("  Installed:");
      installed.forEach((r) => console.log(`    ✓ ${r.harness}: ${r.path}`));
    }

    if (skipped.length > 0) {
      console.log("\n  Skipped:");
      skipped.forEach((r) => console.log(`    - ${r.harness}: ${r.reason}`));
    }

    if (errors.length > 0) {
      console.log("\n  Errors:");
      errors.forEach((r) => console.log(`    ✗ ${r.harness}: ${r.reason}`));
    }

    if (dryRun) {
      console.log("\n  (dry-run mode - no files written)\n");
    } else {
      console.log("");
    }
  } else {
    output({
      mode: "onboard",
      target: targetDir,
      dry_run: dryRun,
      results,
      summary: {
        installed: installed.length,
        skipped: skipped.length,
        errors: errors.length,
      },
    });
  }
}

async function handleHarnessOffboard({ positional, flags, humanMode, output, outputError }) {
  const targetDir = flags.target ? String(flags.target) : process.cwd();
  const dryRun = !!flags["dry-run"];
  const force = !!flags.force;

  const requestedHarnesses = parseHarnesses(flags.harness);
  const harnessesToRemove = requestedHarnesses || getAllHarnesses();

  const results = [];

  for (const harness of harnessesToRemove) {
    const config = HARNESS_CONFIGS[harness];
    if (!config) continue;

    const fullPath = path.join(targetDir, config.skillPath);

    const result = {
      harness,
      path: config.skillPath,
      fullPath,
      action: "skip",
      reason: null,
    };

    if (!fs.existsSync(fullPath)) {
      result.action = "skip";
      result.reason = "not_found";
    } else {
      if (!dryRun) {
        try {
          fs.unlinkSync(fullPath);
          result.action = "removed";
        } catch (err) {
          result.action = "error";
          result.reason = err.message;
        }
      } else {
        result.action = "would_remove";
      }
    }

    results.push(result);
  }

  const removed = results.filter((r) => r.action === "removed" || r.action === "would_remove");
  const skipped = results.filter((r) => r.action === "skip");
  const errors = results.filter((r) => r.action === "error");

  if (humanMode) {
    console.log("\n  ⚡ SuperCLI Offboard\n");
    console.log(`  Target: ${targetDir}\n`);

    if (removed.length > 0) {
      console.log("  Removed:");
      removed.forEach((r) => console.log(`    ✓ ${r.harness}: ${r.path}`));
    }

    if (skipped.length > 0) {
      console.log("\n  Skipped:");
      skipped.forEach((r) => console.log(`    - ${r.harness}: ${r.reason}`));
    }

    if (errors.length > 0) {
      console.log("\n  Errors:");
      errors.forEach((r) => console.log(`    ✗ ${r.harness}: ${r.reason}`));
    }

    if (dryRun) {
      console.log("\n  (dry-run mode - no files removed)\n");
    } else {
      console.log("");
    }
  } else {
    output({
      mode: "offboard",
      target: targetDir,
      dry_run: dryRun,
      results,
      summary: {
        removed: removed.length,
        skipped: skipped.length,
        errors: errors.length,
      },
    });
  }
}

module.exports = {
  handleHarnessOnboard,
  handleHarnessOffboard,
  detectHarnesses,
  parseHarnesses,
};
