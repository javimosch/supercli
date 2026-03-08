function buildCapabilities(config, hasServer) {
  const commands = {
    help: { description: "List namespaces and commands" },
    config: { subcommands: ["show"] },
    mcp: { subcommands: ["list", "add", "remove"], description: "Manage local MCP server registry" },
    commands: { description: "List all commands" },
    inspect: { description: "Inspect command details", usage: "dcli inspect <ns> <res> <act>" },
    plan: { description: "Create execution plan", usage: "dcli plan <ns> <res> <act> [--args]" },
    execute: { description: "Execute a stored plan", usage: "dcli execute <plan_id>" },
    skills: {
      description: "Skill discovery and SKILL.md generation",
      subcommands: ["list", "get", "teach"]
    }
  }
  if (hasServer) commands.sync = { description: "Sync local config from DCLI_SERVER" }

  return {
    version: "1.0",
    name: "dcli",
    description: "Config-driven, AI-friendly dynamic CLI",
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
      "82": "validation_error",
      "85": "invalid_argument",
      "92": "resource_not_found",
      "105": "integration_error",
      "110": "internal_error"
    }
  }
}

module.exports = { buildCapabilities }
