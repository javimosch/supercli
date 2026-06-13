"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const {
  getEffectivePluginCommands,
} = require("./plugins-store");

const CACHE_DIR = path.join(os.homedir(), ".supercli");
const CACHE_FILE = path.join(CACHE_DIR, "config.json");

function getClientId() {
  if (process.env.SUPERCLI_CLIENT_ID) {
    return String(process.env.SUPERCLI_CLIENT_ID).trim();
  }
  const pieces = [os.hostname(), os.type(), os.release(), os.arch(), os.userInfo().username];
  return crypto.createHash("sha256").update(pieces.join("|")).digest("hex");
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function emptyConfig() {
  return { version: "1", ttl: 3600, mcp_servers: [], specs: [], commands: [] };
}

function normalizeMcpServerEntry(name, entry) {
  if (!name || typeof name !== "string") return null;
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
  const out = { name };
  if (typeof entry.url === "string") out.url = entry.url;
  if (typeof entry.command === "string") out.command = entry.command;
  if (Array.isArray(entry.args)) out.args = entry.args.filter(v => typeof v === "string");
  if (Array.isArray(entry.commandArgs)) out.commandArgs = entry.commandArgs.filter(v => typeof v === "string");
  if (entry.headers && typeof entry.headers === "object" && !Array.isArray(entry.headers)) {
    out.headers = Object.fromEntries(Object.entries(entry.headers).filter(([k, v]) => typeof k === "string" && typeof v === "string"));
  }
  if (entry.env && typeof entry.env === "object" && !Array.isArray(entry.env)) {
    out.env = Object.fromEntries(Object.entries(entry.env).filter(([k, v]) => typeof k === "string" && typeof v === "string"));
  }
  if (typeof entry.timeout_ms === "number" && entry.timeout_ms > 0) out.timeout_ms = entry.timeout_ms;
  if (entry.stateful === true) out.stateful = true;
  return out;
}

function normalizeMcpServers(config) {
  const out = [];
  const byName = new Map();
  if (config && config.mcpServers && typeof config.mcpServers === "object" && !Array.isArray(config.mcpServers)) {
    for (const [name, value] of Object.entries(config.mcpServers)) {
      const normalized = normalizeMcpServerEntry(name, value);
      if (normalized) byName.set(name, normalized);
    }
  }
  if (Array.isArray(config && config.mcp_servers)) {
    for (const entry of config.mcp_servers) {
      if (!entry || typeof entry !== "object") continue;
      const normalized = normalizeMcpServerEntry(entry.name, entry);
      if (normalized) byName.set(normalized.name, normalized);
    }
  }
  for (const value of byName.values()) out.push(value);
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

function normalizeConfig(config) {
  const base = config && typeof config === "object" ? { ...config } : emptyConfig();
  base.mcp_servers = normalizeMcpServers(base);
  if (!Array.isArray(base.specs)) base.specs = [];
  if (!Array.isArray(base.commands)) base.commands = [];
  return base;
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return normalizeConfig(parsed);
    }
  } catch (e) {}
  return null;
}

function writeCache(config) {
  ensureCacheDir();
  const data = { ...normalizeConfig(config), fetchedAt: Date.now() };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  return data;
}

async function fetchRemoteConfig(server) {
  if (!server) throw new Error("SUPERCLI_SERVER is not configured");
  const url = `${server}/api/config`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to fetch config: ${r.status} ${r.statusText}`);
  return r.json();
}

async function loadConfig() {
  const cache = readCache();
  const base = cache || emptyConfig();
  const pluginCommands = getEffectivePluginCommands();
  const merged = { ...base, commands: [...(base.commands || []), ...pluginCommands] };
  return merged;
}

function cacheFilePath() {
  return CACHE_FILE;
}

module.exports = {
  getClientId,
  ensureCacheDir,
  emptyConfig,
  normalizeMcpServerEntry,
  normalizeMcpServers,
  normalizeConfig,
  readCache,
  writeCache,
  fetchRemoteConfig,
  loadConfig,
  cacheFilePath,
};
