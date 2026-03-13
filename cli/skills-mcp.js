function buildMcpServersUsageSkillMarkdown(options = {}) {
  const {
    showDag = false,
    renderYamlObject,
    skillId = "mcp.servers.usage",
  } = options;
  const frontmatter = {
    skill_name: "mcp_servers_usage",
    description:
      "Teaches agents how to manage and use MCP servers through SuperCLI, including browser-use style SSE bridges.",
    command: `skills get ${skillId}`,
    arguments: [
      { name: "format", type: "string", required: false, description: "Output format, default skill.md" },
      { name: "show-dag", type: "boolean", required: false, description: "Include internal DAG for agent reasoning" },
    ],
    output_schema: { instruction: "string", examples: "array" },
    metadata: { side_effects: false, risk_level: "safe", dag_supported: true },
  };

  if (showDag) {
    frontmatter.dag = [
      { id: 1, type: "list_or_register_mcp_server" },
      { id: 2, type: "discover_tools", depends_on: [1] },
      { id: 3, type: "call_or_bind_tool", depends_on: [2] },
      { id: 4, type: "execute_bound_command", depends_on: [3] },
    ];
  }

  const body = [
    "# Instruction",
    "",
    "Use this workflow to manage and use MCP servers safely in non-interactive agent flows:",
    "",
    "1. List registered MCP servers and inspect current state:",
    "",
    "```bash",
    "supercli mcp list --json",
    "```",
    "",
    "2. Register or update an MCP server:",
    "",
    "```bash",
    "# HTTP MCP",
    "supercli mcp add summarize-local --url http://127.0.0.1:8787 --json",
    "",
    "# browser-use style stdio bridge over remote SSE via mcp-remote",
    "# Provide key at runtime; do not hardcode secrets in repository files",
    "supercli mcp add browser-use --command npx \\",
    "  --args-json '[\"mcp-remote\",\"https://api.browser-use.com/mcp\",\"--header\",\"X-Browser-Use-API-Key: ${BROWSER_USE_API_KEY}\"]' \\",
    "  --env-json '{\"BROWSER_USE_API_KEY\":\"${BROWSER_USE_API_KEY}\"}' \\",
    "  --json",
    "```",
    "",
    "3. Discover available tools from the configured MCP server:",
    "",
    "```bash",
    "supercli mcp tools --mcp-server browser-use --json",
    "```",
    "",
    "4. Call a discovered tool directly without creating a command first:",
    "",
    "```bash",
    "supercli mcp call --mcp-server browser-use --tool <tool_name> --input-json '{}' --timeout-ms 180000 --json",
    "```",
    "",
    "Reference example (browser-use task creation):",
    "",
    "```bash",
    "supercli mcp call --mcp-server browser-use --tool browser_task --input-json '{\"task\":\"Search Google for the latest iPhone reviews and summarize the top 3 results\"}' --timeout-ms 180000 --json",
    "```",
    "",
    "5. Optionally bind a tool as a stable SuperCLI command alias:",
    "",
    "```bash",
    "supercli mcp bind --mcp-server browser-use --tool <tool_name> --as ai.browser.probe --description \"Probe browser-use MCP\"",
    "supercli ai browser probe --json",
    "```",
    "",
    "6. Run diagnostics when tools cannot be discovered:",
    "",
    "```bash",
    "supercli mcp doctor --mcp-server browser-use --json",
    "```",
    "",
    "7. Remove stale MCP entries when no longer needed:",
    "",
    "```bash",
    "supercli mcp remove browser-use --json",
    "```",
    "",
    "# Notes",
    "",
    "- Prefer passing secrets via runtime environment variables and CLI args, not committed files.",
    "- If your MCP args/env contain ${ENV_VAR} placeholders, export them before running mcp tools/call/doctor.",
    "- For named MCP servers, command-level adapter settings override server-level defaults on conflicts.",
    "- Use `supercli skills teach --format skill.md` for general capability and skill-document discovery guidance.",
  ];

  return `---\n${renderYamlObject(frontmatter)}\n---\n\n${body.join("\n")}`;
}

module.exports = { buildMcpServersUsageSkillMarkdown };
