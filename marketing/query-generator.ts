#!/usr/bin/env bun
/**
 * Query generation from skills digest
 */

import type { SkillsDigest } from "./skills-digest";
import { GENERAL_QUERIES } from "./query-general";
import { LANGUAGES, FRAMEWORKS, TOOLS } from "./query-tech";
import { CLI_PATTERNS, ACTIONS } from "./query-patterns";
import { CATEGORY_KEYWORDS, SKIP_WORDS, NOISE_PATTERNS } from "./query-constants";

export function generateSearchQueries(digest: SkillsDigest): string[] {
  const queries: string[] = [];

  addCategoryQueries(digest, queries);
  addTechStackQueries(digest, queries);
  addTagQueries(digest, queries);
  addToolQueries(digest, queries);
  addLanguageQueries(queries);
  addFrameworkQueries(queries);
  addToolSpecificQueries(queries);
  addCliPatternQueries(queries);
  addActionQueries(queries);
  addGeneralQueries(queries);

  return deduplicateAndFilter(queries);
}

function addCategoryQueries(digest: SkillsDigest, queries: string[]): void {
  for (const category of digest.cliCategories) {
    if (isValidCategory(category)) {
      queries.push(`${category} CLI`);
    }
  }
}

function addTechStackQueries(digest: SkillsDigest, queries: string[]): void {
  for (const tech of digest.technologyStacks) {
    queries.push(`${tech} CLI`);
    queries.push(`${tech} command line`);
  }
}

function addTagQueries(digest: SkillsDigest, queries: string[]): void {
  const highFrequencyTags = digest.pluginTags.filter(tag => {
    return tag.length > 3 && tag.length < 25 && 
           !tag.includes('→') && !tag.includes('step') &&
           !['cli', 'tool', 'command', 'plugin', 'install', 'use', 'run'].includes(tag) &&
           CATEGORY_KEYWORDS.some(keyword => tag.includes(keyword));
  });

  for (const tag of highFrequencyTags.slice(0, 200)) {
    queries.push(`${tag} CLI`);
  }
}

function addToolQueries(digest: SkillsDigest, queries: string[]): void {
  for (const tool of digest.mentionedTools.slice(0, 46)) {
    if (isValidTool(tool)) {
      queries.push(`${tool} CLI`);
    }
  }
}

function addLanguageQueries(queries: string[]): void {
  for (const lang of LANGUAGES) {
    queries.push(`${lang} CLI`);
    queries.push(`${lang} command line`);
    queries.push(`${lang} tool`);
  }
}

function addFrameworkQueries(queries: string[]): void {
  for (const fw of FRAMEWORKS) {
    queries.push(`${fw} CLI`);
  }
}

function addToolSpecificQueries(queries: string[]): void {
  for (const tool of TOOLS) {
    queries.push(`${tool} CLI`);
  }
}

function addCliPatternQueries(queries: string[]): void {
  for (const pattern of CLI_PATTERNS) {
    queries.push(pattern);
  }
}

function addActionQueries(queries: string[]): void {
  for (const action of ACTIONS) {
    queries.push(`${action} CLI`);
  }
}

function addGeneralQueries(queries: string[]): void {
  for (const query of GENERAL_QUERIES) {
    if (!queries.includes(query)) {
      queries.push(query);
    }
  }
}

function isValidCategory(category: string): boolean {
  return category.length > 3 && category.length < 30 && 
         !category.includes('→') && !category.includes('step') &&
         !SKIP_WORDS.includes(category) &&
         !category.includes('client') && !category.includes('server');
}

function isValidTool(tool: string): boolean {
  return tool.length > 3 && tool.length < 20 && 
         !tool.includes('→') && !tool.includes('step') &&
         !SKIP_WORDS.includes(tool) &&
         !tool.includes('client') && !tool.includes('server');
}

function deduplicateAndFilter(queries: string[]): string[] {
  const uniqueQueries = [...new Set(queries)]
    .filter(q => {
      const lowerQ = q.toLowerCase();
      
      return !NOISE_PATTERNS.some(pattern => lowerQ.includes(pattern)) &&
             q.length > 5 && q.length < 50 &&
             q.split(' ').length <= 3;
    })
    .slice(0, 5000);

  return uniqueQueries;
}
