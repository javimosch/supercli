#!/usr/bin/env bun
/**
 * Find Plugin Candidates via GitHub Search
 * 
 * This script digests supercli global skills to understand CLI categories and patterns,
 * then searches GitHub for popular CLI tools that aren't yet in supercli
 * and adds them to the plugin candidates database in batches of 5.
 */

import { Database } from "bun:sqlite";
import { 
  initDatabase, 
  loadExistingPlugins, 
  addPluginCandidate, 
  getStats,
  markAllCandidatesApproved,
  type DatabaseStats 
} from "./database";
import { digestSupercliSkills } from "./skills-digest";
import { searchGitHub } from "./github-search";
import { generateSearchQueries } from "./query-generator";

async function findCandidatesInBatches(batchSize: number = 5, targetCount: number = 1000) {
  console.log("=== Starting Plugin Candidate Discovery ===");
  
  const db = initDatabase();
  
  try {
    // Step 0: Initialize database and load existing plugins
    console.log("\nStep 0: Initializing database and loading existing plugins...");
    loadExistingPlugins(db);
    
    // Step 1: Digest supercli global skills
    console.log("\nStep 1: Digesting supercli global skills...");
    const skillsDigest = digestSupercliSkills();
    
    // Step 2: Generate search queries based on skills
    console.log("\nStep 2: Generating search queries from skills digest...");
    const SEARCH_QUERIES = generateSearchQueries(skillsDigest);
    console.log(`Generated ${SEARCH_QUERIES.length} search queries from skills digest`);
    
    // Step 3: Search GitHub and add candidates
    console.log("\nStep 3: Searching GitHub for plugin candidates...");
    
    const initialStats = getStats(db);
    console.log(`Starting with ${initialStats.candidates} existing candidates`);
    
    let totalAdded = 0;
    let queryIndex = 0;
    
    while (queryIndex < SEARCH_QUERIES.length) {
      // Check if we've reached the target
      const currentStats = getStats(db);
      if (currentStats.candidates >= targetCount) {
        console.log(`\n✓ Target reached: ${currentStats.candidates} candidates`);
        break;
      }
      
      const query = SEARCH_QUERIES[queryIndex];
      console.log(`\n=== Searching for: "${query}" ===`);
      
      const repos = await searchGitHub(query, 50);
      console.log(`Found ${repos.length} repositories`);
      
      let batchAdded = 0;
      for (const repo of repos) {
        // Check before adding each candidate to avoid exceeding target
        const statsBeforeAdd = getStats(db);
        if (statsBeforeAdd.candidates >= targetCount) {
          console.log(`\n✓ Target reached: ${statsBeforeAdd.candidates} candidates`);
          break;
        }
        
        if (batchAdded >= batchSize) break;
        
        const added = addPluginCandidate(db, {
          name: repo.name,
          description: repo.description,
          source: repo.url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stars,
          search_query: query
        });
        
        if (added) {
          batchAdded++;
          totalAdded++;
        }
      }
      
      const stats = getStats(db);
      console.log(`Batch added: ${batchAdded} | Total candidates: ${stats.candidates}/${targetCount}`);
      
      queryIndex++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const finalStats = getStats(db);
    console.log(`\n=== Final Stats ===`);
    console.log(`Existing supercli plugins: ${finalStats.existing}`);
    console.log(`Plugin candidates: ${finalStats.candidates} (started with ${initialStats.candidates})`);
    console.log(`Pending candidates: ${finalStats.pending}`);
    console.log(`Total added this session: ${totalAdded}`);
    console.log(`Queries processed: ${queryIndex}/${SEARCH_QUERIES.length}`);
    
    if (finalStats.candidates >= targetCount) {
      console.log(`✓ Target of ${targetCount} candidates reached!`);
      
      // Mark all candidates as approved when target is reached
      console.log(`\nMarking all candidates as approved...`);
      const approvedCount = markAllCandidatesApproved(db);
      console.log(`✓ Marked ${approvedCount} candidates as approved`);
      
      const finalStatsAfterApproval = getStats(db);
      console.log(`Updated pending count: ${finalStatsAfterApproval.pending}`);
    } else {
      console.log(`⚠ Target of ${targetCount} candidates not yet reached (need ${targetCount - finalStats.candidates} more)`);
    }
  } finally {
    db.close();
  }
}

// Run the main function
const batchSize = process.argv[2] ? parseInt(process.argv[2]) : 5;
const targetCount = process.argv[3] ? parseInt(process.argv[3]) : 10000;

findCandidatesInBatches(batchSize, targetCount);