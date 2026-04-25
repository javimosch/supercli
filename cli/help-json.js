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
      description: "Capability docs and SKILL.md catalog workflows",
      subcommands: ["list", "get", "teach", "sync", "search", "providers"]
    }
  }
  if (hasServer) commands.sync = { description: "Sync local config from SUPERCLI_SERVER" }
  if (config.features?.ask || process.env.OPENAI_BASE_URL) commands.ask = { description: "Execute natural language queries", usage: "supercli ask \"<query>\"" }

  return {
    version: "1.0",
    name: "supercli",
    description: "Config-driven, AI-friendly dynamic CLI",
    what_is_supercli: "A deterministic capability router that exposes namespace.resource.action commands, plugin-installed capabilities, MCP tool bindings, and SKILL.md-based skill docs.",
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
    token_optimization: {
      context_mode: "Use supercli MCP context-mode when calling supercli CLI commands that produce verbose output (e.g., supercli commands, supercli plugins explore). SuperCLI has 350+ plugins, so command output can be large. Context-mode reduces token usage by up to 98% by indexing content instead of showing it in conversation.",
      when_to_use: ["supercli commands (350+ plugins)", "supercli plugins explore", "supercli commands --query <keyword>", "Any supercli command with large output", "Repeated searches across plugins"],
      quick_start: "sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '{\"commands\": [{\"label\": \"Commands\", \"command\": \"supercli commands --json\"}], \"queries\": [\"<search terms>\"]}' --json",
      learn_more: "supercli skills teach context-mode:quickstart"
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
