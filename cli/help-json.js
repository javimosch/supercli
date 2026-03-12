function buildCapabilities(config, hasServer) {
  const commands = {
    help: { description: "List namespaces and commands" },
    discover: { description: "Deterministic intent-to-plugin discovery", usage: "supercli discover --intent \"<task>\" [--limit <n>]" },
    config: { subcommands: ["show"] },
    plugins: { subcommands: ["list", "explore", "learn", "install", "remove", "show", "doctor"], description: "Manage local and remote command plugins" },
    mcp: { subcommands: ["list", "add", "tools", "call", "bind", "doctor", "remove"], description: "Manage local MCP server registry and invoke MCP tools" },
    commands: { description: "List all commands" },
    inspect: { description: "Inspect command details", usage: "supercli inspect <ns> <res> <act>" },
    plan: { description: "Create execution plan", usage: "supercli plan <ns> <res> <act> [--args]" },
    execute: { description: "Execute a stored plan", usage: "supercli execute <plan_id>" },
    skills: {
      description: "Skill discovery and SKILL.md generation",
      subcommands: ["list", "get", "teach", "sync", "search", "providers"]
    }
  }
  if (hasServer) commands.sync = { description: "Sync local config from SUPERCLI_SERVER" }
  if (config.features?.ask || process.env.OPENAI_BASE_URL) commands.ask = { description: "Execute natural language queries", usage: "supercli ask \"<query>\"" }

  return {
    version: "1.0",
    name: "supercli",
    description: "Config-driven, AI-friendly dynamic CLI",
    what_is_supercli: "A deterministic command router that exposes namespace.resource.action commands, plugin-installed capabilities, and MCP tool bindings.",
    agent_onboarding: {
      discovery_sequence: [
        "supercli --json",
        "supercli --help-json",
        "supercli discover --intent \"<task>\" --json",
        "supercli plugins learn <name> --json",
        "supercli plugins install <name>",
        "supercli commands --query <keyword> --limit 50 --json",
        "supercli inspect <namespace> <resource> <action> --json"
      ],
      fallback_rule: "If a command is not found, use discover/plugins explore/plugins learn before retrying.",
      no_llm_discovery: true
    },
    commands,
    namespaces: [...new Set((config.commands || []).map(c => c.namespace))],
    total_commands: (config.commands || []).length,
    output_formats: ["json", "human", "compact"],
    flags: {
      "--json": "Force JSON output",
      "--human": "Force human-readable output",
      "--compact": "Compressed JSON for token optimization",
      "--schema": "Show input/output schema for a command",
      "--help-json": "Machine-readable capability discovery",
      "--show-dag": "Include execution DAG in output",
      "--format": "Output format for selected commands"
    },
    exit_codes: {
      "0": "success",
      "91": "safety_violation",
      "82": "validation_error",
      "85": "invalid_argument",
      "92": "resource_not_found",
      "105": "integration_error",
      "110": "internal_error"
    }
  }
}

module.exports = { buildCapabilities }
