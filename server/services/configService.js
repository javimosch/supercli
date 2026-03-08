const { ObjectId } = require("mongodb")

async function getCLIConfig(db) {
  const commands = await db.collection("commands").find().toArray()
  const version = await db.collection("settings").findOne({ key: "config_version" })

  return {
    version: version ? version.value : "1",
    ttl: 3600,
    commands: commands.map(c => ({
      _id: c._id,
      namespace: c.namespace,
      resource: c.resource,
      action: c.action,
      description: c.description || "",
      adapter: c.adapter,
      adapterConfig: c.adapterConfig || {},
      args: c.args || []
    }))
  }
}

async function bumpVersion(db) {
  const doc = await db.collection("settings").findOne({ key: "config_version" })
  const next = String(parseInt(doc ? doc.value : "0", 10) + 1)
  await db.collection("settings").updateOne(
    { key: "config_version" },
    { $set: { value: next } },
    { upsert: true }
  )
  return next
}

async function getNamespaces(db) {
  return db.collection("commands").distinct("namespace")
}

async function getResources(db, namespace) {
  return db.collection("commands").distinct("resource", { namespace })
}

async function getActions(db, namespace, resource) {
  return db.collection("commands").distinct("action", { namespace, resource })
}

async function getCommand(db, namespace, resource, action) {
  return db.collection("commands").findOne({ namespace, resource, action })
}

module.exports = {
  getCLIConfig,
  bumpVersion,
  getNamespaces,
  getResources,
  getActions,
  getCommand
}
