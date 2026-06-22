#!/usr/bin/env bun
/**
 * Database utilities for plugin candidates
 */

import { Database } from "bun:sqlite";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(import.meta.dir, "plugin-candidates.db");
const PLUGINS_DUMP_PATH = join(import.meta.dir, "plugins-dump.json");

interface PluginEntry {
  name: string;
  description: string;
  tags: string[];
  source: string;
}

export function initDatabase(): Database {
  const db = new Database(DB_PATH);
  db.exec("PRAGMA foreign_keys = ON");
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS existing_plugins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      source TEXT,
      tags TEXT,
      loaded_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS plugin_candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      source TEXT,
      homepage TEXT,
      language TEXT,
      category TEXT,
      stars INTEGER,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      search_query TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_existing_plugins_name ON existing_plugins(name);
    CREATE INDEX IF NOT EXISTS idx_plugin_candidates_name ON plugin_candidates(name);
  `);
  
  return db;
}

export function loadExistingPlugins(db: Database): void {
  if (!existsSync(PLUGINS_DUMP_PATH)) {
    console.log("Plugins dump file not found. Run dump-plugins.ts first.");
    return;
  }
  
  try {
    const pluginsDump = JSON.parse(readFileSync(PLUGINS_DUMP_PATH, "utf-8"));
    
    const insert = db.prepare(`
      INSERT OR REPLACE INTO existing_plugins (name, description, source, tags)
      VALUES (?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((plugins: any[]) => {
      for (const plugin of plugins) {
        insert.run(
          plugin.name,
          plugin.description,
          plugin.source,
          JSON.stringify(plugin.tags || [])
        );
      }
    });
    
    insertMany(pluginsDump);
    console.log(`Loaded ${pluginsDump.length} existing plugins into database`);
  } catch (error) {
    console.error("Error loading existing plugins:", error);
    throw error;
  }
}

export function pluginExists(db: Database, name: string): boolean {
  const row = db.prepare("SELECT 1 FROM existing_plugins WHERE name = ?").get(name);
  return !!row;
}

export function candidateExists(db: Database, name: string): boolean {
  const row = db.prepare("SELECT 1 FROM plugin_candidates WHERE name = ?").get(name);
  return !!row;
}

export function addPluginCandidate(db: Database, candidate: {
  name: string;
  description: string;
  source: string;
  homepage?: string;
  language?: string;
  stars?: number;
  search_query?: string;
}): boolean {
  if (pluginExists(db, candidate.name)) {
    return false;
  }
  
  if (candidateExists(db, candidate.name)) {
    return false;
  }
  
  const insert = db.prepare(`
    INSERT INTO plugin_candidates (name, description, source, homepage, language, stars, search_query)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  try {
    insert.run(
      candidate.name,
      candidate.description,
      candidate.source,
      candidate.homepage || null,
      candidate.language || null,
      candidate.stars || null,
      candidate.search_query || null
    );
    console.log(`✓ Added: ${candidate.name} (${candidate.stars} ⭐)`);
    return true;
  } catch (error) {
    console.log(`✗ Error adding ${candidate.name}:`, error);
    return false;
  }
}

export interface DatabaseStats {
  existing: number;
  candidates: number;
  pending: number;
}

export function getStats(db: Database): DatabaseStats {
  const existingCount = db.prepare("SELECT COUNT(*) as count FROM existing_plugins").get() as { count: number };
  const candidatesCount = db.prepare("SELECT COUNT(*) as count FROM plugin_candidates").get() as { count: number };
  const pendingCount = db.prepare("SELECT COUNT(*) as count FROM plugin_candidates WHERE status = 'pending'").get() as { count: number };
  
  return {
    existing: existingCount.count,
    candidates: candidatesCount.count,
    pending: pendingCount.count
  };
}

export function markAllCandidatesApproved(db: Database): number {
  const update = db.prepare("UPDATE plugin_candidates SET status = 'approved' WHERE status = 'pending'");
  const result = update.run();
  return result.changes;
}
