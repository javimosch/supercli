const { listRegistryPlugins } = require("./plugins-registry")
const { listInstalledPlugins, getPluginInstallGuidance } = require("./plugins-manager")

const STOPWORDS = new Set([
  "a", "an", "and", "as", "at", "be", "by", "do", "for", "from", "get", "how", "i", "in", "into",
  "is", "it", "me", "of", "on", "or", "please", "that", "the", "this", "to", "use", "with"
])

const SYNONYMS = {
  mail: "email",
  mailbox: "email",
  gmail: "email",
  smtp: "email",
  browse: "browser",
  browsing: "browser",
  browseruse: "browser-use",
  web: "browser",
  tweet: "twitter",
  tweets: "twitter",
  gcp: "google-cloud",
  k8s: "kubernetes",
}

function tokenizeIntent(intent) {
  const raw = String(intent || "").toLowerCase().replace(/[^a-z0-9\-\s]/g, " ")
  const baseTokens = raw
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean)
    .filter(t => !STOPWORDS.has(t))

  const expanded = []
  for (const token of baseTokens) {
    expanded.push(token)
    if (SYNONYMS[token] && SYNONYMS[token] !== token) expanded.push(SYNONYMS[token])
  }
  return [...new Set(expanded)]
}

function countTokenHits(text, tokens) {
  if (!text || tokens.length === 0) return []
  const lower = String(text).toLowerCase()
  return tokens.filter(t => lower.includes(t))
}

function scorePlugin(plugin, tokens, phrase, installedSet) {
  const name = String(plugin.name || "")
  const tags = Array.isArray(plugin.tags) ? plugin.tags.map(t => String(t)) : []
  const description = String(plugin.description || "")

  const nameHits = countTokenHits(name, tokens)
  const tagHits = tags.flatMap(tag => countTokenHits(tag, tokens))
  const descHits = countTokenHits(description, tokens)

  const uniqueTagHits = [...new Set(tagHits)]
  const uniqueDescHits = [...new Set(descHits)]
  const baseScore = nameHits.length * 6 + uniqueTagHits.length * 5 + uniqueDescHits.length * 2
  let score = baseScore

  const phraseNormalized = String(phrase || "").trim().toLowerCase()
  const phraseHit =
    phraseNormalized.length > 2 &&
    (`${name} ${description}`.toLowerCase().includes(phraseNormalized))

  if (phraseHit) score += 4
  if (installedSet.has(name)) score += 1
  if (plugin.has_learn === true) score += 1

  return {
    plugin,
    base_score: baseScore,
    score,
    matched_tokens: [...new Set([...nameHits, ...uniqueTagHits, ...uniqueDescHits])],
    matched_fields: {
      name: nameHits,
      tags: uniqueTagHits,
      description: uniqueDescHits,
      phrase: phraseHit,
    }
  }
}

function discoverPluginsByIntent(intent, options = {}) {
  const phrase = String(intent || "").trim()
  if (!phrase) {
    throw Object.assign(new Error("Missing --intent text"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
      suggestions: ["Run: supercli discover --intent \"send email\" --json"]
    })
  }

  const limitRaw = options.limit
  const limit = limitRaw === undefined || limitRaw === null ? 5 : Number(limitRaw)
  if (!Number.isInteger(limit) || limit <= 0) {
    throw Object.assign(new Error("Invalid --limit. Use a positive integer"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    })
  }

  const tokens = tokenizeIntent(phrase)
  const plugins = listRegistryPlugins()
  const installedSet = new Set(listInstalledPlugins().map(p => p.name))

  const ranked = plugins
    .map(plugin => scorePlugin(plugin, tokens, phrase, installedSet))
    .filter(item => item.base_score > 0 || item.matched_fields.phrase)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.plugin.name.localeCompare(b.plugin.name)
    })

  const top = ranked.slice(0, limit).map(item => {
    const plugin = item.plugin
    const guidance = getPluginInstallGuidance(plugin.name)
    const installed = installedSet.has(plugin.name)
    const nextSteps = []
    if (plugin.has_learn === true) nextSteps.push(`supercli plugins learn ${plugin.name} --json`)
    if (!installed) nextSteps.push(`supercli plugins install ${plugin.name}`)
    if (guidance && Array.isArray(guidance.install_steps)) {
      for (const cmd of guidance.install_steps.slice(0, 2)) {
        if (installed && cmd.startsWith("supercli plugins install ")) continue
        if (!nextSteps.includes(cmd)) nextSteps.push(cmd)
      }
    }

    return {
      name: plugin.name,
      description: plugin.description,
      tags: plugin.tags,
      installed,
      has_learn: plugin.has_learn === true,
      source_type: (plugin.source && plugin.source.type) || "bundled",
      score: item.score,
      matched_tokens: item.matched_tokens,
      matched_fields: item.matched_fields,
      next_steps: nextSteps,
    }
  })

  return {
    intent: phrase,
    tokens,
    no_llm: true,
    total_candidates: ranked.length,
    returned: top.length,
    plugins: top,
  }
}

module.exports = {
  tokenizeIntent,
  discoverPluginsByIntent,
}
