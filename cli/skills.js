const { createPlan } = require("./planner")

const PLUGINS_USAGE_SKILL_ID = "plugins.registry.usage"
const {
  listProviders,
  addProvider,
  removeProvider,
  getProvider,
  readIndex,
  syncCatalog,
  listCatalogSkills,
  searchCatalog,
  getCatalogSkill
} = require("./skills-catalog")

function normalizeSkillId(input) {
  if (!input || typeof input !== "string") return null
  const parts = input.trim().split(".")
  if (parts.length !== 3 || parts.some(p => !p)) return null
  return {
    id: parts.join("."),
    namespace: parts[0],
    resource: parts[1],
    action: parts[2]
  }
}

function escapeYamlString(value) {
  const str = value == null ? "" : String(value)
  return `"${str.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")}"`
}

function toDagNodes(cmd) {
  const plan = createPlan(cmd, {})
  return plan.steps.map(step => {
    const node = {
      id: step.step,
      type: step.type
    }
    if (step.step > 1) node.depends_on = [step.step - 1]
    if (step.adapter) node.adapter = step.adapter
    if (step.method) node.method = step.method
    if (step.url) node.url = step.url
    if (step.operationId) node.operation_id = step.operationId
    if (step.tool) node.tool = step.tool
    return node
  })
}

function renderYamlObject(value, indent = 0) {
  const pad = " ".repeat(indent)
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]`
    return value
      .map(item => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const entries = Object.entries(item)
          if (entries.length === 0) return `${pad}- {}`
          const [firstKey, firstValue] = entries[0]
          let out = `${pad}- ${firstKey}: ${renderYamlScalar(firstValue)}`
          for (let i = 1; i < entries.length; i++) {
            out += `\n${pad}  ${entries[i][0]}: ${renderYamlScalar(entries[i][1])}`
          }
          return out
        }
        return `${pad}- ${renderYamlScalar(item)}`
      })
      .join("\n")
  }

  if (!value || typeof value !== "object") {
    return `${pad}${renderYamlScalar(value)}`
  }

  const lines = []
  for (const [key, val] of Object.entries(value)) {
    if (Array.isArray(val) || (val && typeof val === "object")) {
      lines.push(`${pad}${key}:`)
      lines.push(renderYamlObject(val, indent + 2))
    } else {
      lines.push(`${pad}${key}: ${renderYamlScalar(val)}`)
    }
  }
  return lines.join("\n")
}

function renderYamlScalar(value) {
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "number") return String(value)
  if (value == null) return "null"
  return escapeYamlString(value)
}

function buildCommandSkillMarkdown(cmd, options = {}) {
  const includeDag = !!options.showDag
  const argLines = (cmd.args || []).map(arg => ({
    name: arg.name,
    type: arg.type || "string",
    required: !!arg.required,
    description: arg.description || ""
  }))

  const frontmatter = {
    skill_name: `${cmd.namespace}_${cmd.resource}_${cmd.action}`,
    description: cmd.description || `Execute ${cmd.namespace}.${cmd.resource}.${cmd.action}`,
    command: `${cmd.namespace} ${cmd.resource} ${cmd.action}`,
    arguments: argLines,
    output_schema: cmd.output || { type: "object" },
    metadata: {
      side_effects: !!cmd.mutation,
      risk_level: cmd.risk_level || "safe",
      dag_supported: true
    }
  }

  if (includeDag) {
    frontmatter.dag = toDagNodes(cmd)
  }

  const exampleArgs = (cmd.args || [])
    .map(arg => {
      if (arg.required) return `--${arg.name} <${arg.name}>`
      return `--${arg.name} <${arg.name}>`
    })
    .join(" ")
    .trim()

  const examples = [
    `supercli ${cmd.namespace} ${cmd.resource} ${cmd.action}${exampleArgs ? ` ${exampleArgs}` : ""} --json`
  ]

  if (includeDag) {
    examples.push(`supercli skills get ${cmd.namespace}.${cmd.resource}.${cmd.action} --show-dag`)
  }

  return `---\n${renderYamlObject(frontmatter)}\n---\n\n# Examples\n\n\`\`\`bash\n${examples.join("\n")}\n\`\`\``
}

function buildTeachSkillMarkdown(options = {}) {
  const includeDag = !!options.showDag

  const frontmatter = {
    skill_name: "teach_skills_usage",
    description: "Introduces LLMs to SuperCLI skills commands and explains how to request and execute skills.",
    command: "skills teach",
    arguments: [
      {
        name: "format",
        type: "string",
        required: false,
        description: "Output format, default skill.md"
      },
      {
        name: "show-dag",
        type: "boolean",
        required: false,
        description: "Include internal DAG for agent reasoning"
      }
    ],
    output_schema: {
      instruction: "string",
      examples: "array"
    },
    metadata: {
      side_effects: false,
      risk_level: "safe",
      dag_supported: true
    }
  }

  if (includeDag) {
    frontmatter.dag = [
      { id: 1, type: "resolve_skills_catalog" },
      { id: 2, type: "render_meta_skill", depends_on: [1] },
      { id: 3, type: "emit_skill_markdown", depends_on: [2] }
    ]
  }

  return `---\n${renderYamlObject(frontmatter)}\n---\n\n# Instruction\n\nThis skill teaches LLMs how to discover and use SuperCLI skills:\n\n1. List available skills:\n\n\`\`\`bash\nsupercli skills list --json\n\`\`\`\n\n2. Fetch a specific skill:\n\n\`\`\`bash\nsupercli skills get <namespace.resource.action> --format skill.md\n\`\`\`\n\n3. Parse YAML frontmatter to understand command, arguments, output schema, and metadata.\n\n4. Execute the command with validated arguments:\n\n\`\`\`bash\nsupercli <namespace> <resource> <action> --arg value --json\n\`\`\`\n\n5. For plugin discovery and remote plugin installs, use:\n\n\`\`\`bash\nsupercli skills get ${PLUGINS_USAGE_SKILL_ID} --format skill.md\n\`\`\`\n\n# Examples\n\n\`\`\`bash\nsupercli skills teach --format skill.md\nsupercli skills teach --format skill.md --show-dag\n\`\`\``
}

function buildPluginsUsageSkillMarkdown(options = {}) {
  const includeDag = !!options.showDag
  const frontmatter = {
    skill_name: "plugins_registry_usage",
    description: "Explains plugin discovery from plugins/plugins.json and local/remote plugin installation flows.",
    command: `skills get ${PLUGINS_USAGE_SKILL_ID}`,
    arguments: [
      {
        name: "format",
        type: "string",
        required: false,
        description: "Output format, default skill.md"
      },
      {
        name: "show-dag",
        type: "boolean",
        required: false,
        description: "Include internal DAG for agent reasoning"
      }
    ],
    output_schema: {
      instruction: "string",
      examples: "array"
    },
    metadata: {
      side_effects: false,
      risk_level: "safe",
      dag_supported: true
    }
  }

  if (includeDag) {
    frontmatter.dag = [
      { id: 1, type: "load_plugin_registry" },
      { id: 2, type: "resolve_install_method", depends_on: [1] },
      { id: 3, type: "emit_plugin_usage_instructions", depends_on: [2] }
    ]
  }

  return `---\n${renderYamlObject(frontmatter)}\n---\n\n# Instruction\n\nUse this workflow for plugin discovery and installation:\n\n1. Explore registry metadata (name/description/tags):\n\n\`\`\`bash\nsupercli plugins explore --json\nsupercli plugins explore --name commiat --json\nsupercli plugins explore --tags git,ai --json\n\`\`\`\n\n2. Install by registry name:\n\n\`\`\`bash\nsupercli plugins install commiat --json\n\`\`\`\n\n3. Install directly from a remote git repository:\n\n\`\`\`bash\nsupercli plugins install --git https://github.com/org/repo.git --manifest-path plugins/supercli/plugin.json --ref main --json\n\`\`\`\n\n4. Validate installed plugin health and guidance:\n\n\`\`\`bash\nsupercli plugins doctor commiat --json\nsupercli plugins show commiat --json\n\`\`\`\n\n5. Use the namespace command exposed by the plugin.\n\n# Examples\n\n\`\`\`bash\nsupercli skills get ${PLUGINS_USAGE_SKILL_ID} --format skill.md\nsupercli skills get ${PLUGINS_USAGE_SKILL_ID} --format skill.md --show-dag\n\`\`\``
}

function listSkillsMetadata(config) {
  const commandSkills = (config.commands || []).map(cmd => ({
    name: `${cmd.namespace}.${cmd.resource}.${cmd.action}`,
    description: cmd.description || ""
  }))
  commandSkills.push({
    name: PLUGINS_USAGE_SKILL_ID,
    description: "Discover and install plugins from the registry or remote git repos"
  })
  return commandSkills
}

function handleSkillsCommand(options) {
  const { positional, flags, config, humanMode, output, outputHumanTable, outputError } = options
  const subcommand = positional[1]
  const format = flags.format || "skill.md"

  if (subcommand === "providers") {
    const action = positional[2]
    if (action === "list") {
      const providers = listProviders()
      if (humanMode && !flags.json) {
        console.log("\n  ⚡ Skill Providers\n")
        outputHumanTable(providers, [
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "enabled", label: "Enabled" }
        ])
        console.log("")
      } else {
        output({ providers })
      }
      return true
    }

    if (action === "add") {
      const name = flags.name || positional[3]
      const type = flags.type || "local_fs"
      const rootsRaw = flags.roots || flags.root
      if (!name || !rootsRaw) {
        outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills providers add --name <provider> --roots <path1,path2> [--type local_fs|repo_fs]", recoverable: false })
        return true
      }
      const roots = String(rootsRaw).split(",").map(r => r.trim()).filter(Boolean)
      const provider = addProvider({ name, type, roots, enabled: flags.enabled !== "false" })
      output({ ok: true, provider })
      return true
    }

    if (action === "remove") {
      const name = flags.name || positional[3]
      if (!name) {
        outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills providers remove --name <provider>", recoverable: false })
        return true
      }
      output({ ok: true, removed: removeProvider(name) })
      return true
    }

    if (action === "show") {
      const name = flags.name || positional[3]
      if (!name) {
        outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills providers show --name <provider>", recoverable: false })
        return true
      }
      const provider = getProvider(name)
      if (!provider) {
        outputError({ code: 92, type: "resource_not_found", message: `Provider '${name}' not found`, suggestions: ["Run: supercli skills providers list"] })
        return true
      }
      output({ provider })
      return true
    }

    outputError({ code: 85, type: "invalid_argument", message: "Unknown providers subcommand. Use: list, add, remove, show", recoverable: false })
    return true
  }

  if (subcommand === "sync") {
    const index = syncCatalog()
    output({ ok: true, updated_at: index.updated_at, providers: index.providers, skills: index.skills.length })
    return true
  }

  if (subcommand === "search") {
    const query = flags.query || positional.slice(2).join(" ")
    if (!query) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills search --query <text> [--provider <provider>]", recoverable: false })
      return true
    }
    const skills = searchCatalog(query, { provider: flags.provider })
    output({ skills })
    return true
  }

  if (subcommand === "list") {
    if (flags.catalog === true || flags.catalog === "true") {
      const skills = listCatalogSkills({ provider: flags.provider })
      output({ skills, index: { updated_at: readIndex().updated_at } })
      return true
    }

    const skills = listSkillsMetadata(config)
    if (humanMode && !flags.json) {
      console.log("\n  ⚡ Skills\n")
      outputHumanTable(skills, [
        { key: "name", label: "Name" },
        { key: "description", label: "Description" }
      ])
      console.log("")
    } else {
      output({ skills })
    }
    return true
  }

  if (subcommand === "teach") {
    if (format !== "skill.md") {
      outputError({ code: 85, type: "invalid_argument", message: "skills teach supports only --format skill.md", recoverable: false })
      return true
    }
    console.log(buildTeachSkillMarkdown({ showDag: !!flags["show-dag"] }))
    return true
  }

  if (subcommand === "get") {
    if (format !== "skill.md") {
      outputError({ code: 85, type: "invalid_argument", message: "skills get supports only --format skill.md", recoverable: false })
      return true
    }

    const skillId = positional[2] || ""
    if (skillId.includes(":")) {
      const skill = getCatalogSkill(skillId)
      if (!skill) {
        outputError({ code: 92, type: "resource_not_found", message: `Skill ${skillId} not found in local catalog`, suggestions: ["Run: supercli skills sync", "Run: supercli skills list --catalog --json"] })
        return true
      }
      console.log(skill.markdown)
      return true
    }

    const dottedId = positional[2] || (positional[3] && positional[4] ? `${positional[2]}.${positional[3]}.${positional[4]}` : "")
    const parsed = normalizeSkillId(dottedId)
    if (!parsed) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills get <namespace.resource.action> [--format skill.md]", recoverable: false })
      return true
    }

    if (parsed.id === PLUGINS_USAGE_SKILL_ID) {
      console.log(buildPluginsUsageSkillMarkdown({ showDag: !!flags["show-dag"] }))
      return true
    }

    const cmd = config.commands.find(c =>
      c.namespace === parsed.namespace && c.resource === parsed.resource && c.action === parsed.action
    )
    if (!cmd) {
      outputError({ code: 92, type: "resource_not_found", message: `Skill ${parsed.id} not found`, suggestions: ["Run: supercli skills list --json"] })
      return true
    }

    console.log(buildCommandSkillMarkdown(cmd, { showDag: !!flags["show-dag"] }))
    return true
  }

  outputError({ code: 85, type: "invalid_argument", message: "Unknown skills subcommand. Use: list, get, teach, sync, search, providers", recoverable: false })
  return true
}

module.exports = {
  PLUGINS_USAGE_SKILL_ID,
  normalizeSkillId,
  buildCommandSkillMarkdown,
  buildTeachSkillMarkdown,
  buildPluginsUsageSkillMarkdown,
  listSkillsMetadata,
  handleSkillsCommand
}
