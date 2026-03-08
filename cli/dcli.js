#!/usr/bin/env node

const { loadConfig, refreshConfig, showConfig } = require("./config")
const { execute } = require("./executor")

const SERVER = process.env.DCLI_SERVER || "http://localhost:3000"
const isTTY = process.stdout.isTTY
const args = process.argv.slice(2)

// Parse flags
const flags = {}
const positional = []
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].slice(2)
    if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      flags[key] = args[++i]
    } else {
      flags[key] = true
    }
  } else {
    positional.push(args[i])
  }
}

const humanMode = flags.human || (isTTY && !flags.json)

function output(data) {
  if (humanMode) {
    if (typeof data === "string") {
      console.log(data)
    } else {
      console.log(JSON.stringify(data, null, 2))
    }
  } else {
    console.log(JSON.stringify(data))
  }
}

function outputError(error) {
  const envelope = {
    error: {
      code: error.code || 110,
      type: error.type || "internal_error",
      message: error.message,
      recoverable: error.recoverable || false,
      suggestions: error.suggestions || []
    }
  }
  if (humanMode) {
    console.error(`${envelope.error.type}: ${envelope.error.message}`)
    if (envelope.error.suggestions.length) {
      envelope.error.suggestions.forEach(s => console.error(`  → ${s}`))
    }
  } else {
    console.log(JSON.stringify(envelope))
  }
  process.exit(envelope.error.code)
}

async function main() {
  try {
    // No args — show help
    if (positional.length === 0 || positional[0] === "help") {
      const config = await loadConfig(SERVER)
      const namespaces = [...new Set(config.commands.map(c => c.namespace))]
      if (flags.json || !humanMode) {
        output({
          version: "1.0",
          namespaces: namespaces.map(ns => ({
            name: ns,
            resources: [...new Set(config.commands.filter(c => c.namespace === ns).map(c => c.resource))]
              .map(r => ({
                name: r,
                actions: config.commands.filter(c => c.namespace === ns && c.resource === r).map(c => c.action)
              }))
          }))
        })
      } else {
        console.log("\n  ⚡ DCLI — Dynamic CLI\n")
        console.log("  Namespaces:\n")
        namespaces.forEach(ns => console.log(`    ${ns}`))
        console.log("\n  Usage: dcli <namespace> <resource> <action> [--args]\n")
      }
      return
    }

    // Built-in: config
    if (positional[0] === "config") {
      if (positional[1] === "refresh") {
        await refreshConfig(SERVER)
        output({ ok: true, message: "Config refreshed" })
        return
      }
      if (positional[1] === "show") {
        const info = await showConfig()
        output(info)
        return
      }
      outputError({ code: 85, type: "invalid_argument", message: "Unknown config subcommand. Use: refresh, show", recoverable: false })
      return
    }

    // Built-in: commands — list all
    if (positional[0] === "commands") {
      const config = await loadConfig(SERVER)
      output({
        version: "1.0",
        commands: config.commands.map(c => ({
          command: `${c.namespace} ${c.resource} ${c.action}`,
          description: c.description,
          adapter: c.adapter,
          args: c.args
        }))
      })
      return
    }

    // Built-in: inspect <ns> <res> <act>
    if (positional[0] === "inspect") {
      if (positional.length < 4) {
        outputError({ code: 85, type: "invalid_argument", message: "Usage: dcli inspect <namespace> <resource> <action>", recoverable: false })
        return
      }
      const config = await loadConfig(SERVER)
      const cmd = config.commands.find(c =>
        c.namespace === positional[1] && c.resource === positional[2] && c.action === positional[3]
      )
      if (!cmd) {
        outputError({
          code: 92, type: "resource_not_found",
          message: `Command ${positional[1]}.${positional[2]}.${positional[3]} not found`,
          suggestions: ["Run: dcli commands"]
        })
        return
      }
      output({
        version: "1.0",
        command: `${cmd.namespace}.${cmd.resource}.${cmd.action}`,
        description: cmd.description,
        adapter: cmd.adapter,
        adapterConfig: cmd.adapterConfig,
        args: cmd.args
      })
      return
    }

    // 1 positional = namespace listing
    if (positional.length === 1) {
      const config = await loadConfig(SERVER)
      const resources = [...new Set(config.commands.filter(c => c.namespace === positional[0]).map(c => c.resource))]
      if (resources.length === 0) {
        outputError({
          code: 92, type: "resource_not_found",
          message: `Namespace '${positional[0]}' not found`,
          suggestions: ["Run: dcli help"]
        })
        return
      }
      output({ namespace: positional[0], resources })
      return
    }

    // 2 positional = action listing
    if (positional.length === 2) {
      const config = await loadConfig(SERVER)
      const actions = config.commands
        .filter(c => c.namespace === positional[0] && c.resource === positional[1])
        .map(c => c.action)
      if (actions.length === 0) {
        outputError({
          code: 92, type: "resource_not_found",
          message: `Resource '${positional[0]}.${positional[1]}' not found`,
          suggestions: [`Run: dcli ${positional[0]}`]
        })
        return
      }
      output({ namespace: positional[0], resource: positional[1], actions })
      return
    }

    // 3+ positional = execute command
    const [namespace, resource, action] = positional
    const config = await loadConfig(SERVER)
    const cmd = config.commands.find(c =>
      c.namespace === namespace && c.resource === resource && c.action === action
    )
    if (!cmd) {
      outputError({
        code: 92, type: "resource_not_found",
        message: `Command ${namespace}.${resource}.${action} not found`,
        suggestions: ["Run: dcli commands", `Run: dcli ${namespace} ${resource}`]
      })
      return
    }

    // Validate required args
    const missingArgs = (cmd.args || []).filter(a => a.required && !flags[a.name])
    if (missingArgs.length > 0) {
      outputError({
        code: 82, type: "validation_error",
        message: `Missing required arguments: ${missingArgs.map(a => "--" + a.name).join(", ")}`,
        suggestions: [`Run: dcli inspect ${namespace} ${resource} ${action}`]
      })
      return
    }

    const start = Date.now()
    const result = await execute(cmd, flags, { server: SERVER })
    const duration = Date.now() - start

    output({
      version: "1.0",
      command: `${namespace}.${resource}.${action}`,
      duration_ms: duration,
      data: result
    })

  } catch (err) {
    outputError({ code: 110, type: "internal_error", message: err.message })
  }
}

main()
