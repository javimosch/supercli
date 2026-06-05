"use strict";

function displayJsonHelp() {
  return {
    name: "SuperCLI",
    description: "Universal Capability Router for AI Agents",
    repository: "https://github.com/javimosch/supercli",
    quick_overview: [
      "Capabilities: namespace.resource.action commands",
      "Plugin System: Install external CLIs as harnesses",
      "MCP Support: Model Context Protocol server integration",
      "Skill Docs: Agent-facing guidance in SKILL.md format",
      "AI Integration: Natural language query execution",
    ],
    getting_started: [
      "supercli help                  # List available harnesses",
      "supercli skills teach          # Learn about skill documents",
      "supercli plugins explore       # Browse available plugins",
      'supercli discover --intent "<task>"  # Find capabilities for a task',
    ],
    core_commands: [
      "supercli <namespace> <resource> <action>  # Execute capability",
      "supercli inspect <ns> <res> <act>       # View command details",
      "supercli plan <ns> <res> <act>          # Create execution plan",
      "supercli execute <plan_id>              # Run stored plan",
      'supercli ask "<query>"                  # LLM-powered suggestions (no execution)',
    ],
    plugin_management: [
      "supercli plugins list           # Show installed plugins",
      "supercli plugins install <name> # Install a plugin",
      "supercli plugins explore        # Browse plugin registry",
    ],
    harness_onboarding: [
      "supercli onboard                # Auto-detect and install skill",
      "supercli onboard --detect       # List detected harnesses",
      "supercli onboard --harness claude,cursor,opencode,windsurf",
      "supercli offboard              # Remove installed skill",
    ],
    documentation: [
      "Full README: https://github.com/javimosch/supercli#readme",
      "Supported Harnesses: docs/plugins-available.md",
      "Plugin Creation Guide: docs/plugins-how-to.md",
    ],
    output_modes: [
      "(default)   JSON output",
      "--json      Structured JSON envelope",
      "--human     Formatted tables and key-value output",
      "--compact   Compressed JSON (shortened keys)",
    ],
    exit_codes: [
      { code: 0, description: "success" },
      { code: 82, description: "validation_error" },
      { code: 85, description: "invalid_argument" },
      { code: 92, description: "resource_not_found" },
      { code: 105, description: "integration_error" },
      { code: 110, description: "internal_error" },
    ],
  };
}

function displayComprehensiveHelp() {
  console.log("\n  ⚡ SuperCLI - Universal Capability Router for AI Agents\n");
  console.log("  Repository: https://github.com/javimosch/supercli\n");
  console.log("  Discover and execute capabilities across CLIs, APIs, MCP servers, workflows, and custom automations through a single agent-friendly interface.\n");
  console.log("  📋 QUICK OVERVIEW:");
  console.log("    • Capabilities: namespace.resource.action commands");
  console.log("    • Plugin System: Install external CLIs as harnesses");
  console.log("    • MCP Support: Model Context Protocol server integration");
  console.log("    • Skill Docs: Agent-facing guidance in SKILL.md format");
  console.log("    • AI Integration: Natural language query execution\n");
  console.log("  🚀 GETTING STARTED:");
  console.log("    supercli help                  # List available harnesses");
  console.log("    supercli skills teach          # Learn about skill documents");
  console.log("    supercli plugins explore       # Browse available plugins");
  console.log('    supercli discover --intent "<task>"  # Find capabilities for a task\n');
  console.log("  🔧 CORE COMMANDS:");
  console.log("    supercli <namespace> <resource> <action>  # Execute capability");
  console.log("    supercli inspect <ns> <res> <act>       # View command details");
  console.log("    supercli plan <ns> <res> <act>          # Create execution plan");
  console.log("    supercli execute <plan_id>              # Run stored plan");
  console.log('    supercli ask "<query>"                  # LLM-powered suggestions (no execution)\n');
  console.log("  🧩 PLUGIN MANAGEMENT:");
  console.log("    supercli plugins list           # Show installed plugins");
  console.log("    supercli plugins install <name> # Install a plugin");
  console.log("    supercli plugins explore        # Browse plugin registry\n");
  console.log("  🤖 HARNESS ONBOARDING:");
  console.log("    supercli onboard                # Auto-detect and install skill");
  console.log("    supercli onboard --detect       # List detected harnesses");
  console.log("    supercli onboard --harness claude,cursor,opencode,windsurf");
  console.log("    supercli offboard              # Remove installed skill\n");
  console.log("  📖 DOCUMENTATION & RESOURCES:");
  console.log("    Full README: https://github.com/javimosch/supercli#readme");
  console.log("    Supported Harnesses: docs/plugins-available.md");
  console.log("    Plugin Creation Guide: docs/plugins-how-to.md\n");
  console.log("  🏷️  OUTPUT MODES:");
  console.log("    (default)   JSON output");
  console.log("    --json      Structured JSON envelope");
  console.log("    --human     Formatted tables and key-value output");
  console.log("    --compact   Compressed JSON (shortened keys)\n");
  console.log("  🐛 EXIT CODES:");
  console.log("    0  success");
  console.log("    82 validation_error");
  console.log("    85 invalid_argument");
  console.log("    92 resource_not_found");
  console.log("    105 integration_error");
  console.log("    110 internal_error\n");
}

function renderTopLevelHelp(config, { humanMode, output, hasServer }) {
  const namespaces = [...new Set(config.commands.map((c) => c.namespace))];
  if (humanMode) {
    console.log("\n  ⚡ SuperCLI\n");
    console.log("  Capability router that wraps external CLIs behind namespace.resource.action commands.\n");
    console.log("  Workflow: discover → learn → inspect → plan → execute\n");
    console.log("  Namespaces:\n");
    namespaces.forEach((ns) => {
      const resources = [...new Set(config.commands.filter((c) => c.namespace === ns).map((c) => c.resource))];
      console.log(`    ${ns}`);
      resources.forEach((r) => {
        const actions = config.commands.filter((c) => c.namespace === ns && c.resource === r).map((c) => c.action);
        console.log(`      └─ ${r}: ${actions.join(", ")}`);
      });
    });
    console.log("\n  Usage: supercli <namespace> <resource> <action> [--args]");
    if (hasServer) console.log("  Sync: supercli sync");
    console.log("  Plugins: supercli plugins explore | supercli plugins learn <name> | supercli plugins install <name|path>",
      "  Onboard: supercli onboard [--harness claude,opencode,cursor,windsurf] [--detect] | supercli offboard [--harness <harness>]");
    console.log('  Discover: supercli discover --intent "<task>" [--limit <n>] [--json]');
    console.log("  Flags: --help | --json | --human | --compact | --schema | --help-json | --server\n");
    return;
  }
  output({
    version: "1.0",
    namespaces: namespaces.map((ns) => ({
      name: ns,
      resources: [...new Set(config.commands.filter((c) => c.namespace === ns).map((c) => c.resource))].map((r) => ({
        name: r,
        actions: config.commands.filter((c) => c.namespace === ns && c.resource === r).map((c) => c.action),
      })),
    })),
  });
}

module.exports = { displayJsonHelp, displayComprehensiveHelp, renderTopLevelHelp };
