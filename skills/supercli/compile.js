const fs = require("fs");
const path = require("path");

const SKILL_SOURCE = path.resolve(__dirname, "SKILL.md");

const HARNESS_CONFIGS = {
  claude: {
    skillPath: ".claude/skills/supercli/SKILL.md",
    format: "skill",
  },
  opencode: {
    skillPath: ".opencode/skills/supercli/SKILL.md",
    format: "skill",
  },
  agents: {
    skillPath: ".agents/skills/supercli/SKILL.md",
    format: "skill",
  },
  cursor: {
    skillPath: ".cursor/rules/supercli.mdc",
    format: "mdc",
  },
  windsurf: {
    skillPath: ".windsurfrules",
    format: "windsurf",
  },
};

function readSkillSource() {
  if (!fs.existsSync(SKILL_SOURCE)) {
    throw new Error(`Skill source not found: ${SKILL_SOURCE}`);
  }
  return fs.readFileSync(SKILL_SOURCE, "utf-8");
}

function formatForHarness(harness, content) {
  const config = HARNESS_CONFIGS[harness];
  if (!config) {
    throw new Error(`Unknown harness: ${harness}`);
  }

  switch (config.format) {
    case "skill":
      return content;
    case "mdc":
      return formatMdc(content);
    case "windsurf":
      return formatWindsurf(content);
    default:
      return content;
  }
}

function stripFrontmatter(content) {
  const lines = content.split("\n");
  if (lines[0].trim() !== "---") return content;

  const output = [];
  let inFrontmatter = true;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      inFrontmatter = false;
      continue;
    }
    if (!inFrontmatter) {
      output.push(lines[i]);
    }
  }
  return output.join("\n");
}

function formatMdc(content) {
  const body = stripFrontmatter(content);
  const yamlFrontmatter = `---
description: SuperCLI capability router - discover and execute CLI commands through namespace.resource.action interface
globs: ["**/*"]
always_apply: false
---
`;
  return yamlFrontmatter + body;
}

function formatWindsurf(content) {
  const lines = content.split("\n");
  const output = [];
  let inFrontmatter = false;

  for (const line of lines) {
    if (line.trim() === "---") {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (!inFrontmatter) {
      output.push(line);
    }
  }

  return output.join("\n").trim() + "\n";
}

function getSkillPath(harness) {
  const config = HARNESS_CONFIGS[harness];
  if (!config) {
    throw new Error(`Unknown harness: ${harness}`);
  }
  return config.skillPath;
}

function getAllHarnesses() {
  return Object.keys(HARNESS_CONFIGS);
}

function compileForHarness(harness) {
  const content = readSkillSource();
  const formatted = formatForHarness(harness, content);
  const skillPath = getSkillPath(harness);
  return { harness, skillPath, content: formatted };
}

module.exports = {
  compileForHarness,
  formatForHarness,
  getAllHarnesses,
  getSkillPath,
  readSkillSource,
  HARNESS_CONFIGS,
};
