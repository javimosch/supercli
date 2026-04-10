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
      mode: "detect",
      target: targetDir,
      detected,
      all_available: getAllHarnesses(),
    });
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
