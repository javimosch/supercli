---
name: binaryen
description: binaryen — WebAssembly toolchain. Includes wasm-opt for optimizing WASM binaries, wasm-dis/wasm-as for debugging. Essential for WASM development.
---
# binaryen
binaryen — WebAssembly toolchain. Includes wasm-opt for optimizing WASM binaries, wasm-dis/wasm-as for debugging. Essential for WASM development.

## Install
```bash
curl -LO https://github.com/WebAssembly/binaryen/releases/download/version_129/binaryen-version_129-x86_64-linux.tar.gz && tar xzf binaryen-version_129-x86_64-linux.tar.gz && sudo cp binaryen-version_129/bin/wasm-opt /usr/local/bin/ && rm -rf binaryen-version_129*
```
