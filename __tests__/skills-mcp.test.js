"use strict";

const { buildMcpServersUsageSkillMarkdown } = require("../cli/skills-mcp");

function fakeRenderYamlObject(obj) {
  return JSON.stringify(obj);
}

describe("buildMcpServersUsageSkillMarkdown", () => {
  test("wraps rendered frontmatter in --- fences followed by the instruction body", () => {
    const md = buildMcpServersUsageSkillMarkdown({ renderYamlObject: fakeRenderYamlObject });

    expect(md.startsWith("---\n")).toBe(true);
    expect(md).toContain("\n---\n\n# Instruction");
    expect(md).toContain("supercli mcp list --json");
  });

  test("omits the dag field by default", () => {
    let capturedFrontmatter;
    buildMcpServersUsageSkillMarkdown({
      renderYamlObject: (obj) => {
        capturedFrontmatter = obj;
        return "";
      },
    });

    expect(capturedFrontmatter.dag).toBeUndefined();
    expect(capturedFrontmatter.command).toBe("skills get mcp.servers.usage");
  });

  test("includes the reasoning DAG when showDag is true", () => {
    let capturedFrontmatter;
    buildMcpServersUsageSkillMarkdown({
      showDag: true,
      renderYamlObject: (obj) => {
        capturedFrontmatter = obj;
        return "";
      },
    });

    expect(Array.isArray(capturedFrontmatter.dag)).toBe(true);
    expect(capturedFrontmatter.dag).toHaveLength(4);
    expect(capturedFrontmatter.dag[0]).toMatchObject({ id: 1, type: "list_or_register_mcp_server" });
  });

  test("honors a custom skillId in both the command and dag-less frontmatter", () => {
    let capturedFrontmatter;
    buildMcpServersUsageSkillMarkdown({
      skillId: "mcp.custom.usage",
      renderYamlObject: (obj) => {
        capturedFrontmatter = obj;
        return "";
      },
    });

    expect(capturedFrontmatter.command).toBe("skills get mcp.custom.usage");
  });
});
