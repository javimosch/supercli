const { Router } = require("express")

const router = Router()

// GET /api/docs - redirect to standalone docs with fromServerUI param
router.get("/", (req, res) => {
  res.redirect("/docs/index.html?fromServerUI=1")
})

module.exports = router
