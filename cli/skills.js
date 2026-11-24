"use strict"

const {
  listProviders,
  addProvider,
  removeProvider,
  getProvider,
  readIndex,
  syncCatalog,
  listCatalogSkills,
  searchCatalog,
  getCatalogSkill,
  getCatalogInfo,
  describeProviderTypes
} = require("./skills-catalog")
const {
  PLUGINS_USAGE_SKILL_ID,
  PLUGINS_AUTHORING_SKILL_ID,
  MCP_SERVERS_USAGE_SKILL_ID,
  normalizeSkillId,
  buildCommandSkillMarkdown,
  buildTeachSkillMarkdown,
  buildPluginsUsageSkillMarkdown,
  buildPluginsAuthoringSkillMarkdown,
  buildMcpServersUsageSkillMarkdown,
  listSkillsMetadata,
  renderYamlObject,
} = require("./skills-builders")

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
      const sourceRepo = flags.sourceRepo || flags["source-repo"] || ""
      const ref = flags.ref || "main"

      if (type === "remote_repo" || type === "remote_static") {
        if (!name || !sourceRepo) {
          outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills providers add --name <provider> --type remote_repo --source-repo <url> [--root <path>] [--ref <branch>]", recoverable: false })
          return true
        }
        const provider = addProvider({
          name,
          type,
          source_repo: sourceRepo,
          root: flags.root || "",
          ref,
          enabled: flags.enabled !== "false"
        })
        output({ ok: true, provider })
        return true
      }

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

    if (action === "describe") {
      const types = describeProviderTypes()
      if (humanMode && !flags.json) {
        console.log("\n  ⚡ Skill Provider Types\n")
        for (const t of types.provider_types) {
          console.log("  " + t.name + ":")
          console.log("    " + t.description)
          console.log("    Example:")
          console.log("      " + JSON.stringify(t.example, null, 6))
          console.log("")
        }
      } else {
        output(types)
      }
      return true
    }

    outputError({ code: 85, type: "invalid_argument", message: "Unknown providers subcommand. Use: list, add, remove, show, describe", recoverable: false })
    return true
  }

  if (subcommand === "catalog") {
    const action = positional[2]
    if (action === "info") {
      const info = getCatalogInfo()
      if (humanMode && !flags.json) {
        console.log("\n  ⚡ Skills Catalog Info\n")
        console.log("  Index:")
        console.log("    Version:", info.index.version)
        console.log("    Updated:", info.index.updated_at)
        console.log("    Total Skills:", info.index.total_skills)
        console.log("\n  Providers:")
        for (const p of info.providers) {
          console.log("    - " + p.name + " (" + p.type + "): " + p.skills_count + " skills [" + p.status + "]")
        }
        console.log("")
      } else {
        output({ catalog: info })
      }
      return true
    }
    outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills catalog info [--json]", recoverable: false })
    return true
  }

  if (subcommand === "sync") {
    const index = syncCatalog()
    output({ ok: true, updated_at: index.updated_at, providers: index.providers, skills: index.skills.length })
    return true
  }

  if (subcommand === "search") {
    const query = flags.query || positional.slice(2).join(" ")
    const tags = flags.tags ? String(flags.tags).split(",").map(t => t.trim()).filter(Boolean) : []
    if (!query && !tags.length) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli skills search --query <text> [--tags <tag1,tag2>] [--provider <provider>] [--limit <n>] [--offset <n>]", recoverable: false })
      return true
    }
    const limitExplicit = flags.limit !== undefined
    const limit = limitExplicit ? Number(flags.limit) : (humanMode ? null : 50)
    const limitAuto = !limitExplicit && !humanMode
    if (limitExplicit && (!Number.isFinite(limit) || limit <= 0 || !Number.isInteger(limit))) {
      outputError({ code: 85, type: "invalid_argument", message: "Invalid --limit. Use a positive integer", recoverable: false })
      return true
    }
    const offsetExplicit = flags.offset !== undefined
    const offset = offsetExplicit ? Number(flags.offset) : 0
    if (offsetExplicit && (!Number.isFinite(offset) || offset < 0 || !Number.isInteger(offset))) {
      outputError({ code: 85, type: "invalid_argument", message: "Invalid --offset. Use a non-negative integer", recoverable: false })
      return true
    }
    const allSkills = searchCatalog(query, { provider: flags.provider, tags })
    const total = allSkills.length
    const start = Math.min(offset, total)
    const end = limit !== null ? Math.min(start + limit, total) : total
    const returned = end - start
    const skills = allSkills.slice(start, end)
    if (limitAuto && returned < total) console.error("--limit 50 applied to avoid context bloat. Use --limit <n> and --offset <n> for full pagination.")
    output({ skills, total, returned, offset })
    return true
  }

  if (subcommand === "list") {
    const useCatalog = flags.catalog === true || flags.catalog === "true" || !!flags.provider
    if (flags["no-catalog"] || flags.catalog === false || flags.catalog === "false" || !useCatalog) {
      const skills = listSkillsMetadata(config)
      if (humanMode && !flags.json) {
        console.log("\n  ⚡ Skills (command-level only)\n")
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

    const limitExplicit = flags.limit !== undefined
    const limit = limitExplicit ? Number(flags.limit) : (humanMode ? null : 50)
    const limitAuto = !limitExplicit && !humanMode
    if (limitExplicit && (!Number.isFinite(limit) || limit <= 0 || !Number.isInteger(limit))) {
      outputError({ code: 85, type: "invalid_argument", message: "Invalid --limit. Use a positive integer", recoverable: false })
      return true
    }
    const offsetExplicit = flags.offset !== undefined
    const offset = offsetExplicit ? Number(flags.offset) : 0
    if (offsetExplicit && (!Number.isFinite(offset) || offset < 0 || !Number.isInteger(offset))) {
      outputError({ code: 85, type: "invalid_argument", message: "Invalid --offset. Use a non-negative integer", recoverable: false })
      return true
    }

    const allSkills = listCatalogSkills({ provider: flags.provider })
    const total = allSkills.length
    const start = Math.min(offset, total)
    const end = limit !== null ? Math.min(start + limit, total) : total
    const returned = end - start
    const skills = allSkills.slice(start, end)

    if (humanMode && !flags.json) {
      console.log("\n  ⚡ Skills\n")
      outputHumanTable(skills, [
        { key: "name", label: "Name" },
        { key: "description", label: "Description" }
      ])
      console.log(`  Returned: ${returned}/${total}  (offset: ${offset})\n`)
    } else {
      const index = readIndex() || {}
      if (limitAuto && returned < total) console.error("--limit 50 applied to avoid context bloat. Use --limit <n> and --offset <n> for full pagination.")
      output({ skills, total, returned, offset, index: { updated_at: index.updated_at || null } })
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

    if (parsed.id === PLUGINS_AUTHORING_SKILL_ID) {
      console.log(buildPluginsAuthoringSkillMarkdown({ showDag: !!flags["show-dag"] }))
      return true
    }

    if (parsed.id === MCP_SERVERS_USAGE_SKILL_ID) {
      console.log(buildMcpServersUsageSkillMarkdown({ showDag: !!flags["show-dag"] }))
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

  if (!subcommand) {
    if (humanMode) {
      console.log("\n  ⚡ SuperCLI Skills\n");
      console.log("  Skill documents provide agent-facing guidance in SKILL.md format.\n");
      console.log("  Subcommands:");
      console.log("    list           List available skills (--catalog, --limit, --offset)");
      console.log("    get <id>       Get skill documentation");
      console.log("    teach          Get the skills usage guide");
      console.log("    sync           Sync skills catalog");
      console.log("    search         Search skills catalog (--query, --tags, --provider, --limit, --offset)");
      console.log("    providers      Manage skill providers\n");
      console.log("  Usage:");
      console.log("    supercli skills list [--catalog] [--limit <n>] [--offset <n>]");
      console.log("    supercli skills get <namespace.resource.action>");
      console.log("    supercli skills teach");
      console.log("    supercli skills search --query <text> [--limit <n>] [--offset <n>]");
      console.log("    supercli skills sync");
      console.log("    supercli skills providers list\n");
    } else {
      output({
        version: "1.0",
        mode: "skills_help",
        description: "Skill documents provide agent-facing guidance in SKILL.md format",
        subcommands: {
          list: {
            description: "List available skills (command-level + catalog)",
            usage: "supercli skills list [--catalog] [--provider <name>] [--limit <n>] [--offset <n>]",
            examples: ["supercli skills list --json", "supercli skills list --catalog --json", "supercli skills list --catalog --limit 10 --json", "supercli skills list --catalog --limit 10 --offset 20 --json"]
          },
          get: {
            description: "Get skill documentation for a specific capability",
            usage: "supercli skills get <namespace.resource.action> [--show-dag]",
            examples: ["supercli skills get mmx.text.chat --json"]
          },
          teach: {
            description: "Get the skills usage guide (teaches how to use skills system)",
            usage: "supercli skills teach [--show-dag]",
            examples: ["supercli skills teach --json"]
          },
          sync: {
            description: "Sync skills catalog from providers",
            usage: "supercli skills sync",
            examples: ["supercli skills sync --json"]
          },
          search: {
            description: "Search skills catalog for matching skills",
            usage: "supercli skills search --query <text> [--tags <tag1,tag2>] [--provider <name>] [--limit <n>] [--offset <n>]",
            examples: ["supercli skills search --query email --json", "supercli skills search --tags skills --json", "supercli skills search --query email --tags docker --limit 10 --json", "supercli skills search --query email --limit 10 --offset 20 --json"]
          },
          providers: {
            description: "Manage skill providers (list, add, remove, show)",
            usage: "supercli skills providers <action> [--name <provider>] [--roots <paths>]",
            examples: ["supercli skills providers list --json", "supercli skills providers add --name myproj --roots ./docs/skills --json"]
          }
        }
      });
    }
    return true;
  }

  outputError({ code: 85, type: "invalid_argument", message: "Unknown skills subcommand. Use: list, get, teach, sync, search, providers", recoverable: false })
  return true
}


module.exports = {
  PLUGINS_USAGE_SKILL_ID,
  PLUGINS_AUTHORING_SKILL_ID,
  MCP_SERVERS_USAGE_SKILL_ID,
  normalizeSkillId,
  buildCommandSkillMarkdown,
  buildTeachSkillMarkdown,
  buildPluginsUsageSkillMarkdown,
  buildPluginsAuthoringSkillMarkdown,
  buildMcpServersUsageSkillMarkdown,
  listSkillsMetadata,
  handleSkillsCommand,
  renderYamlObject // Export for testing coverage
}
