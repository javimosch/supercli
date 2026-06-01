"use strict";

function compactKeys(obj) {
  if (Array.isArray(obj)) return obj.map(compactKeys);
  if (obj && typeof obj === "object") {
    const map = {
      version: "v", command: "c", duration_ms: "ms", data: "d",
      namespace: "ns", resource: "r", action: "a", description: "desc",
      adapter: "ad", commands: "cmds", error: "err", message: "msg",
      suggestions: "sug", name: "n",
    };
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[map[k] || k] = compactKeys(v);
    }
    return out;
  }
  return obj;
}

function makeOutput({ humanMode, compactMode }) {
  return function output(data) {
    const str = compactMode
      ? JSON.stringify(compactKeys(data))
      : humanMode
        ? typeof data === "string" ? data : JSON.stringify(data, null, 2)
        : JSON.stringify(data);
    console.log(str);
  };
}

function makeOutputError({ humanMode, compactMode }) {
  const output = makeOutput({ humanMode, compactMode });
  return function outputError(error) {
    const numericCode = Number.isInteger(error.code)
      ? error.code
      : Number.parseInt(error.code, 10) || 110;
    const envelope = {
      error: {
        code: numericCode,
        type: error.type || "internal_error",
        message: error.message,
        recoverable: error.recoverable || false,
        suggestions: error.suggestions || [],
      },
    };
    if (humanMode) {
      process.stderr.write(`${envelope.error.type}: ${envelope.error.message}\n`);
      if (envelope.error.suggestions.length) {
        envelope.error.suggestions.forEach((s) => process.stderr.write(`  → ${s}\n`));
      }
    } else {
      process.stderr.write(
        JSON.stringify(compactMode ? compactKeys(envelope) : envelope) + "\n"
      );
    }
    process.exit(envelope.error.code);
  };
}

function outputHumanTable(rows, columns) {
  if (!rows || rows.length === 0) { console.log("  (empty)"); return true; }
  const widths = columns.map((col) =>
    Math.max(col.label.length, ...rows.map((r) => String(r[col.key] || "").length))
  );
  const header = columns.map((col, i) => col.label.padEnd(widths[i])).join("  ");
  const sep = columns.map((_, i) => "─".repeat(widths[i])).join("──");
  console.log(`  ${header}`);
  console.log(`  ${sep}`);
  rows.forEach((row) => {
    const line = columns.map((col, i) => String(row[col.key] || "").padEnd(widths[i])).join("  ");
    console.log(`  ${line}`);
  });
  return true;
}

function makeStreamEmitter(commandName, { humanMode, output }) {
  if (humanMode) return null;
  return (event) => output({ version: "1.0", command: commandName, stream: true, data: event });
}

module.exports = { compactKeys, makeOutput, makeOutputError, outputHumanTable, makeStreamEmitter };
