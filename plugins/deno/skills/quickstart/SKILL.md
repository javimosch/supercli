# Deno Quickstart

Deno is a secure TypeScript/JavaScript runtime built in Rust. It provides built-in TypeScript support, security controls, and modern tooling.

## Installation

```bash
brew install deno
```

## Basic Usage

### Run TypeScript/JavaScript file
```bash
deno run script.ts
```

### Run with permissions
```bash
deno run --allow-read --allow-net script.ts
```

### Evaluate code
```bash
deno eval "console.log('Hello')"
```

## Built-in Tools

### Format code
```bash
deno fmt src/
```

### Lint code
```bash
deno lint src/
```

### Check types
```bash
deno check script.ts
```

### Run tests
```bash
deno test test_*.ts
```

## Permissions

- `--allow-read=<PATH>` - Read files
- `--allow-write=<PATH>` - Write files
- `--allow-net=<HOSTS>` - Network access
- `--allow-env=<VARS>` - Environment variables
- `--allow-sys=<SYSCALLS>` - System calls
- `--allow-run=<PROGRAMS>` - Run external programs

## Real-world Examples

### Run HTTP server
```bash
deno run --allow-net https://deno.land/std/http/server.ts
```

### Read file
```bash
deno run --allow-read script.ts
```

### Use npm modules
```bash
deno run --node-modules-dir script.ts
```

## Resources

- [Official Site](https://deno.com/)
- [GitHub](https://github.com/denoland/deno)
- [Manual](https://deno.land/manual)
