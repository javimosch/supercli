#!/usr/bin/env node
const { spawn } = require('child_process');
const { readFileSync, existsSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const [,, cmd, ...args] = process.argv;
const ACP_REGISTRY = 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json';

function usage() {
  console.log(`acp-cli — Agent Communication Protocol CLI

USAGE
  acp-cli <command> [options]

COMMANDS
  registry                    List all ACP agents from registry
  registry:info <agent-id>    Show details for a specific ACP agent

  session:create <agent-id>   Create a new session with an ACP agent
    --cwd <dir>               Working directory (default: .)
    --prompt <text>           Optional prompt to send after creation

  session:prompt <session-id> Send a prompt to an existing session
    --msg <text>              The prompt message
    --cwd <dir>               Working directory

  server:start <agent-npx>    Launch an ACP server via npx
    --cwd <dir>               Working directory

  help                        Show this help

EXAMPLES
  acp-cli registry
  acp-cli registry:info claude-acp
  acp-cli session:create @google/gemini-cli --prompt "Hello"
  acp-cli server:start @agentclientprotocol/claude-agent-acp
`);
}

function jsonRpc(id, method, params) {
  return JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
}

async function readJson(stream) {
  let buf = '';
  for await (const chunk of stream) {
    buf += chunk.toString();
    const lines = buf.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      try { return { line: JSON.parse(line), rest: lines.slice(i + 1).join('\n') }; }
      catch { continue; }
    }
    buf = lines[lines.length - 1];
  }
  return null;
}

async function fetchAgentInfo(agentId) {
  const http = require('http');
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(ACP_REGISTRY, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const registry = JSON.parse(data);
        const agent = registry.agents.find(a => a.id === agentId);
        resolve(agent || null);
      });
    }).on('error', reject);
  });
}

async function cmdRegistry() {
  const https = require('https');
  https.get(ACP_REGISTRY, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const registry = JSON.parse(data);
      console.log(JSON.stringify(registry.agents.map(a => ({
        id: a.id,
        name: a.name,
        version: a.version,
        description: a.description,
        type: a.distribution.binary ? 'binary' : a.distribution.npx ? 'npx' : a.distribution.uvx ? 'uvx' : 'other'
      })), null, 2));
    });
  });
}

async function cmdRegistryInfo(agentId) {
  const agent = await fetchAgentInfo(agentId);
  if (!agent) { console.log(`Agent "${agentId}" not found`); process.exit(1); }
  console.log(JSON.stringify(agent, null, 2));
}

function startAgentProcess(packageName, cwd) {
  const isNpx = !packageName.includes('/') && !packageName.endsWith('.sh') && !existsSync(packageName);
  const cmd = isNpx ? 'npx' : packageName;
  const cmdArgs = isNpx ? [packageName] : [];

  // Detect ACP args from registry
  const proc = spawn(cmd, [...cmdArgs, ...['--acp']], {
    cwd: resolve(cwd || '.'),
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
  });

  proc.on('error', err => { console.error('Failed to start agent:', err.message); process.exit(1); });
  return proc;
}

async function cmdServerStart() {
  const pkg = args[0];
  if (!pkg) { console.error('Usage: acp-cli server:start <npx-package> [--cwd <dir>]'); process.exit(1); }
  const cwdIdx = args.indexOf('--cwd');
  const cwd = cwdIdx >= 0 ? args[cwdIdx + 1] : '.';

  console.error(`Starting ACP server: npx ${pkg} --acp`);
  const proc = startAgentProcess(pkg, cwd);

  // Forward stderr
  proc.stderr.on('data', d => process.stderr.write(d));

  // Read initialize response
  const initReq = jsonRpc(1, 'initialize', {
    protocolVersion: 1,
    clientCapabilities: {
      fs: { readTextFile: true, writeTextFile: true },
      terminal: true,
      auth: { terminal: true }
    },
    clientInfo: { name: 'acp-cli', version: '0.1.0' }
  });

  proc.stdin.write(initReq);
  const initRes = await readJson(proc.stdout);
  if (initRes) {
    console.log(JSON.stringify(initRes.line, null, 2));
  }

  // Keep alive and forward any more messages
  proc.stdout.on('data', d => process.stdout.write(d));
  proc.on('exit', code => process.exit(code));
}

async function cmdSessionCreate() {
  const agentId = args[0];
  if (!agentId) { console.error('Usage: acp-cli session:create <agent-npx-package> [--prompt <text>] [--cwd <dir>]'); process.exit(1); }

  const promptIdx = args.indexOf('--prompt');
  const prompt = promptIdx >= 0 ? args[promptIdx + 1] : null;
  const cwdIdx = args.indexOf('--cwd');
  const cwd = cwdIdx >= 0 ? args[cwdIdx + 1] : '.';

  console.error(`Connecting to ACP agent: ${agentId}`);
  const proc = startAgentProcess(agentId, cwd);
  let buf = '';

  proc.stderr.on('data', d => process.stderr.write(d));

  // Initialize
  proc.stdin.write(jsonRpc(1, 'initialize', {
    protocolVersion: 1,
    clientCapabilities: {
      fs: { readTextFile: true, writeTextFile: true },
      terminal: true,
      auth: { terminal: true }
    },
    clientInfo: { name: 'acp-cli', version: '0.1.0' }
  }));

  // Read responses
  proc.stdout.on('data', async data => {
    buf += data.toString();
    const lines = buf.split('\n');
    buf = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);

        // Handle initialize response - create session
        if (msg.id === 1 && msg.result) {
          const sessionReq = jsonRpc(2, 'session/new', {
            cwd: resolve(cwd),
            mcpServers: [],
            title: 'acp-cli session'
          });
          proc.stdin.write(sessionReq);
        }
        // Handle session create response
        else if (msg.id === 2 && msg.result) {
          const sessionId = msg.result.sessionId;
          console.log(JSON.stringify({ sessionId, ...msg.result }, null, 2));

          if (prompt) {
            const promptReq = jsonRpc(3, 'session/prompt', {
              sessionId,
              prompt: [{ type: 'text', text: prompt }]
            });
            proc.stdin.write(promptReq);

            setTimeout(() => {
              console.log('\n--- prompt sent, reading response ---');
            }, 500);
          }
        }
        // Handle prompt response
        else if (msg.id === 3 && (msg.result || msg.error)) {
          console.log(JSON.stringify(msg, null, 2));
        }
        // Handle notifications (session/update)
        else if (msg.method) {
          // Stream content updates
          if (msg.params?.delta) {
            process.stdout.write(msg.params.delta);
          }
        }
        // Forward other messages
        else if (msg.result || msg.error) {
          console.log(JSON.stringify(msg, null, 2));
        }
      } catch { /* partial JSON, wait for more data */ }
    }
  });

  proc.on('exit', code => {
    process.exit(code || 0);
  });

  // Timeout cleanup
  setTimeout(() => {
    console.error('\nACP session timed out after 60s');
    proc.kill();
    process.exit(0);
  }, 60000);
}

async function main() {
  switch (cmd) {
    case 'registry':
      return cmdRegistry();
    case 'registry:info':
      return cmdRegistryInfo(args[0]);
    case 'server:start':
      return cmdServerStart();
    case 'session:create':
      return cmdSessionCreate();
    case 'help':
    case undefined:
    case null:
      return usage();
    default:
      console.error(`Unknown command: ${cmd}`);
      usage();
      process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
