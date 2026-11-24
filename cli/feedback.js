"use strict";
// feedback — cli-feedback-spec, relay-only variant (no local store).
// POSTs {app,version,kind,message,context,reporter,id} to the shared
// relay. Never fails the caller: relay failure leaves relayed:false.

const crypto = require("crypto");

const RELAY_DEFAULT = "https://feedback.intrane.fr";

function relayBase() {
  const r = process.env.FEEDBACK_RELAY;
  return r === undefined || r === "" ? RELAY_DEFAULT : r;
}

async function sendFeedback({ message, kind, context }) {
  const { CLI_VERSION } = require("./arg-parser");
  const id = crypto.randomBytes(8).toString("hex");
  const reporter = process.env.USER || process.env.USERNAME || "agent";
  const body = {
    app: "sc",
    version: CLI_VERSION,
    kind: kind || "note",
    message,
    context: context || "",
    reporter,
    id,
  };
  let relayed = false;
  const base = relayBase();
  if (base !== "off") {
    try {
      const res = await fetch(base.replace(/\/$/, "") + "/v1/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json().catch(() => null);
      relayed = !!(res.ok && data && data.ok === true);
    } catch (e) {}
  }
  return { id, stored: 0, relayed: relayed ? 1 : 0 };
}

module.exports = { sendFeedback };
