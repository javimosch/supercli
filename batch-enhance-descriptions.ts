#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";

interface Plugin {
  name: string;
  description: string;
  tags: string[];
  source: string;
  installSteps: string[];
}

interface Enhancement {
  name: string;
  current: string;
  suggested: string;
  confidence: number;
}

// Tag category templates for common tag words
const TAG_TEMPLATES: Record<string, string> = {
  "utility": "command-line utility",
  "utilities": "utility toolset",
  "system": "system administration tool",
  "network": "networking and connectivity tool",
  "networking": "networking tool",
  "testing": "testing and analysis tool",
  "tests": "testing tool",
  "test": "testing utility",
  "x11": "X11 graphical utility",
  "email": "email client and utility",
  "editor": "text editor",
  "language": "programming language tool",
  "dev": "software development tool",
  "development": "development tool",
  "python": "Python programming utility",
  "node": "Node.js development tool",
  "javascript": "JavaScript development tool",
  "cli": "command-line interface tool",
  "media": "media processing tool",
  "kubernetes": "Kubernetes container orchestration tool",
  "k8s": "Kubernetes tool",
  "security": "security and auditing tool",
  "database": "database management tool",
  "db": "database tool",
  "monitoring": "system monitoring tool",
  "encoding": "encoding and decoding utility",
  "encryption": "encryption and security utility",
  "productivity": "productivity tool",
  "golang": "Go language utility",
  "go": "Go programming tool",
  "android": "Android development tool",
  "java": "Java development tool",
  "rust": "Rust programming tool",
  "music": "music and audio tool",
  "audio": "audio processing tool",
  "video": "video processing tool",
  "git": "Git version control tool",
  "docker": "Docker container tool",
  "aws": "Amazon Web Services tool",
  "cloud": "cloud computing tool",
  "compression": "compression and archiving utility",
  "archive": "archiving utility",
  "backup": "backup and restore tool",
  "terminal": "terminal emulator",
  "font": "font management tool",
  "theme": "theme management tool",
  "image": "image processing tool",
  "images": "image processing tool",
  "ascii": "ASCII art and text utility",
  "documents": "document processing tool",
  "documentation": "documentation tool",
  "pdf": "PDF processing tool",
  "markdown": "Markdown processing tool",
  "json": "JSON processing tool",
  "xml": "XML processing tool",
  "css": "CSS and styling tool",
  "html": "HTML processing tool",
  "browser": "web browser tool",
  "web": "web development tool",
  "api": "API development tool",
  "server": "server management tool",
  "proxy": "proxy and tunneling tool",
  "vpn": "VPN and networking tool",
  "dns": "DNS management tool",
  "ssh": "SSH and remote access tool",
  "automation": "automation tool",
  "build": "build and compilation tool",
  "package": "package management tool",
  "packages": "package manager",
  "plugin": "plugin management tool",
  "config": "configuration management tool",
  "logging": "logging and observability tool",
  "analytics": "analytics and data tool",
  "ai": "AI and machine learning tool",
  "ml": "machine learning tool",
  "data": "data processing tool",
  "scraping": "web scraping tool",
  "search": "search and indexing tool",
  "linting": "code linting and quality tool",
  "linter": "code linting tool",
  "formatter": "code formatting tool",
  "debug": "debugging tool",
  "profiling": "profiling and performance tool",
  "benchmark": "benchmarking tool",
  "converter": "file format conversion tool",
  "convert": "file conversion utility",
  "generator": "code and file generation tool",
  "template": "templating engine",
  "render": "rendering engine",
  "game": "game development tool",
  "gamedev": "game development tool",
  "blockchain": "blockchain and Web3 tool",
  "crypto": "cryptocurrency tool",
  "hardware": "hardware tool",
  "embedded": "embedded systems tool",
  "iot": "IoT development tool",
  "science": "scientific computing tool",
  "math": "mathematical tool",
  "geo": "geospatial tool",
  "maps": "mapping and GIS tool",
  "font-utils": "font utility",
  "input": "input method utility",
  "display": "display management tool",
  "window": "window management tool",
  "wm": "window manager tool",
};

// Comprehensive description knowledge base
const DESCRIPTIONS: Record<string, string> = {
  // Shells
  "bash": "GNU Bash — portable shell interpreter with scripting capabilities",
  "zsh": "Zsh — advanced shell with interactive features and scripting",
  "fish": "Fish shell — user-friendly shell with intuitive syntax",
  "ksh": "Korn Shell — POSIX shell with C-like syntax",
  "tcsh": "Tcsh — C shell with command-line editing and history",
  "mksh": "mksh — lightweight POSIX shell implementation",
  "xonsh": "Xonsh — Python-powered shell blending shell and Python",
  "nushell": "Nushell — structured shell language for modern development",
  "ash": "Ash — lightweight POSIX-compliant shell",
  "dash": "Dash — POSIX-compliant shell optimized for speed",
  "elvish": "Elvish — expressive scripting language and interactive shell",

  // Version Control & Development
  "git-cliff": "git-cliff — automated changelog generator from git history",
  "git": "Git — distributed version control system for code",
  "gh": "GitHub CLI — command-line interface for GitHub operations",
  "git-secret": "git-secret — encrypt sensitive files in git repositories",
  "git-sweep": "git-sweep — clean up merged git branches automatically",
  "git-when-merged": "git-when-merged — find when a commit was merged into git history",
  "gitbook": "GitBook — documentation platform CLI for publishing docs",
  "gitsu": "gitsu — switch git user configuration per directory",

  // Search & Navigation
  "ripgrep-all": "ripgrep-all — search documents with ripgrep backend",
  "rg-all": "ripgrep-all variant — enhanced search across file types",
  "zoxide": "Zoxide — smart directory jumper with frecency tracking",
  "fzf": "fzf — command-line fuzzy finder for interactive filtering",
  "ag": "The Silver Searcher — fast code search tool similar to ack",
  "ack": "Ack — grep-like source code search tool",
  "sift": "sift — fast grep alternative for large codebases",
  "ugrep": "ugrep — ultra-fast grep with Unicode and fuzzy search support",

  // Terminal Tools
  "tldr": "tldr — simplified man pages with practical examples",
  "hyperfine": "Hyperfine — command benchmarking tool for performance testing",
  "watchexec": "Watchexec — runs commands on file system changes",
  "peco": "Peco — simple interactive filter for shell piping",
  "sk": "Skim — fuzzy finder written in Rust for speed",
  "tmux": "tmux — terminal multiplexer for managing multiple shell sessions",
  "byobu": "Byobu — enhanced terminal multiplexer wrapper for tmux or screen",
  "ranger": "ranger — terminal file manager with vi key bindings",
  "lf": "lf — terminal file manager written in Go",
  "nnn": "nnn — lightweight terminal file manager and disk usage analyzer",
  "broot": "broot — terminal file manager with tree navigation and fuzzy search",
  "htop": "htop — interactive process viewer for Unix systems",

  // Package Managers & Build
  "cargo": "Cargo — Rust package manager and build system",
  "npm": "npm — Node.js package manager for JavaScript",
  "pnpm": "pnpm — fast npm alternative with disk efficiency",
  "poetry": "Poetry — Python dependency management and packaging",
  "cargo-watch": "cargo-watch — watches files and rebuilds on changes",
  "cargo-tree": "cargo-tree — displays dependency tree for Rust projects",
  "wasm-pack": "wasm-pack — tool for building Rust WebAssembly projects",
  "yarn": "Yarn — fast and reliable JavaScript package manager",
  "npx": "npx — Node.js package runner for executing npm packages",
  "pip3": "pip3 — Python package installer for Python 3",
  "gem": "gem — RubyGems package manager for Ruby libraries",
  "cabal": "Cabal — Haskell build system and package manager",
  "stack": "Stack — Haskell build tool for reproducible builds",
  "opam": "opam — OCaml package manager for managing OCaml libraries",
  "conan": "Conan — C/C++ package manager for open source dependencies",
  "vcpkg": "vcpkg — C++ package manager for Windows, Linux, and macOS",
  "gradle": "Gradle — build automation tool for multi-language projects",
  "mvn": "Apache Maven — build and project management tool for Java",
  "sbt": "sbt — interactive build tool for Scala and Java projects",
  "ant": "Apache Ant — Java library and command-line build tool",
  "lein": "Leiningen — Clojure build automation and project management tool",
  "mix": "Mix — Elixir build tool for compiling and testing projects",
  "bundle": "Bundler — Ruby dependency manager for managing gem dependencies",
  "nix": "Nix — purely functional package manager for reproducible builds",
  "guix": "GNU Guix — transactional package manager for GNU/Linux",
  "flatpak": "Flatpak — application sandboxing and distribution for Linux",
  "snap": "Snap — snap package manager for Linux application distribution",
  "scoop": "Scoop — Windows package manager for command-line applications",
  "port": "MacPorts — package manager for macOS open-source software",
  "brew-bundle": "brew-bundle — Homebrew extension for managing Brewfile dependencies",
  "brew-cask": "brew-cask — Homebrew extension for installing macOS GUI applications",

  // Data & Serialization
  "serde": "Serde — serialization framework for Rust",
  "toml": "TOML — configuration file format parser",
  "yaml": "YAML — human-friendly data serialization format",
  "serde-json": "serde-json — JSON serialization for Rust",
  "ron": "RON — Rusty Object Notation serialization format",
  "jq": "jq — command-line JSON processor and query tool",
  "protoc": "protoc — Protocol Buffers compiler for serializing structured data",
  "capnp": "Cap'n Proto — fast data serialization format and RPC framework",
  "avro-tools": "Avro-tools — Apache Avro data serialization utilities",
  "msgpack": "MessagePack — efficient binary serialization format",
  "flatc": "flatc — FlatBuffers schema compiler for serialization",

  // Testing & Quality
  "proptest": "proptest — property-based testing framework for Rust",
  "quickcheck": "quickcheck — property-based testing for Rust",
  "criterion": "criterion — benchmarking library for Rust",
  "nextest": "nextest — next-generation test runner for Rust",
  "pytest": "pytest — Python testing framework for unit and functional tests",
  "jest": "Jest — JavaScript testing framework for unit and integration tests",
  "cypress": "Cypress — end-to-end testing framework for modern web applications",
  "playwright": "Playwright — browser automation testing for cross-browser web apps",
  "selenium": "Selenium — browser automation framework for web application testing",
  "locust": "Locust — scalable load testing framework for web applications",
  "artillery": "Artillery — load testing toolkit for HTTP and WebSocket services",
  "boom": "boom — HTTP load generator for benchmarking web applications",
  "wrk": "wrk — HTTP benchmarking tool for measuring web server performance",
  "flake8": "flake8 — Python code style checker and linting tool",
  "clippy": "Clippy — Rust linter for catching common mistakes and improving code",
  "golint": "golint — Go linter for style and convention enforcement",
  "gosec": "gosec — Go security checker for finding vulnerabilities in code",
  "staticcheck": "staticcheck — Go static analysis for bugs and performance issues",
  "revive": "revive — faster Go linter with configurable rule sets",
  "cargo-nextest": "cargo-nextest — next-generation Rust test runner with rich output",
  "cargo-criterion": "cargo-criterion — Rust benchmark runner with HTML report generation",

  // Async & Concurrency
  "tokio": "Tokio — async runtime for Rust applications",
  "async-std": "async-std — async/await for Rust",

  // Parsing & Language Tools
  "tree-sitter": "Tree-sitter — incremental parsing system for programming languages",
  "lalrpop": "LALRPOP — LR parser generator for Rust",
  "nom": "nom — parser combinator library for Rust",
  "nom-derive": "nom-derive — derive macros for nom parsers",

  // Web & Networking
  "surf": "Surf — async HTTP client library for Rust",
  "httpie": "HTTPie — user-friendly HTTP client for command line",
  "curl": "curl — command-line tool for transferring data with URL syntax",
  "wget": "GNU Wget — non-interactive download tool for HTTP and FTP retrieval",
  "wget2": "Wget2 — next-generation download tool with multi-threaded support",
  "nginx": "nginx — high-performance HTTP server and reverse proxy",
  "apache": "Apache HTTP Server — robust web server for hosting websites",
  "haproxy": "HAProxy — TCP/HTTP load balancer for high-availability services",
  "traefik": "Traefik — cloud-native reverse proxy and load balancer",
  "squid": "Squid — caching and forwarding web proxy for HTTP traffic",
  "httrack": "HTTrack — website copier for offline browsing and mirroring",
  "aria2c": "Aria2 — lightweight download utility supporting HTTP and BitTorrent",
  "axel": "Axel — download accelerator for faster file downloads over HTTP",
  "youtube-dl": "youtube-dl — command-line program to download videos from YouTube",
  "gallery-dl": "gallery-dl — media downloader for image galleries and sites",

  // Cloud & Infrastructure
  "nomad": "Nomad — workload orchestrator across datacenters",
  "docker": "Docker — containerization platform for application deployment",
  "kubernetes": "Kubernetes — container orchestration for scalable deployments",
  "libp2p": "libp2p — peer-to-peer networking library",
  "consul": "Consul — service networking for service discovery and configuration",
  "vault": "Vault — HashiCorp secrets management for sensitive data protection",
  "packer": "Packer — HashiCorp image builder for creating machine images",
  "terraform": "Terraform — infrastructure as code for provisioning cloud resources",
  "pulumi": "Pulumi — infrastructure as code using general-purpose programming languages",
  "seal": "Seal — cloud infrastructure management tool",
  "helm": "Helm — Kubernetes package manager for deploying applications",
  "helmfile": "helmfile — declarative Helm chart management for Kubernetes",
  "kubectl": "kubectl — Kubernetes command-line tool for cluster management",
  "kustomize": "kustomize — Kubernetes configuration customization without templates",
  "krew": "krew — kubectl plugin manager for extending Kubernetes CLI",
  "kubescape": "Kubescape — Kubernetes security scanner for misconfiguration detection",
  "prometheus": "Prometheus — monitoring system and time-series database for metrics",
  "grafana": "Grafana — observability platform for metrics visualization and dashboards",
  "influxdb": "InfluxDB — time-series database for metrics and event monitoring",
  "blackbox_exporter": "blackbox_exporter — Prometheus exporter for blackbox probing of endpoints",

  // CLI Tools
  "structopt": "structopt — derive macros for CLI argument parsing",
  "pico-args": "pico-args — minimal argument parser for Rust",
  "getopts": "getopts — command-line argument parsing library",
  "clap": "Clap — command-line argument parser for Rust with derive support",
  "docopt": "Docopt — command-line interface description language parser",
  "derive-args": "derive-args — Rust derive macro for command-line argument parsing",

  // Utilities
  "tree-climb": "tree-climb — recursively search directory tree",
  "tree-query": "tree-query — query tree structures",
  "tree-walk": "tree-walk — traverse directory trees",
  "num-format": "num-format — format numbers with separators",
  "pickle": "pickle — serialization format",
  "rand": "rand — Rust random number generator library",
  "html-minifier": "html-minifier — HTML compression and minification",
  "brotli": "Brotli — compression utility with better ratios than gzip",
  "gzip": "gzip — GNU file compression utility for single-file compression",
  "xz": "xz — high-ratio file compression utility using LZMA algorithm",
  "pigz": "pigz — parallel gzip implementation for faster compression",
  "pbzip2": "pbzip2 — parallel bzip2 compressor for large files",
  "unrar": "unrar — extract files from RAR archives",
  "zip": "zip — package and compress files into ZIP archives",
  "unzip": "unzip — extract files from ZIP archives",
  "tar": "tar — GNU tape archiver for creating and extracting file archives",
  "diff": "diff — compare files line by line for differences",
  "patch": "patch — apply diff patches to files for source updates",
  "sort": "sort — sort lines of text files alphabetically and numerically",
  "uniq": "uniq — report or omit repeated lines from sorted input",
  "head": "head — output the first part of files for quick previews",
  "tail": "tail — output the last part of files with live follow mode",
  "grep": "grep — GNU grep for searching text patterns in files",
  "egrep": "egrep — extended grep with enhanced regular expression support",
  "fgrep": "fgrep — fixed-string grep for literal pattern matching",
  "find": "find — search for files in a directory hierarchy",
  "locate": "locate — find files by name using a prebuilt database",
  "xargs": "xargs — build and execute command lines from standard input",
  "sed": "sed — stream editor for filtering and transforming text",
  "awk": "awk — pattern scanning and text processing language",
  "gawk": "gawk — GNU Awk implementation for text processing",
  "mawk": "mawk — fast Awk implementation for efficient text parsing",
  "cut": "cut — remove sections from each line of files",
  "tr": "tr — translate or delete characters from text streams",
  "tee": "tee — read from stdin and write to stdout and files simultaneously",
  "cat": "cat — concatenate files and print to stdout for display",
  "tac": "tac — concatenate and print files in reverse line order",
  "nl": "nl — number lines of files for line-numbered output",
  "wc": "wc — word, line, character, and byte count for files",
  "od": "od — dump files in octal and other formats for debugging",
  "base32": "base32 — encode or decode data in Base32 format",
  "base64": "base64 — encode or decode data in Base64 format",
  "md5sum": "md5sum — compute and check MD5 message digests for files",
  "sha256sum": "sha256sum — compute and check SHA-256 message digests for files",
  "xxd": "xxd — hex dump utility for binary file analysis and editing",
  "strings": "strings — extract printable strings from binary files",
  "file": "file — determine file type using magic number detection",
  "stat": "stat — display file or filesystem status information",
  "du": "du — estimate file space usage for directories and files",
  "df": "df — report filesystem disk space usage",
  "mount": "mount — mount filesystems for data access",
  "umount": "umount — unmount filesystems for safe removal",
  "dd": "dd — convert and copy files with block-level operations",
  "sync": "sync — flush filesystem buffers to disk for data integrity",
  "mkfs.ext4": "mkfs.ext4 — create ext4 filesystem on a partition",
  "mkfs.xfs": "mkfs.xfs — create XFS filesystem on a partition",
  "fsck": "fsck — filesystem consistency check and repair",
  "lsblk": "lsblk — list block devices with partition and mount info",
  "blkid": "blkid — locate and print block device attributes",
  "fdisk": "fdisk — disk partition table editor for managing storage",
  "parted": "parted — partition manipulation tool for disk management",
  "lvm": "lvm — logical volume management for flexible disk storage",
  "btrfs": "btrfs — Btrfs filesystem management with snapshot support",
  "zfs": "ZFS — ZFS filesystem management for advanced storage pools",
  "zpool": "zpool — ZFS pool management for creating storage pools",
  "cryptsetup": "cryptsetup — disk encryption setup using LUKS for security",
  "losetup": "losetup — set up and control loop devices for file-backed storage",

  // Cloud Providers
  "linode-cli": "Linode CLI — command-line tool for Linode cloud",
  "vultr-cli": "Vultr CLI — command-line interface for Vultr cloud",
  "scaleway": "Scaleway CLI — command-line tool for Scaleway cloud",
  "googlews": "Google Workspace CLI — manage Google Workspace services",
  "hostvn": "HostVN CLI — Vietnam hosting provider interface",
  "aws-cli": "AWS CLI — command-line interface for Amazon Web Services",
  "aws": "AWS CLI — Amazon Web Services command-line interface",
  "azure-cli": "Azure CLI — command-line interface for Microsoft Azure services",
  "gcloud-sdk": "Google Cloud SDK — command-line tools for Google Cloud Platform",
  "doctl": "doctl — DigitalOcean CLI for managing cloud resources",
  "digitalocean-cli": "DigitalOcean CLI — cloud infrastructure management command-line tool",

  // Web Frameworks
  "yew": "Yew — Rust framework for building web frontends",
  "trunk": "Trunk — build system for Rust web applications",

  // Languages & Compilers
  "python": "Python — interpreted programming language for general-purpose development",
  "python2": "Python 2 — legacy Python interpreter for Python 2 codebases",
  "node": "Node.js — JavaScript runtime built on V8 engine for server-side apps",
  "gcc": "GCC — GNU Compiler Collection for C, C++, and other languages",
  "g++": "G++ — GNU C++ compiler for compiling C++ programs",
  "rustc": "rustc — Rust compiler for building Rust programs",
  "rustup": "rustup — Rust toolchain installer and version manager",
  "cargo-edit": "cargo-edit — Cargo extension for adding and removing crate dependencies",
  "cargo-generate": "cargo-generate — Cargo extension for generating new projects from templates",
  "cargo-expand": "cargo-expand — Cargo extension for expanding Rust macros for debugging",
  "cargo-bloat": "cargo-bloat — analyze Rust binary size to find what takes up space",
  "cargo-udeps": "cargo-udeps — find unused crate dependencies in Rust projects",
  "cargo-asm": "cargo-asm — display Rust assembly output for performance analysis",
  "cargo-doc": "cargo-doc — generate Rust crate documentation from doc comments",
  "cargo-test": "cargo-test — run Rust unit and integration tests for a project",
  "cargo-clean": "cargo-clean — remove Rust build artifacts to reclaim disk space",
  "cargo-insta": "cargo-insta — Rust snapshot testing for reviewing output changes",
  "tsc": "tsc — TypeScript compiler for compiling TypeScript to JavaScript",
  "javac": "javac — Java compiler for compiling Java source code",
  "java": "java — Java Runtime Environment for executing Java applications",
  "scala": "scala — Scala programming language compiler and interpreter",
  "kotlin": "kotlin — Kotlin programming language compiler for JVM",
  "go": "go — Go programming language compiler and toolchain",
  "golang": "golang — Go programming language for building efficient applications",
  "rust-analyzer": "rust-analyzer — Rust language server for IDE integration and code analysis",
  "rustdoc": "rustdoc — Rust documentation tool for generating crate API docs",
  "rustfmt": "rustfmt — Rust code formatter for consistent code style",
  "rustrover": "RustRover — JetBrains IDE for Rust development",
  "elixir": "elixir — Elixir programming language for scalable and maintainable apps",
  "erlang": "erlang — Erlang programming language for concurrent and fault-tolerant systems",
  "haskell": "haskell — GHC Haskell compiler for purely functional programming",
  "ghc": "GHC — Glasgow Haskell Compiler for compiling Haskell programs",
  "ocaml": "ocaml — OCaml compiler for functional and imperative programming",
  "fsharp": "F# — F# compiler for functional-first .NET programming",
  "clojure": "clojure — Clojure programming language for JVM with Lisp syntax",
  "dart": "dart — Dart programming language for client-optimized apps",
  "flutter": "flutter — Flutter UI toolkit CLI for building cross-platform applications",
  "julia": "julia — Julia programming language for scientific computing",
  "racket": "racket — Racket programming language for language-oriented programming",
  "scheme": "scheme — Scheme interpreter for minimalist Lisp dialect",
  "prolog": "prolog — SWI-Prolog interpreter for logic programming",
  "crystal": "crystal — Crystal programming language with Ruby-like syntax",
  "nim": "nim — Nim programming language for efficient systems programming",
  "zig": "zig — Zig programming language for robust and optimal software",
  "vlang": "vlang — V language compiler for simple and fast systems programming",
  "purescript": "PureScript — PureScript compiler for strongly-typed functional web programming",
  "rescript": "ReScript — ReScript compiler for type-safe JavaScript development",
  "lua": "lua — Lua scripting language for embedded applications",

  // Editors & IDEs
  "vim": "Vim — highly configurable text editor for efficient text editing",
  "neovim": "Neovim — modern Vim-based text editor with extensible plugin architecture",
  "emacs": "GNU Emacs — extensible text editor with built-in Lisp interpreter",
  "nano": "nano — command-line text editor for beginners and quick edits",
  "code": "VS Code — Visual Studio Code command-line launcher",
  "codium": "VSCodium — free and open-source VS Code distribution",
  "sublime": "Sublime Text — sophisticated text editor for code and markup",
  "atom": "Atom — hackable text editor for the 21st century",
  "cursor": "Cursor — AI-first code editor built on VS Code",
  "geany": "Geany — lightweight GTK text editor for developers",
  "kate": "Kate — KDE advanced text editor for multi-document editing",
  "mousepad": "Mousepad — lightweight GTK text editor for Xfce desktop",
  "pluma": "Pluma — feature-rich GTK text editor for MATE desktop",
  "leafpad": "Leafpad — minimalist GTK text editor for Linux desktop",
  "bluefish": "Bluefish — GTK text editor for web developers and programmers",
  "gedit": "gedit — GNOME text editor for general-purpose text editing",
  "notepadqq": "Notepadqq — Notepad++ clone for Linux with syntax highlighting",
  "bbedit": "BBEdit — professional HTML and text editor for macOS",
  "textmate": "TextMate — versatile text editor for macOS with bundle system",
  "xed": "xed — Xapp text editor for Linux Mint desktop environment",
  "brackets": "Brackets — open-source code editor for web development",

  // Reverse Engineering & Security
  "ghidra": "Ghidra — reverse engineering framework developed by NSA",
  "radare2": "Radare2 — reverse engineering framework for binary analysis",
  "idafree": "IDA Free — free disassembler for binary reverse engineering",
  "binary-ninja": "Binary Ninja — binary analysis and reverse engineering platform",
  "cutter": "Cutter — reverse engineering platform with GUI based on radare2",
  "x64dbg": "x64dbg — Windows debugger for x64 binary analysis",
  "ollydbg": "OllyDbg — x86 debugger for Windows binary analysis",
  "metasploit": "Metasploit — penetration testing framework for security assessments",
  "burpsuite": "Burp Suite — web application security testing proxy",
  "zap": "ZAP — Zed Attack Proxy for web application vulnerability scanning",
  "nmap": "nmap — network discovery and security scanning tool",
  "masscan": "masscan — fast TCP port scanner for large network ranges",
  "wpscan": "WPScan — WordPress vulnerability scanner for security audits",
  "sqlmap": "SQLMap — automatic SQL injection testing and exploitation tool",
  "hydra": "Hydra — parallel network login cracker for security testing",

  // System Tools
  "lscpu": "lscpu — display CPU architecture information",
  "lsusb": "lsusb — list USB devices connected to the system",
  "lspci": "lspci — list PCI devices installed on the system",
  "lshw": "lshw — list hardware configuration details",
  "inxi": "inxi — full system information tool for debugging and reporting",
  "neofetch": "neofetch — system information tool with logo display",
  "screenfetch": "screenfetch — system info for screenshots and system display",
  "dmidecode": "dmidecode — DMI table decoder for hardware information",
  "nvidia-smi": "nvidia-smi — NVIDIA system management interface for GPU monitoring",
  "nvtop": "nvtop — GPU monitoring tool for multiple GPU vendors",
  "ethtool": "ethtool — query and control network device settings",
  "iwconfig": "iwconfig — configure wireless network interfaces",
  "iwlist": "iwlist — scan for wireless networks and access points",
  "ifconfig": "ifconfig — configure network interface parameters",
  "ip": "ip — show and manipulate network devices and routing",
  "ss": "ss — socket statistics utility for network connections",
  "netstat": "netstat — network statistics for connections and interfaces",
  "route": "route — show and manipulate IP routing table",
  "arp": "arp — manage ARP cache for IP to MAC address resolution",
  "ping": "ping — ICMP echo test for network connectivity checking",
  "traceroute": "traceroute — trace network path to a remote host",
  "mtr": "mtr — network diagnostic tool combining ping and traceroute",
  "whois": "whois — lookup domain registration and IP ownership information",
  "dig": "dig — DNS lookup utility for querying name servers",
  "nslookup": "nslookup — query DNS to obtain domain name or IP address",
  "host": "host — DNS lookup utility for converting names to addresses",
  "dnsmasq": "dnsmasq — lightweight DNS forwarder and DHCP server",
  "unbound": "unbound — DNSSEC validating DNS resolver for privacy",
  "openssl": "OpenSSL — cryptography toolkit for SSL/TLS and encryption",
  "ssh": "ssh — OpenSSH remote login client for secure connections",
  "sshd": "sshd — OpenSSH daemon for secure remote access",
  "scp": "scp — secure copy protocol for transferring files over SSH",
  "rsync": "rsync — fast file synchronization and transfer tool",
  "autossh": "autossh — persistent SSH tunnel manager with auto-reconnection",

  // Databases
  "mysql": "MySQL — relational database management system CLI client",
  "postgresql": "PostgreSQL — advanced relational database system CLI client",
  "mongodb": "MongoDB — NoSQL document database server",
  "mongosh": "mongosh — MongoDB shell for querying and administration",
  "redis": "redis — in-memory data structure store CLI",
  "sqlite3": "sqlite3 — self-contained SQL database engine CLI",
  "couchdb": "CouchDB — Apache CouchDB NoSQL document database server",
  "neo4j": "Neo4j — graph database management system CLI",
  "kafka": "Kafka — Apache Kafka event streaming platform CLI tools",

  // AI & Machine Learning
  "tensorflow": "TensorFlow — machine learning framework for training and inference",
  "pytorch": "PyTorch — machine learning framework with dynamic computation graphs",
  "llama": "llama.cpp — inference of LLaMA language models in pure C/C++",
  "whisper": "whisper — OpenAI speech recognition system for audio transcription",
  "tesseract": "Tesseract — OCR text recognition engine for image-to-text conversion",
  "easyocr": "EasyOCR — ready-to-use OCR library for text recognition",

  // Specialized
  "openpilot": "OpenPilot — open-source autonomous driving system",
  "massgen": "Massgen — multi-agent system coordination tool",
  "matchmaker": "Matchmaker — pattern matching utility",
  "graphify-out": "Graphify output — knowledge graph utilities",
  "actix": "Actix — Rust actor framework for building concurrent applications",
  "atuin": "Atuin — shell history sync and search tool with encrypted storage",
  "fd-find2": "fd — fast file search tool for finding files by pattern",
  "fzf-bin": "fzf — command-line fuzzy finder for interactive filtering and search",
  "cargo-clap": "cargo-clap — cargo extension for generating CLI argument parsers",
  "cargo-generate-new": "cargo-generate — cargo extension for generating new Rust projects",
  "criterion-rs": "Criterion.rs — Rust benchmarking library with statistical analysis",
  "zsh-4": "Zsh 4 — legacy version of the Z shell",
  "zsh-5": "Zsh 5 — modern Z shell with advanced completion and theming",
};

function isUrlTag(tag: string): boolean {
  return tag.startsWith("//") || tag.startsWith("https://") || tag.startsWith("http://");
}

function cleanTags(tags: string[], name: string): string[] {
  return tags.filter((t) => !isUrlTag(t) && t.toLowerCase() !== name.toLowerCase());
}

function getTagTemplate(tag: string): string | undefined {
  const lower = tag.toLowerCase();
  return TAG_TEMPLATES[lower] || TAG_TEMPLATES[tag];
}

function enhanceDescription(plugin: Plugin): Enhancement {
  const { name, description, tags } = plugin;

  // Try direct lookup first
  if (DESCRIPTIONS[name]) {
    return {
      name,
      current: description,
      suggested: DESCRIPTIONS[name],
      confidence: 95,
    };
  }

  // Try lowercase match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(DESCRIPTIONS)) {
    if (key.toLowerCase() === lowerName) {
      return {
        name,
        current: description,
        suggested: value,
        confidence: 90,
      };
    }
  }

  // Clean tags: remove URL-like tags and self-referential tags
  const clean = cleanTags(tags, name);

  // Try partially matching a cleaned tag against DESCRIPTIONS
  for (const tag of clean) {
    if (DESCRIPTIONS[tag]) {
      const suggestion = `${name} — ${tag} tool`;
      return {
        name,
        current: description,
        suggested: suggestion,
        confidence: 60,
      };
    }
  }

  // Try tag template match on cleaned tags
  for (const tag of clean) {
    const template = getTagTemplate(tag);
    if (template) {
      const suggestion = `${name} — ${template}`;
      return {
        name,
        current: description,
        suggested: suggestion,
        confidence: 55,
      };
    }
  }

  // Enrich existing description if it's meaningful but short
  const desc = description || "";
  if (desc.length > 5 && desc !== name && !desc.toLowerCase().includes(name.toLowerCase())) {
    const enriched = `${desc.charAt(0).toUpperCase() + desc.slice(1)} — command-line tool`;
    if (enriched.length > desc.length) {
      return {
        name,
        current: description,
        suggested: enriched,
        confidence: 50,
      };
    }
  }

  // Fallback: construct from cleaned tags
  if (clean.length >= 2) {
    const s1 = getTagTemplate(clean[0]) || `${clean[0]} tool`;
    const suggestion = `${name} — ${s1}`;
    return {
      name,
      current: description,
      suggested: suggestion,
      confidence: 45,
    };
  }

  if (clean.length === 1) {
    const template = getTagTemplate(clean[0]);
    if (template) {
      return {
        name,
        current: description,
        suggested: `${name} — ${template}`,
        confidence: 45,
      };
    }
  }

  return {
    name,
    current: description,
    suggested: `${name} — command-line utility`,
    confidence: 30,
  };
}

async function main() {
  console.log("🔧 Batch Description Enhancement");
  console.log("================================\n");

  // Load plugins
  const plugins: Plugin[] = JSON.parse(readFileSync("marketing/plugins-dump.json", "utf-8"));
  const shortDesc = plugins.filter((p) => (p.description || "").length < 30);

  console.log(`Processing ${shortDesc.length} plugins with short descriptions\n`);

  // Generate suggestions
  const enhancements = shortDesc.map((p) => enhanceDescription(p));

  // Sort by confidence
  enhancements.sort((a, b) => b.confidence - a.confidence);

  // Display high-confidence suggestions
  console.log("🎯 High-Confidence Suggestions (Confidence >= 85):\n");
  const highConf = enhancements.filter((e) => e.confidence >= 85);
  highConf.slice(0, 20).forEach((e) => {
    console.log(`${e.name}`);
    console.log(`  Current: "${e.current}"`);
    console.log(`  → "${e.suggested}"`);
    console.log();
  });

  console.log(`\n📊 Confidence Distribution:`);
  console.log(`  >= 85: ${enhancements.filter((e) => e.confidence >= 85).length}`);
  console.log(`  70-84: ${enhancements.filter((e) => e.confidence >= 70 && e.confidence < 85).length}`);
  console.log(`  50-69: ${enhancements.filter((e) => e.confidence >= 50 && e.confidence < 70).length}`);
  console.log(`  < 50:  ${enhancements.filter((e) => e.confidence < 50).length}`);

  // Save report
  writeFileSync("description-enhancements.json", JSON.stringify(enhancements, null, 2));
  console.log("\n✓ Full report saved to: description-enhancements.json");

  // Ask for auto-apply
  console.log("\n💡 Suggestion: Review description-enhancements.json to see all suggestions");
  console.log("   Then run: bun apply-description-enhancements.ts");
}

main().catch(console.error);
