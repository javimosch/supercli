"use strict"

const fs = require("fs")
const os = require("os")
const path = require("path")
const { spawnSync } = require("child_process")

function dcliDir() {
  return process.env.SUPERCLI_HOME || path.join(os.homedir(), ".dcli")
}

function supercliDir() {
  return process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli")
}

function providersFile() {
  const supercliPath = path.join(supercliDir(), "skills-providers.json")
  const dcliPath = path.join(dcliDir(), "skills-providers.json")
  return fs.existsSync(supercliPath) ? supercliPath : dcliPath
}

function indexFile() {
  const supercliPath = path.join(supercliDir(), "skills-index.json")
  const dcliPath = path.join(dcliDir(), "skills-index.json")
  return fs.existsSync(supercliPath) ? supercliPath : dcliPath
}

function ensureDir() {
  const dir = dcliDir()
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const supercliDirPath = supercliDir()
  if (!fs.existsSync(supercliDirPath)) fs.mkdirSync(supercliDirPath, { recursive: true })
}


function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file, "utf-8"))
  } catch {
    return fallback
  }
}

function writeJson(file, value) {
  ensureDir()
  fs.writeFileSync(file, JSON.stringify(value, null, 2))
  return value
}


function walkDir(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkDir(full))
      continue
    }
    if (entry.isFile() && entry.name === "SKILL.md") files.push(full)
  }
  return files
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) return { frontmatter: {}, body: markdown }
  const end = markdown.indexOf("\n---\n", 4)
  if (end < 0) return { frontmatter: {}, body: markdown }
  const raw = markdown.slice(4, end)
  const body = markdown.slice(end + 5)
  const frontmatter = {}
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(":")
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^"|"$/g, "")
    if (key) frontmatter[key] = value
  }
  return { frontmatter, body }
}

function baseSkillId(filePath, frontmatter, root) {
  if (frontmatter.skill_name) return frontmatter.skill_name
  const rel = path.relative(root, filePath)
  return rel.replace(/\\/g, "/").replace(/\/SKILL\.md$/, "").replace(/\//g, ".")
}


module.exports = {
  dcliDir, supercliDir, providersFile, indexFile, ensureDir,
  readJson, writeJson, walkDir, parseFrontmatter, baseSkillId,
}
