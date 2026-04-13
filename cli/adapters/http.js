// HTTP Adapter
// Raw HTTP calls based on adapterConfig: method, url, headers, body

async function execute(cmd, flags, context) {
  const config = cmd.adapterConfig || {}
  let url = config.url
  let method = (config.method || "GET").toUpperCase()
  const headers = { ...(config.headers || {}) }

  if (!url) {
    throw new Error("HTTP adapter requires 'url' in adapterConfig")
  }

  // Replace {param} placeholders in URL with flag values
  for (const [k, v] of Object.entries(flags)) {
    if (["human", "json", "compact"].includes(k)) continue
    url = url.replace(`{${k}}`, encodeURIComponent(v))
  }

  // Build query string from flags for GET requests
  if (method === "GET") {
    const queryFlags = Object.entries(flags).filter(([k]) =>
      !["human", "json", "compact"].includes(k) && !url.includes(encodeURIComponent(flags[k]))
    )
    if (queryFlags.length > 0 && !url.includes("?")) {
      // Only add flags that weren't used as path params
      const remaining = queryFlags.filter(([k]) => !config.url.includes(`{${k}}`))
      if (remaining.length > 0) {
        url += "?" + remaining.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
      }
    }
  }

  const fetchOpts = { method, headers }

  // Build body for non-GET methods
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (config.body || config.bodyTemplate) {
      let bodyObj = config.body || config.bodyTemplate || {}
      
      // Support bodyTemplate with {{placeholder}} interpolation from flags
      if (config.bodyTemplate) {
        bodyObj = JSON.parse(JSON.stringify(config.bodyTemplate), (key, value) => {
          if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
            const flagName = value.slice(2, -2).trim()
            const flagValue = flags[flagName]
            if (flagValue === undefined) return null // Signal to remove this field
            // Parse JSON strings (for arrays/objects passed as flag values)
            if (typeof flagValue === "string") {
              try {
                return JSON.parse(flagValue)
              } catch {
                return flagValue
              }
            }
            return flagValue
          }
          return value
        })
        // Remove null values (from unresolved {{placeholders}}) and fix type issues
        bodyObj = JSON.parse(JSON.stringify(bodyObj), (key, value) => {
          if (value === null) return undefined
          // Convert numeric strings that should be numbers
          if (typeof value === "string" && !isNaN(value) && value.trim() !== "") {
            if (Number.isInteger(Number(value))) {
              return parseInt(value, 10)
            }
            return parseFloat(value)
          }
          return value
        })
      }
      
      fetchOpts.body = JSON.stringify(bodyObj)
    } else {
      const bodyObj = {}
      for (const [k, v] of Object.entries(flags)) {
        if (!["human", "json", "compact"].includes(k)) {
          bodyObj[k] = v
        }
      }
      if (Object.keys(bodyObj).length > 0) {
        fetchOpts.body = JSON.stringify(bodyObj)
        headers["Content-Type"] = "application/json"
      }
    }
  }

  const r = await fetch(url, fetchOpts)

  if (!r.ok) {
    const text = await r.text().catch(() => "")
    throw Object.assign(new Error(`HTTP request failed: ${r.status} ${r.statusText} ${text}`), {
      code: r.status >= 500 ? 105 : 92,
      type: r.status >= 500 ? "integration_error" : "resource_not_found",
      recoverable: r.status >= 500
    })
  }

  const contentType = r.headers.get("content-type") || ""
  if (contentType.includes("json")) {
    return r.json()
  }
  return { raw: await r.text() }
}

module.exports = { execute }
