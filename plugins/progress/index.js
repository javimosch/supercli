#!/usr/bin/env node
const { spawn } = require('child_process');

const [,, cmd, ...args] = process.argv;

function usage() {
  console.log(`progress — Coreutils Progress Viewer Plugin for supercli

USAGE
  progress <subcommand> [options]
  progress show    Show progress of running coreutils commands
  progress monitor Continuously monitor progress (like top)
  progress help    Show this help

EXAMPLES
  progress show
  progress monitor
  progress show --wait
  progress show --monitor --quiet
`);
}

if (!cmd || cmd === 'help' || cmd === '--help') {
  usage();
  process.exit(0);
}

const child = spawn('progress', [cmd, ...args], { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 1));
