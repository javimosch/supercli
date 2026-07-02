"use strict"

const fs = require("fs")
const os = require("os")
const path = require("path")

function supercliDir() {
  return process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli")
}

function projectsFile() {
  return path.join(supercliDir(), "projects.json")
}

function ensureDir() {
  const dir = supercliDir()
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readProjects() {
  try {
    const file = projectsFile()
    if (!fs.existsSync(file)) return []
    const raw = fs.readFileSync(file, "utf-8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeProjects(projects) {
  ensureDir()
  fs.writeFileSync(projectsFile(), JSON.stringify(projects, null, 2))
}

function listProjects() {
  return readProjects()
}

function addProject(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("entry must be a non-null object")
  }
  const name = String(entry.name || "").trim()
  if (!name) throw new Error("name is required")

  const projects = readProjects()
  const normalized = { ...entry, name }
  const idx = projects.findIndex(p => p && p.name === name)
  if (idx >= 0) projects[idx] = normalized
  else projects.push(normalized)
  writeProjects(projects)
  return normalized
}

function removeProject(name) {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("name must be a non-empty string")
  }
  const trimmed = name.trim()
  const projects = readProjects()
  const next = projects.filter(p => p && p.name !== trimmed)
  const removed = projects.length - next.length
  writeProjects(next)
  return removed
}

module.exports = {
  listProjects,
  addProject,
  removeProject,
  projectsFile,
}
