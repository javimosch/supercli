#!/usr/bin/env node

const http = require("http")

const PORT = Number(process.env.MCP_SSE_PORT || 8787)
const clients = new Set()

function summarize(text) {
  const normalized = String(text || "").trim().replace(/\s+/g, " ")
  if (!normalized) return ""
  const words = normalized.split(" ")
  if (words.length <= 12) return normalized
  return words.slice(0, 12).join(" ") + " ..."
}

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const res of clients) {
    res.write(payload)
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    })
    res.write("event: ready\ndata: {\"ok\":true}\n\n")
    clients.add(res)
    req.on("close", () => clients.delete(res))
    return
  }

  if (req.method === "POST" && req.url === "/tool") {
    let raw = ""
    req.setEncoding("utf-8")
    req.on("data", chunk => { raw += chunk })
    req.on("end", () => {
      let payload
      try {
        payload = JSON.parse(raw || "{}")
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Invalid JSON body" }))
        return
      }

      const tool = payload.tool
      const input = payload.input || {}
      if (tool !== "summarize") {
        res.writeHead(404, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: `Unknown tool: ${tool}` }))
        return
      }

      broadcast("tool_called", { tool, input })
      const result = summarize(input.text)
      const out = {
        tool,
        mode: "sse-http",
        result,
        words_in: String(input.text || "").trim() ? String(input.text).trim().split(/\s+/).length : 0,
        words_out: result ? result.split(/\s+/).length : 0
      }
      broadcast("tool_done", out)
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(out))
    })
    return
  }

  res.writeHead(404, { "Content-Type": "application/json" })
  res.end(JSON.stringify({ error: "Not found" }))
})

server.listen(PORT, "127.0.0.1", () => {
  console.log(`MCP SSE demo server listening on http://127.0.0.1:${PORT}`)
  console.log("Endpoints: POST /tool, GET /events")
})
