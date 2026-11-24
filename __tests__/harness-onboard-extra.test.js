"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

// Mock the compile module to avoid needing real skill files
jest.mock("../skills/supercli/compile", () => ({
  compileForHarness: jest.fn().mockReturnValue({ content: "# test skill", filename: "SKILL.md", skillPath: ".claude/SKILL.md" }),
  getAllHarnesses: jest.fn().mockReturnValue(["claude", "opencode", "cursor", "windsurf"]),
  HARNESS_CONFIGS: {
    claude: { dir: ".claude", file: "CLAUDE.md", skillPath: ".claude/SKILL.md" },
    opencode: { dir: ".opencode", file: "AGENTS.md", skillPath: ".opencode/SKILL.md" },
    cursor: { dir: ".cursor", file: "rules", skillPath: ".cursor/SKILL.md" },
    windsurf: { dir: ".", file: ".windsurfrules", skillPath: ".windsurfrules" },
  },
}));

const { handleHarnessOnboard, handleHarnessOffboard, detectHarnesses, parseHarnesses } = require("../cli/harness-onboard");

describe("sc harness onboard/offboard", () => {
  let output, outputError, captured;
  let tempDir;

  beforeEach(() => {
    captured = { json: null, error: null };
    output = (data) => { captured.json = data; };
    outputError = (data) => { captured.error = data; };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "harness-test-"));
  });

  afterEach(() => {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
  });

  test("detectHarnesses finds no harnesses in empty dir", () => {
    const result = detectHarnesses(tempDir);
    expect(result).toEqual([]);
  });

  test("detectHarnesses finds .claude directory", () => {
    fs.mkdirSync(path.join(tempDir, ".claude"));
    const result = detectHarnesses(tempDir);
    expect(result).toContain("claude");
  });

  test("detectHarnesses finds .opencode directory", () => {
    fs.mkdirSync(path.join(tempDir, ".opencode"));
    const result = detectHarnesses(tempDir);
    expect(result).toContain("opencode");
  });

  test("detectHarnesses finds .cursor directory", () => {
    fs.mkdirSync(path.join(tempDir, ".cursor"));
    const result = detectHarnesses(tempDir);
    expect(result).toContain("cursor");
  });

  test("detectHarnesses finds .windsurfrules file", () => {
    fs.writeFileSync(path.join(tempDir, ".windsurfrules"), "test");
    const result = detectHarnesses(tempDir);
    expect(result).toContain("windsurf");
  });

  test("detectHarnesses finds multiple harnesses", () => {
    fs.mkdirSync(path.join(tempDir, ".claude"));
    fs.mkdirSync(path.join(tempDir, ".opencode"));
    const result = detectHarnesses(tempDir);
    expect(result).toContain("claude");
    expect(result).toContain("opencode");
    expect(result.length).toBe(2);
  });

  test("parseHarnesses returns null for empty input", () => {
    expect(parseHarnesses(null)).toBe(null);
    expect(parseHarnesses(undefined)).toBe(null);
  });

  test("parseHarnesses parses comma-separated list", () => {
    const result = parseHarnesses("claude,opencode");
    expect(result).toEqual(["claude", "opencode"]);
  });

  test("parseHarnesses throws for unknown harness", () => {
    expect(() => parseHarnesses("unknown")).toThrow();
  });

  test("parseHarnesses lowercases input", () => {
    const result = parseHarnesses("CLAUDE");
    expect(result).toEqual(["claude"]);
  });

  test("handleHarnessOnboard --detect mode (JSON)", async () => {
    await handleHarnessOnboard({
      positional: ["onboard"],
      flags: { detect: true, target: tempDir },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.json).toBeTruthy();
    expect(captured.json.mode).toBe("onboard_detect");
    expect(captured.json.target).toBe(tempDir);
  });

  test("handleHarnessOnboard --detect mode (human)", async () => {
    await handleHarnessOnboard({
      positional: ["onboard"],
      flags: { detect: true, target: tempDir },
      humanMode: true,
      output,
      outputError,
    });
    // detect mode always calls output() regardless of humanMode
    expect(captured.json).toBeTruthy();
    expect(captured.json.mode).toBe("onboard_detect");
  });

  test("handleHarnessOnboard with --dry-run", async () => {
    await handleHarnessOnboard({
      positional: ["onboard"],
      flags: { harness: "claude", "dry-run": true, target: tempDir },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.json).toBeTruthy();
    expect(captured.json.mode).toBe("onboard");
  });

  test("handleHarnessOffboard with --dry-run", async () => {
    await handleHarnessOffboard({
      positional: ["offboard"],
      flags: { harness: "claude", "dry-run": true, target: tempDir },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.json).toBeTruthy();
    expect(captured.json.mode).toBe("offboard");
  });

  test("handleHarnessOnboard without --harness or --detect → error", async () => {
    await handleHarnessOnboard({
      positional: ["onboard"],
      flags: { target: tempDir },
      humanMode: false,
      output,
      outputError,
    });
    expect(captured.error).toBeTruthy();
  });
});
