#!/usr/bin/env bun
/**
 * GitHub search utilities
 */

import { execSync } from "child_process";

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  homepage: string;
}

function sanitizeQuery(query: string): string {
  return query
    .replace(/[;&|`$()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200);
}

function sanitizeLimit(limit: number): number {
  const sanitized = Math.max(1, Math.min(100, limit));
  return sanitized;
}

export async function searchGitHub(query: string, limit: number = 10, page: number = 1): Promise<GitHubRepo[]> {
  const sanitizedQuery = sanitizeQuery(query);
  const sanitizedLimit = sanitizeLimit(limit);
  
  try {
    const output = execSync(
      `gh search repos "${sanitizedQuery}" --sort stars --limit ${sanitizedLimit} --json name,description,url,stargazersCount,language,homepage`,
      { encoding: "utf-8" }
    );
    
    const repos = JSON.parse(output);
    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.url,
      stars: repo.stargazersCount,
      language: repo.language || null,
      homepage: repo.homepage || null
    }));
  } catch (error: any) {
    if (error.stderr && error.stderr.includes("rate limit")) {
      console.log(`Rate limit hit for "${sanitizedQuery}" - waiting 60s and retrying...`);
      await new Promise(resolve => setTimeout(resolve, 60000));
      try {
        const output = execSync(
          `gh search repos "${sanitizedQuery}" --sort stars --limit ${sanitizedLimit} --json name,description,url,stargazersCount,language,homepage`,
          { encoding: "utf-8" }
        );
        
        const repos = JSON.parse(output);
        return repos.map((repo: any) => ({
          name: repo.name,
          description: repo.description || "",
          url: repo.url,
          stars: repo.stargazersCount,
          language: repo.language || null,
          homepage: repo.homepage || null
        }));
      } catch (retryError) {
        console.error(`Retry failed for "${sanitizedQuery}":`, retryError);
        return [];
      }
    }
    console.error(`Error searching GitHub for "${sanitizedQuery}":`, error);
    return [];
  }
}
