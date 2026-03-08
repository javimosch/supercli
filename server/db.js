const { MongoClient } = require("mongodb")

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017"
const DB_NAME = process.env.DCLI_DB || "dcli"

let db = null

async function connect() {
  if (db) return db
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  db = client.db(DB_NAME)

  // Seed config_version if missing
  const existing = await db.collection("settings").findOne({ key: "config_version" })
  if (!existing) {
    await db.collection("settings").insertOne({ key: "config_version", value: "1" })
  }

  return db
}

function getDb() {
  if (!db) throw new Error("Database not connected. Call connect() first.")
  return db
}

module.exports = { connect, getDb }
