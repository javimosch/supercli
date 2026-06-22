#!/usr/bin/env bun
/**
 * Skills digestion utilities
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const AGENTS_SKILLS_PATH = join(import.meta.dir, "..", ".agents", "skills");
const DEVIN_SKILLS_PATH = join(import.meta.dir, "..", ".devin", "skills");
const PLUGINS_DUMP_PATH = join(import.meta.dir, "plugins-dump.json");

export interface SkillsDigest {
  cliCategories: string[];
  mentionedTools: string[];
  technologyStacks: string[];
  pluginTags: string[];
  workflowPatterns: string[];
}

export function digestSupercliSkills(): SkillsDigest {
  const digest: SkillsDigest = {
    cliCategories: [],
    mentionedTools: [],
    technologyStacks: [],
    pluginTags: [],
    workflowPatterns: []
  };

  const skillDirs = [AGENTS_SKILLS_PATH, DEVIN_SKILLS_PATH];

  for (const skillsPath of skillDirs) {
    if (!existsSync(skillsPath)) continue;

    const skillNames = readdirSync(skillsPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const skillName of skillNames) {
      const skillPath = join(skillsPath, skillName, "SKILL.md");
      if (!existsSync(skillPath)) continue;

      try {
        const content = readFileSync(skillPath, "utf-8");
        analyzeSkillContent(content, digest);
      } catch (error) {
        console.log(`Warning: Could not read skill ${skillName}:`, error);
      }
    }
  }

  if (existsSync(PLUGINS_DUMP_PATH)) {
    try {
      const pluginsDump = JSON.parse(readFileSync(PLUGINS_DUMP_PATH, "utf-8"));
      for (const plugin of pluginsDump) {
        if (plugin.tags && Array.isArray(plugin.tags)) {
          for (const tag of plugin.tags) {
            if (tag && typeof tag === 'string' && tag.length > 2 && tag.length < 30) {
              if (!digest.pluginTags.includes(tag.toLowerCase())) {
                digest.pluginTags.push(tag.toLowerCase());
              }
            }
          }
        }
        
        if (plugin.description) {
          const techPatterns = [
            /\b(Docker|Kubernetes|K8s|AWS|Azure|GCP|Terraform|Ansible|Node|Python|Go|Rust|Java|TypeScript|JavaScript|React|Vue|Angular)\b/gi
          ];
          for (const pattern of techPatterns) {
            let match;
            while ((match = pattern.exec(plugin.description)) !== null) {
              const tech = match[1].trim();
              if (tech && !digest.technologyStacks.includes(tech)) {
                digest.technologyStacks.push(tech);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("Warning: Could not parse plugins dump:", error);
    }
  }

  console.log(`\n=== Skills & Plugins Digest ===`);
  console.log(`CLI Categories found: ${digest.cliCategories.length}`);
  console.log(`Mentioned Tools: ${digest.mentionedTools.length}`);
  console.log(`Technology Stacks: ${digest.technologyStacks.length}`);
  console.log(`Plugin Tags: ${digest.pluginTags.length}`);
  console.log(`Workflow Patterns: ${digest.workflowPatterns.length}`);

  return digest;
}

function analyzeSkillContent(content: string, digest: SkillsDigest): void {
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^#+\s+/gm, '')
    .replace(/→/g, '→');

  const categoryPatterns = [
    /([a-z][a-z0-9-]+)\s+(?:management|monitoring|automation|deployment|testing|build|devops|security|database|api|cloud|container|serverless|microservices|observability|network|storage|backup|sync|transfer|version|package|dependency|code|performance|debugging|logging|alerting|notification|messaging|email|calendar|task|note|knowledge|bookmark|reading|news|weather|finance|stock|trading|accounting|invoicing|time|project|team|communication|video|screen|remote|vpn|proxy|dns|port|vulnerability|penetration|forensics|incident|compliance|governance|risk|asset|inventory|procurement|vendor|contract|hr|recruiting|onboarding|training|learning|education|research|data|machine|ai|natural|computer|speech|text|translation|transcription|subtitle|caption|accessibility|localization|internationalization|content|headless|static|web|application|reverse|load|cdn|edge|function|service|mesh|gateway|message|event|cache|search|warehouse|lake|etl|elt|pipeline|workflow|orchestration|scheduling|job|process|discovery|configuration|secret|key|certificate|identity|access|authentication|authorization|audit)\s*(?:\n|\.|,)/gi
  ];

  for (const pattern of categoryPatterns) {
    let match;
    while ((match = pattern.exec(cleanContent)) !== null) {
      const category = match[1].trim().toLowerCase();
      const skipCategories = ['javascript', 'typescript', 'python', 'golang', 'rust', 'java', 'node', 'bun', 'npm', 'your', 'state', 'order', 'client', 'server', 'before', 'after', 'during', 'while', 'when', 'retrieve', 'the', 'and', 'for', 'with', 'from', 'this', 'that', 'use', 'run', 'install', 'plugin', 'tool', 'cli', 'command'];
      if (category && category.length > 3 && category.length < 30 && 
          !category.includes('→') && !category.includes('step') &&
          !skipCategories.includes(category) &&
          !category.includes('client') && !category.includes('server') &&
          !digest.cliCategories.includes(category)) {
        digest.cliCategories.push(category);
      }
    }
  }

  const toolPatterns = [
    /\b([a-z][a-z0-9-]{3,20})\s+(?:cli|command|tool)\b/gi,
    /(?:install|use|run|execute)\s+([a-z][a-z0-9-]{3,20})\b/gi,
    /plugin:\s*([a-z][a-z0-9-]{3,20})\b/gi
  ];

  for (const pattern of toolPatterns) {
    let match;
    while ((match = pattern.exec(cleanContent)) !== null) {
      const tool = match[1].trim().toLowerCase();
      const skipWords = ['the', 'and', 'for', 'with', 'from', 'this', 'that', 'use', 'run', 'npm', 'node', 'bun', 'install', 'plugin', 'tool', 'cli', 'command', 'your', 'state', 'order', 'client', 'server', 'before', 'after', 'during', 'while', 'when', 'retrieve', 'javascript', 'typescript', 'python', 'golang', 'rust', 'java'];
      if (tool && tool.length > 3 && tool.length < 20 && 
          !skipWords.includes(tool) && 
          !tool.includes('→') && !tool.includes('step') &&
          !tool.includes('client') && !tool.includes('server') &&
          !digest.mentionedTools.includes(tool)) {
        digest.mentionedTools.push(tool);
      }
    }
  }

  const techPatterns = [
    /\b(Docker|Kubernetes|K8s|AWS|Azure|GCP|Terraform|Ansible|Node|Python|Go|Rust|Java|TypeScript|JavaScript)\b/gi,
    /\b(MCP|HTTP|SSE|JSON|JSON-RPC|stdio)\b/gi
  ];

  for (const pattern of techPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const tech = match[1].trim();
      if (tech && !digest.technologyStacks.includes(tech)) {
        digest.technologyStacks.push(tech);
      }
    }
  }

  const tagPatterns = [
    /tags:\s*\[([^\]]+)\]/gi,
    /tags:\s*([a-z][a-z0-9,\s-]+)/gi
  ];

  for (const pattern of tagPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const tagContent = match[1];
      const tags = tagContent.split(/[,,\]]/).map(t => t.trim().toLowerCase()).filter(t => t.length > 2 && t.length < 30);
      for (const tag of tags) {
        if (!digest.pluginTags.includes(tag) && !tag.includes('→')) {
          digest.pluginTags.push(tag);
        }
      }
    }
  }

  const workflowPatterns = [
    /(?:workflow|pattern|process):\s*([a-z][a-z0-9\s-]+?)(?:\n|\.|,)/gi
  ];

  for (const pattern of workflowPatterns) {
    let match;
    while ((match = pattern.exec(cleanContent)) !== null) {
      const workflow = match[1].trim();
      if (workflow && workflow.length > 3 && workflow.length < 50 && 
          !workflow.includes('→') && !workflow.includes('step') &&
          !digest.workflowPatterns.includes(workflow)) {
        digest.workflowPatterns.push(workflow);
      }
    }
  }
}
