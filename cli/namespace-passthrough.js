"use strict";

function findNamespacePassthrough(config, positional, rawArgs) {
  const namespace = positional[0]
  if (!namespace || !config || !Array.isArray(config.commands)) return null

  const passthroughCommand = config.commands.find(c => (
    c.namespace === namespace &&
    c.adapterConfig &&
    c.adapterConfig.passthrough === true
  ))
  if (!passthroughCommand) return null

  const namespaceIndex = rawArgs.indexOf(namespace)
  const passthroughArgs = namespaceIndex >= 0 ? rawArgs.slice(namespaceIndex + 1) : []

  const maybeResource = passthroughArgs[0]
  const maybeAction = passthroughArgs[1]
  const hasExactCommand = (
    typeof maybeResource === "string" &&
    typeof maybeAction === "string" &&
    !maybeResource.startsWith("-") &&
    !maybeAction.startsWith("-") &&
    config.commands.some(c => (
      c.namespace === namespace &&
      c.resource === maybeResource &&
      c.action === maybeAction
    ))
  )

  if (hasExactCommand) return null

  return {
    namespace,
    command: passthroughCommand,
    passthroughArgs
  }
}

module.exports = { findNamespacePassthrough }
