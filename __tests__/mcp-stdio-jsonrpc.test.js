const EventEmitter = require("events");
const { spawn } = require("child_process");
const {
  shouldUseStdioJsonRpc,
  stdioListToolsJsonRpc,
  stdioCallToolJsonRpc,
} = require("../cli/mcp-stdio-jsonrpc");

jest.mock("child_process");

function frame(obj) {
  const body = JSON.stringify(obj);
  return `Content-Length: ${Buffer.byteLength(body, "utf-8")}\r\n\r\n${body}`;
}

describe("mcp-stdio-jsonrpc", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("detects mcp-remote args for JSON-RPC mode", () => {
    expect(shouldUseStdioJsonRpc({ args: ["mcp-remote", "https://x"] })).toBe(true);
    expect(shouldUseStdioJsonRpc({ commandArgs: ["mcp-remote"] })).toBe(true);
    expect(shouldUseStdioJsonRpc({ args: ["node"] })).toBe(false);
  });

  test("lists tools via stdio JSON-RPC", async () => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.stdin = {
      write: jest.fn((data) => {
        if (String(data).includes('"method":"initialize"')) {
          child.stdout.emit(
            "data",
            Buffer.from(frame({ jsonrpc: "2.0", id: 1, result: { capabilities: {} } })),
          );
        }
        if (String(data).includes('"method":"tools/list"')) {
          child.stdout.emit(
            "data",
            Buffer.from(
              frame({
                jsonrpc: "2.0",
                id: 2,
                result: { tools: [{ name: "navigate", description: "Go" }] },
              }),
            ),
          );
        }
      }),
      end: jest.fn(),
    };
    child.kill = jest.fn();
    spawn.mockReturnValue(child);

    const out = await stdioListToolsJsonRpc({
      command: "npx",
      args: ["mcp-remote", "https://api.browser-use.com/mcp"],
      timeoutMs: 2000,
    });
    expect(out.tools).toHaveLength(1);
    expect(out.tools[0].name).toBe("navigate");
  });

  test("calls tool via stdio JSON-RPC", async () => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.stdin = {
      write: jest.fn((data) => {
        if (String(data).includes('"method":"initialize"')) {
          child.stdout.emit(
            "data",
            Buffer.from(frame({ jsonrpc: "2.0", id: 1, result: { capabilities: {} } })),
          );
        }
        if (String(data).includes('"method":"tools/call"')) {
          child.stdout.emit(
            "data",
            Buffer.from(
              frame({
                jsonrpc: "2.0",
                id: 2,
                result: { content: [{ type: "text", text: "ok" }] },
              }),
            ),
          );
        }
      }),
      end: jest.fn(),
    };
    child.kill = jest.fn();
    spawn.mockReturnValue(child);

    const out = await stdioCallToolJsonRpc({
      command: "npx",
      args: ["mcp-remote", "https://api.browser-use.com/mcp"],
      timeoutMs: 2000,
      tool: "navigate",
      input: { url: "https://example.com" },
    });
    expect(out).toEqual({ content: [{ type: "text", text: "ok" }] });
  });
});
