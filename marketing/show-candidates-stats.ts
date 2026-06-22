#!/usr/bin/env bun
/**
 * Show Plugin Candidates Database Stats
 * 
 * This script displays statistics about the plugin candidates database.
 */

import { Database } from "bun:sqlite";
import { join } from "path";

const DB_PATH = join(import.meta.dir, "plugin-candidates.db");

function showStats() {
  const db = new Database(DB_PATH);
  
  try {
    const existingCount = db.prepare("SELECT COUNT(*) as count FROM existing_plugins").get() as { count: number };
    const candidatesCount = db.prepare("SELECT COUNT(*) as count FROM plugin_candidates").get() as { count: number };
    const pendingCount = db.prepare("SELECT COUNT(*) as count FROM plugin_candidates WHERE status = 'pending'").get() as { count: number };
    const approvedCount = db.prepare("SELECT COUNT(*) as count FROM plugin_candidates WHERE status = 'approved'").get() as { count: number };
    
    // Top categories by search query
    const topCategories = db.prepare(`
      SELECT search_query as category, COUNT(*) as count 
      FROM plugin_candidates 
      WHERE search_query IS NOT NULL 
      GROUP BY search_query 
      ORDER BY count DESC 
      LIMIT 10
    `).all() as { category: string; count: number }[];
    
    // Top languages
    const topLanguages = db.prepare(`
      SELECT language, COUNT(*) as count 
      FROM plugin_candidates 
      WHERE language IS NOT NULL 
      GROUP BY language 
      ORDER BY count DESC 
      LIMIT 10
    `).all() as { language: string; count: number }[];
    
    // Star distribution
    const starDistribution = db.prepare(`
      SELECT 
        CASE 
          WHEN stars >= 10000 THEN '10k+'
          WHEN stars >= 1000 THEN '1k-10k'
          WHEN stars >= 100 THEN '100-1k'
          WHEN stars >= 10 THEN '10-100'
          WHEN stars > 0 THEN '1-10'
          ELSE '0'
        END as star_range,
        COUNT(*) as count
      FROM plugin_candidates 
      GROUP BY star_range 
      ORDER BY star_range
    `).all() as { star_range: string; count: number }[];
    
    // Recent additions
    const recentAdditions = db.prepare(`
      SELECT name, description, stars, added_at 
      FROM plugin_candidates 
      ORDER BY added_at DESC 
      LIMIT 10
    `).all() as { name: string; description: string; stars: number; added_at: string }[];
    
    console.log("\n=== Plugin Candidates Database Stats ===\n");
    console.log(`Existing supercli plugins: ${existingCount.count}`);
    console.log(`Plugin candidates: ${candidatesCount.count}`);
    console.log(`Pending candidates: ${pendingCount.count}`);
    console.log(`Approved candidates: ${approvedCount.count}`);
    console.log(`Unique new tools discovered: ${candidatesCount.count}\n`);
    
    console.log("=== Top Categories ===");
    topCategories.forEach((cat, i) => {
      console.log(`${i + 1}. ${cat.category}: ${cat.count} candidates`);
    });
    
    console.log("\n=== Top Languages ===");
    topLanguages.forEach((lang, i) => {
      console.log(`${i + 1}. ${lang.language}: ${lang.count} candidates`);
    });
    
    console.log("\n=== Star Distribution ===");
    starDistribution.forEach((dist) => {
      console.log(`${dist.star_range} ⭐: ${dist.count} candidates`);
    });
    
    console.log("\n=== Recent Additions ===");
    recentAdditions.forEach((candidate) => {
      console.log(`• ${candidate.name} (${candidate.stars} ⭐) - ${candidate.description.substring(0, 60)}...`);
    });
  } finally {
    db.close();
  }
}

showStats();