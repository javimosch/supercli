#!/usr/bin/env node
const { spawn } = require('child_process');

const [,, cmd, ...args] = process.argv;

function usage() {
  console.log(`parallel — GNU Parallel Plugin for supercli

USAGE
  parallel <subcommand> [options] [args...]
  parallel run <command> [arguments...]  Run a command in parallel
  parallel help                          Show this help

SUBCOMMANDS
  run       Execute commands in parallel (passthrough to GNU parallel)

EXAMPLES
  parallel run echo ::: A B C D
  parallel run --jobs 4 gzip ::: *.log
  parallel run --progress wc -l ::: *.txt
`);
}

if (!cmd || cmd === 'help' || cmd === '--help') {
  usage();
  process.exit(0);
}

if (cmd === 'run') {
  const child = spawn('parallel', args, { stdio: 'inherit', shell: true });
  child.on('exit', (code) => process.exit(code ?? 1));
} else {
  const child = spawn('parallel', [cmd, ...args], { stdio: 'inherit', shell: true });
  child.on('exit', (code) => process.exit(code ?? 1));
}
