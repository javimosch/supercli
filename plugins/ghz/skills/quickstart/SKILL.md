# ghz Quickstart

ghz is a gRPC load testing and benchmarking tool.

## Installation

```bash
brew install ghz
```

## Basic Usage

```bash
ghz -insecure -proto ./hello.proto -call helloworld.Greeter.SayHello localhost:50051
```

## Resources

- [GitHub](https://github.com/bojand/ghz)
- [Docs](https://ghz.sh/)
