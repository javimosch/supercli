"use strict"

const fs = require("fs")
const os = require("os")
const path = require("path")

function supercliDir() {
  return process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli")
}

function slashCommandsFile() {
  return path.join(supercliDir(), "slash-commands.json")
}

function ensureDir() {
  const dir = supercliDir()
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readCommands() {
  try {
    const file = slashCommandsFile()
    if (!fs.existsSync(file)) return []
    const raw = fs.readFileSync(file, "utf-8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCommands(commands) {
  ensureDir()
  fs.writeFileSync(slashCommandsFile(), JSON.stringify(commands, null, 2))
}

function listSlashCommands() {
  return readCommands()
}

function addSlashCommand(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("entry must be a non-null object")
  }
  const name = String(entry.name || "").trim()
  if (!name) throw new Error("name is required")

  const commands = readCommands()
  const normalized = { ...entry, name }
  const idx = commands.findIndex(c => c && c.name === name)
  if (idx >= 0) commands[idx] = normalized
  else commands.push(normalized)
  writeCommands(commands)
  return normalized
}

function removeSlashCommand(name) {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("name must be a non-empty string")
  }
  const trimmed = name.trim()
  const commands = readCommands()
  const next = commands.filter(c => c && c.name !== trimmed)
  const removed = commands.length - next.length
  writeCommands(next)
  return removed
}

module.exports = {
  listSlashCommands,
  addSlashCommand,
  removeSlashCommand,
  slashCommandsFile,
}
