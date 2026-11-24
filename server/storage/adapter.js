/**
 * Storage Adapter Factory
 * Provides a unified KV store interface (get, set, delete, listKeys)
 * backed by local JSON files.
 */
const FileAdapter = require("./file");

// Singleton storage instance
let currentAdapter = null;

function getStorage() {
  if (currentAdapter) return currentAdapter;

  const storageDir = process.env.SUPERCLI_STORAGE_DIR || "./supercli_storage";
  currentAdapter = new FileAdapter(storageDir);
  console.log(`[Storage] Initialized File adapter (${storageDir})`);

  return currentAdapter;
}

module.exports = { getStorage };
