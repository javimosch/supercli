const {
  installPlugin,
  removePlugin,
  getPlugin,
  listInstalledPlugins,
  getPluginInstallGuidance,
  doctorPlugin,
  doctorAllPlugins
} = require("./plugins-manager")
const { listRegistryPlugins } = require("./plugins-registry")
const { loadConfig } = require("./config")
const { getPluginLearn } = require("./plugins-learn")
const { updatePlugins } = require("./plugins-update")

async function handlePluginsCommand(options) {
  const { positional, humanMode, output, outputHumanTable, outputError } = options
  const flags = options.flags || {}
  const subcommand = positional[1]

  // If unknown subcommand, fall through to help display

  function parseBooleanFlag(name, value) {
    if (value === undefined) return null
    const raw = String(value).trim().toLowerCase()
    if (raw === "true") return true
    if (raw === "false") return false
    outputError({
      code: 85,
      type: "invalid_argument",
      message: `Invalid --${name}. Use true or false`,
      recoverable: false
    })
    return null
  }

  if (subcommand === "list") {
    const plugins = listInstalledPlugins().map(p => ({
      name: p.name,
      version: p.version,
      commands: (p.commands || []).length,
      description: p.description || ""
    }))
    if (humanMode) {
      console.log("\n  ⚡ Plugins\n")
      outputHumanTable(plugins, [
        { key: "name", label: "Name" },
        { key: "version", label: "Version" },
        { key: "commands", label: "Commands" },
        { key: "description", label: "Description" }
      ])
      console.log("")
    } else {
      output({ plugins })
    }
    return true
  }

  if (subcommand === "install") {
    const ref = positional[2]
    const gitRepo = flags.git
    const manifestPath = flags["manifest-path"]
    const gitRef = flags.ref

    if (!ref && !gitRepo) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Usage: dcli plugins install <name|path> [--on-conflict fail|skip|replace] OR dcli plugins install --git <repo> --manifest-path <path> [--ref <ref>]",
        recoverable: false
      })
      return true
    }
    const config = await loadConfig()
    const result = installPlugin(ref || "(git)", {
      onConflict: flags["on-conflict"] || "fail",
      currentCommands: config.commands || [],
      git: gitRepo,
      manifestPath,
      ref: gitRef
    })
    const guidance = getPluginInstallGuidance(result.plugin)
    output({ ok: true, ...result, install_guidance: guidance })
    return true
  }

  if (subcommand === "explore") {
    const tags = String(flags.tags || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)
    const name = flags.name ? String(flags.name).trim() : ""
    const nameOnly = flags["name-only"] === true
    const hasLearnFilter = parseBooleanFlag("has-learn", flags["has-learn"])
    if (flags["has-learn"] !== undefined && hasLearnFilter === null) return true

    const installedFilter = parseBooleanFlag("installed", flags.installed)
    if (flags.installed !== undefined && installedFilter === null) return true

    const sourceFilter = flags.source ? String(flags.source).trim().toLowerCase() : null
    if (sourceFilter && !["bundled", "git"].includes(sourceFilter)) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Invalid --source. Use bundled or git",
        recoverable: false
      })
      return true
    }

    const limitExplicit = flags.limit !== undefined
    const limit = limitExplicit ? Number(flags.limit) : (humanMode ? null : 50)
    if (limitExplicit && (!Number.isFinite(limit) || limit <= 0 || !Number.isInteger(limit))) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Invalid --limit. Use a positive integer",
        recoverable: false
      })
      return true
    }

    const installedSet = new Set(listInstalledPlugins().map(p => p.name))
    const hadFilters = !!(name || tags.length || hasLearnFilter !== null || installedFilter !== null || sourceFilter)

    let plugins = listRegistryPlugins({ name, nameOnly, tags }).map(p => ({
      name: p.name,
      description: p.description,
      tags: p.tags,
      has_learn: p.has_learn === true,
      installed: installedSet.has(p.name),
      source_type: (p.source && p.source.type) || "bundled",
      source_repo: p.source && p.source.repo ? p.source.repo : ""
    }))

    if (hasLearnFilter !== null) {
      plugins = plugins.filter(p => p.has_learn === hasLearnFilter)
    }
    if (installedFilter !== null) {
      plugins = plugins.filter(p => p.installed === installedFilter)
    }
    if (sourceFilter) {
      plugins = plugins.filter(p => p.source_type === sourceFilter)
    }

    const total = plugins.length
    if (limit !== null) plugins = plugins.slice(0, limit)

    const suggestions = total === 0 && hadFilters
      ? [
          "Try a broader search term or remove some filters",
          'Use --tags to narrow by category instead',
          'Try: sc commands --query <keyword> --json'
        ]
      : []

    if (humanMode) {
      console.log("\n  ⚡ Plugin Registry\n")
      outputHumanTable(plugins, [
        { key: "name", label: "Name" },
        { key: "installed", label: "Installed" },
        { key: "has_learn", label: "Learn" },
        { key: "source_type", label: "Source" },
        { key: "tags", label: "Tags" },
        { key: "description", label: "Description" }
      ])
      if (suggestions.length > 0) {
        console.log("  💡 No plugins matched your filters.")
        suggestions.forEach(s => console.log("     " + s))
      }
      console.log("")
    } else {
      output({
        plugins,
        total,
        returned: plugins.length,
        filters: {
          name: name || null,
          tags,
          has_learn: hasLearnFilter,
          installed: installedFilter,
          source: sourceFilter,
          limit: limit === null ? null : limit
        },
        ...(suggestions.length > 0 ? { suggestions } : {})
      })
    }
    return true
  }

  if (subcommand === "remove") {
    const name = positional[2]
    if (!name) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli plugins remove <name>", recoverable: false })
      return true
    }
    const force = !!flags.force
    output({ ok: true, removed: removePlugin(name, force) })
    return true
  }

  if (subcommand === "show") {
    const name = positional[2]
    if (!name) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli plugins show <name>", recoverable: false })
      return true
    }
    const plugin = getPlugin(name)
    if (!plugin) {
      outputError({ code: 92, type: "resource_not_found", message: `Plugin '${name}' is not installed`, suggestions: ["Run: dcli plugins list"] })
      return true
    }
    output({ plugin, install_guidance: getPluginInstallGuidance(name) })
    return true
  }

  if (subcommand === "doctor") {
    const name = positional[2]
    const report = name ? doctorPlugin(name) : doctorAllPlugins()
    output(report)
    return true
  }

  if (subcommand === "learn") {
    const name = positional[2]
    if (!name) {
      outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli plugins learn <name>", recoverable: false })
      return true
    }
    const info = getPluginLearn(name)
    if (humanMode) {
      console.log(info.learn_markdown)
    } else {
      output(info)
    }
    return true
  }

  if (subcommand === "update") {
    const checkOnly = flags.check === true || flags.check === "true"
    const force = flags.force === true || flags.force === "true"
    try {
      const result = await updatePlugins({ check: checkOnly, force })
      if (humanMode) {
        if (result.up_to_date) {
          console.log("\n  ✓ Plugins already up to date\n")
        } else if (checkOnly) {
          console.log(`\n  Plugin update available: ${result.added} new, ${result.changed} changed\n`)
          if (result.updated.length > 0) {
            console.log("  Would update: " + result.updated.slice(0, 10).join(", ") + (result.updated.length > 10 ? ` ... (+${result.updated.length - 10} more)` : ""))
          }
          console.log("\n  Run: sc plugins update  (without --check) to apply\n")
        } else {
          console.log(`\n  ✓ Updated ${result.extracted} plugins (${result.added} new, ${result.changed} changed)\n`)
        }
      } else {
        output({ ok: true, ...result })
      }
    } catch (err) {
      outputError({ code: err.code || 105, type: err.type || "integration_error", message: err.message, recoverable: err.recoverable !== false, suggestions: err.suggestions })
    }
    return true
  }

  if (humanMode) {
    console.log("\n  ⚡ Plugins — available subcommands:\n")
    const rows = [
      { cmd: "list", desc: "List installed plugins" },
      { cmd: "explore", desc: "Browse plugin registry (--name, --tags, --limit)" },
      { cmd: "install <name|path>", desc: "Install a plugin" },
      { cmd: "install --git <repo>", desc: "Install from git repository" },
      { cmd: "remove <name>", desc: "Remove a plugin" },
      { cmd: "show <name>", desc: "Show plugin details" },
      { cmd: "doctor [name]", desc: "Check plugin health" },
      { cmd: "learn <name>", desc: "View plugin documentation" },
      { cmd: "update", desc: "Check/apply plugin updates" },
    ]
    outputHumanTable(rows, [
      { key: "cmd", label: "Command" },
      { key: "desc", label: "Purpose" },
    ])
    console.log("")
  } else {
    output({
      subcommands: [
        { name: "list", description: "List installed plugins" },
        { name: "explore", description: "Browse plugin registry (--name, --tags, --limit)" },
        { name: "install", description: "Install a plugin (name/path or --git <repo>)" },
        { name: "remove", description: "Remove a plugin" },
        { name: "show", description: "Show plugin details" },
        { name: "doctor", description: "Check plugin health" },
        { name: "learn", description: "View plugin documentation" },
        { name: "update", description: "Check/apply plugin updates" },
      ],
      usage: "sc plugins <subcommand> [--flags]"
    })
  }
  return true
}

module.exports = { handlePluginsCommand }
