"use strict"

const os = require("os")
const path = require("path")

// SUPERCLI_HOME — base data directory; override via env, default to ~/.supercli
function getSupercliHome() {
  return process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli")
}

// SUPERCLI_SERVER — remote panel URL; no default (null when unset)
function getServer() {
  return process.env.SUPERCLI_SERVER || null
}

// SUPERCLI_API_KEY — bearer token for panel auth; no default (null when unset)
function getApiKey() {
  return process.env.SUPERCLI_API_KEY || null
}

// SUPERCLI_CLIENT_ID — explicit override for the generated machine fingerprint
// Trims whitespace so accidental trailing spaces in env don't leak into hashes.
// Returns null when unset so callers can fall back to their own ID generation.
function getClientId() {
  const raw = process.env.SUPERCLI_CLIENT_ID
  if (!raw) return null
  const trimmed = String(raw).trim()
  return trimmed || null
}

// OPENAI_BASE_URL — points to a local LLM that speaks the OpenAI HTTP API;
// null when unset (callers use this as the hasLocalLLM gate)
function getOpenAiBaseUrl() {
  return process.env.OPENAI_BASE_URL || null
}

// OPENAI_MODEL — model name sent to the local/remote LLM; default gpt-3.5-turbo
function getOpenAiModel() {
  return process.env.OPENAI_MODEL || "gpt-3.5-turbo"
}

// OPENAI_API_KEY — API key sent to the LLM endpoint; default "dummy" so that
// local LLMs (which ignore the key) work without extra env-var setup
function getOpenAiApiKey() {
  return process.env.OPENAI_API_KEY || "dummy"
}

// Expand ${VARNAME} placeholders inside a string using process.env.
// Unknown variables are replaced with "". Non-strings are returned unchanged.
function interpolateEnvPlaceholders(text) {
  if (typeof text !== "string") return text
  return text.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => process.env[name] || "")
}

module.exports = {
  getSupercliHome,
  getServer,
  getApiKey,
  getClientId,
  getOpenAiBaseUrl,
  getOpenAiModel,
  getOpenAiApiKey,
  interpolateEnvPlaceholders,
}
