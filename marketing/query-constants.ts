#!/usr/bin/env bun
/**
 * Filtering constants for query generation
 */

export const CATEGORY_KEYWORDS = [
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'devops', 
  'security', 'database', 'api', 'testing', 'build', 'deployment',
  'monitoring', 'logging', 'network', 'storage', 'backup', 'git',
  'package', 'dependency', 'code', 'performance', 'debugging',
  'automation', 'ci', 'cd', 'container', 'serverless', 'microservices',
  'observability', 'messaging', 'email', 'task', 'note', 'knowledge',
  'project', 'team', 'communication', 'video', 'remote', 'vpn',
  'proxy', 'dns', 'security', 'compliance', 'data', 'machine',
  'ai', 'natural', 'computer', 'speech', 'text', 'translation',
  'content', 'web', 'application', 'service', 'mesh', 'gateway',
  'cache', 'search', 'warehouse', 'pipeline', 'workflow',
  'orchestration', 'scheduling', 'process', 'discovery', 'configuration',
  'secret', 'key', 'certificate', 'identity', 'authentication',
  'authorization', 'audit'
];

export const SKIP_WORDS = [
  'javascript', 'typescript', 'python', 'golang', 'rust', 'java', 'node', 'bun', 'npm', 'your', 'state', 'order', 'client', 'server', 'before', 'after', 'during', 'while', 'when', 'retrieve', 'the', 'and', 'for', 'with', 'from', 'this', 'that', 'use', 'run', 'install', 'plugin', 'tool', 'cli', 'command'
];

export const NOISE_PATTERNS = [
  '→', 'step', 'agent-facing', 'skill.md', 'persisted plan',
  'your', 'with', 'for', 'from', 'this', 'that', 'the', 'and',
  'retrieve', 'before', 'after', 'during', 'while', 'when',
  'use', 'using', 'install', 'run', 'execute'
];
