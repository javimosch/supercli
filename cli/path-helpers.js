"use strict"

const path = require("path")

/**
 * Returns true if `candidate` (already resolved) lives inside `base` (already
 * resolved).  Requires an explicit path-separator suffix so that a directory
 * whose name is a prefix of another (e.g. /tmp/foo vs /tmp/foobar) does not
 * yield a false positive.
 *
 * @param {string} candidate - absolute path to test
 * @param {string} base      - absolute directory that must contain candidate
 * @returns {boolean}
 */
function isPathContained(candidate, base) {
  const normalizedBase = path.resolve(base) + path.sep
  const normalizedCandidate = path.resolve(candidate)
  return normalizedCandidate.startsWith(normalizedBase)
}

/**
 * Resolves `rel` relative to `base`, then checks that the result stays inside
 * `base`.  Returns the resolved absolute path on success, or `null` if the
 * resolved path would escape `base` (path-traversal attempt).
 *
 * @param {string} base - absolute base directory
 * @param {string} rel  - relative (or absolute) path to resolve
 * @returns {string|null}
 */
function resolveContained(base, rel) {
  const resolved = path.resolve(base, rel)
  if (!isPathContained(resolved, base)) return null
  return resolved
}

/**
 * Returns the absolute path to the bundled plugin directory for `pluginName`.
 * Bundled plugins live at `<repo-root>/plugins/<name>/`.
 *
 * @param {string} pluginName
 * @returns {string}
 */
function resolveBundledPluginDir(pluginName) {
  return path.resolve(__dirname, "..", "plugins", pluginName)
}

/**
 * Returns the absolute path to the bundled plugin manifest for `pluginName`
 * (`<repo-root>/plugins/<name>/plugin.json`).
 *
 * @param {string} pluginName
 * @returns {string}
 */
function resolveBundledManifest(pluginName) {
  return path.join(resolveBundledPluginDir(pluginName), "plugin.json")
}

/**
 * Converts a string to a safe lowercase slug (letters, digits, hyphens only).
 * Leading/trailing hyphens are stripped; runs of non-alphanumeric characters
 * are collapsed into a single hyphen.
 *
 * Useful for deriving filesystem-safe names from plugin or namespace identifiers.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  if (typeof str !== "string") return ""
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

module.exports = {
  isPathContained,
  resolveContained,
  resolveBundledPluginDir,
  resolveBundledManifest,
  slugify,
}
