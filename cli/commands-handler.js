"use strict";

function handleCommandsQuery(config, flags, { humanMode, output, outputError, outputHumanTable }) {
  try {
    const namespaceFilter = flags.namespace && typeof flags.namespace === 'string' ? flags.namespace.toLowerCase().trim() : "";
    const resourceFilter  = flags.resource  && typeof flags.resource  === 'string' ? flags.resource.toLowerCase().trim()  : "";
    const actionFilter    = flags.action    && typeof flags.action    === 'string' ? flags.action.toLowerCase().trim()    : "";
    const queryFilter     = flags.query     && typeof flags.query     === 'string' ? flags.query.toLowerCase().trim()     : "";

    const limitExplicit = flags.limit !== undefined;
    const limit = limitExplicit ? Number(flags.limit) : (humanMode ? null : 50);
    const limitAuto = !limitExplicit && !humanMode;
    const offsetExplicit = flags.offset !== undefined;
    const offset = offsetExplicit ? Number(flags.offset) : 0;

    if (!config || !config.commands) {
      outputError({ code: 110, type: "internal_error", message: "Invalid config: missing commands", recoverable: false });
      return;
    }
  if (limitExplicit && (!Number.isFinite(limit) || limit <= 0 || !Number.isInteger(limit))) {
    outputError({ code: 85, type: "invalid_argument", message: "Invalid --limit. Use a positive integer", recoverable: false });
    return;
  }
  if (offsetExplicit && (!Number.isFinite(offset) || offset < 0 || !Number.isInteger(offset))) {
    outputError({ code: 85, type: "invalid_argument", message: "Invalid --offset. Use a non-negative integer", recoverable: false });
    return;
  }

  let rows = config.commands.map((c) => ({
    command: `${c.namespace || '?'} ${c.resource || '?'} ${c.action || '?'}`,
    namespace: c.namespace, resource: c.resource, action: c.action,
    description: c.description || "", adapter: c.adapter,
    args: (c.args || []).map((a) => `--${a.name}${a.required ? "*" : ""}`).join(" "),
  }));

  rows = rows.filter((row) => {
    if (namespaceFilter && (row.namespace || '').toLowerCase() !== namespaceFilter) return false;
    if (resourceFilter  && (row.resource || '').toLowerCase()  !== resourceFilter)  return false;
    if (actionFilter    && (row.action || '').toLowerCase()    !== actionFilter)    return false;
    if (queryFilter) {
      const haystack = `${row.command} ${row.description || ''} ${row.adapter || ''} ${row.args || ''}`.toLowerCase();
      if (!haystack.includes(queryFilter)) return false;
    }
    return true;
  });

  const total = rows.length;
  const start = Math.min(offset, total);
  const end = limit !== null ? Math.min(start + limit, total) : total;
  const returned = end - start;
  if (limit !== null) rows = rows.slice(start, end);

  if (humanMode) {
    console.log("\n  ⚡ Commands\n");
    outputHumanTable(rows, [
      { key: "command", label: "Command" }, { key: "adapter", label: "Adapter" },
      { key: "args", label: "Args" },       { key: "description", label: "Description" },
    ]);
    console.log(`  Returned: ${returned}/${total}  (offset: ${start})\n`);
  } else {
    const result = {
      version: "1.0", total, returned, offset: start,
      filters: {
        namespace: namespaceFilter || null, resource: resourceFilter || null,
        action: actionFilter || null, query: queryFilter || null,
        limit: limitAuto ? 50 : (limit === null ? null : limit),
      },
      commands: rows,
    };
    if (limitAuto && returned < total) result._warning = "--limit 50 applied to avoid context bloat. Use --limit <n> and --offset <n> for pagination.";
    output(result);
  }
  } catch (err) {
    outputError({ code: 110, type: "internal_error", message: `handleCommandsQuery: ${err.message}`, recoverable: false });
  }
}

function handleInspect(config, positional, { humanMode, output, outputError }) {
  if (positional.length < 4) {
    outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli inspect <namespace> <resource> <action>", recoverable: false });
    return;
  }
  const cmd = config.commands.find(
    (c) => c.namespace === positional[1] && c.resource === positional[2] && c.action === positional[3]
  );
  if (!cmd) {
    outputError({ code: 92, type: "resource_not_found", message: `Command ${positional[1]}.${positional[2]}.${positional[3]} not found`, suggestions: ["Run: supercli commands"] });
    return;
  }
  const spec = {
    version: "1.0",
    command: `${cmd.namespace}.${cmd.resource}.${cmd.action}`,
    namespace: cmd.namespace,
    resource: cmd.resource,
    action: cmd.action,
    description: cmd.description, adapter: cmd.adapter,
    adapterConfig: cmd.adapterConfig, args: cmd.args,
    input_schema: {
      type: "object",
      properties: (cmd.args || []).reduce((acc, a) => { acc[a.name] = { type: a.type || "string" }; return acc; }, {}),
      required: (cmd.args || []).filter((a) => a.required).map((a) => a.name),
    },
    side_effects: !!cmd.mutation,
    risk_level: cmd.risk_level || "safe",
  };
  if (humanMode) {
    console.log(`\n  ⚡ ${spec.command}\n`);
    console.log(`  Description: ${spec.description || "(none)"}`);
    console.log(`  Adapter:     ${spec.adapter}`);
    console.log(`  Risk:        ${spec.risk_level}`);
    console.log(`  Side effects: ${spec.side_effects ? "yes" : "no"}`);
    if (cmd.args && cmd.args.length) {
      console.log("\n  Arguments:");
      cmd.args.forEach((a) => console.log(`    --${a.name} (${a.type || "string"})${a.required ? " [required]" : ""}`));
    }
    console.log("");
  } else {
    output(spec);
  }
}

function handleSchema(cmd, positional, { output }) {
  const [namespace, resource, action] = positional;
  output({
    version: "1.0",
    command: `${namespace}.${resource}.${action}`,
    input_schema: {
      type: "object",
      properties: (cmd.args || []).reduce((acc, a) => { acc[a.name] = { type: a.type || "string" }; return acc; }, {}),
      required: (cmd.args || []).filter((a) => a.required).map((a) => a.name),
    },
    output_schema: cmd.output || { type: "object" },
  });
}

function handleNamespaceBrowse(config, positional, { humanMode, output, outputError }) {
  if (positional.length === 1) {
    const cmds = config.commands.filter((c) => c.namespace === positional[0]);
    const resources = [...new Set(cmds.map((c) => c.resource))];
    if (resources.length === 0) {
      outputError({ code: 92, type: "resource_not_found", message: `Namespace '${positional[0]}' not found`, suggestions: ["Run: supercli help"] });
      return;
    }
    if (humanMode) {
      console.log(`\n  ⚡ ${positional[0]}\n\n  Resources:\n`);
      resources.forEach((r) => {
        const actions = cmds.filter((c) => c.resource === r).map((c) => c.action);
        console.log(`    ${r}: ${actions.join(", ")}`);
      });
      console.log("");
    } else {
      output({ namespace: positional[0], resources });
    }
    return;
  }
  // positional.length === 2
  const actions = config.commands
    .filter((c) => c.namespace === positional[0] && c.resource === positional[1])
    .map((c) => c.action);
  if (actions.length === 0) {
    outputError({ code: 92, type: "resource_not_found", message: `Resource '${positional[0]}.${positional[1]}' not found`, suggestions: [`Run: supercli ${positional[0]}`] });
    return;
  }
  if (humanMode) {
    console.log(`\n  ⚡ ${positional[0]}.${positional[1]}\n\n  Actions:\n`);
    actions.forEach((a) => console.log(`    ${a}`));
    console.log("");
  } else {
    output({ namespace: positional[0], resource: positional[1], actions });
  }
}

module.exports = { handleCommandsQuery, handleInspect, handleSchema, handleNamespaceBrowse };
