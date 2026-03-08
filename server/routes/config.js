const { Router } = require("express")
const { getDb } = require("../db")
const configService = require("../services/configService")

const router = Router()

// GET /api/config — full CLI config
router.get("/", async (req, res) => {
  try {
    const db = getDb()
    const config = await configService.getCLIConfig(db)
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/tree — list namespaces
router.get("/tree", async (req, res) => {
  try {
    const db = getDb()
    const namespaces = await configService.getNamespaces(db)
    res.json({ namespaces })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/tree/:ns — list resources in namespace
router.get("/tree/:ns", async (req, res) => {
  try {
    const db = getDb()
    const resources = await configService.getResources(db, req.params.ns)
    res.json({ resources })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/tree/:ns/:res — list actions
router.get("/tree/:ns/:res", async (req, res) => {
  try {
    const db = getDb()
    const actions = await configService.getActions(db, req.params.ns, req.params.res)
    res.json({ actions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/command/:ns/:res/:act — full command spec
router.get("/command/:ns/:res/:act", async (req, res) => {
  try {
    const db = getDb()
    const cmd = await configService.getCommand(db, req.params.ns, req.params.res, req.params.act)
    if (!cmd) return res.status(404).json({ error: "Command not found" })
    res.json(cmd)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
