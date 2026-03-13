#!/usr/bin/env node

const { spawnSync } = require("child_process")
const path = require("path")
const os = require("os")
const fs = require("fs")

const IMAGE_NAME = "dcli-boxlite"
const IMAGE_TAG = "1.1.0"
const FULL_IMAGE = `${IMAGE_NAME}:${IMAGE_TAG}`

function runDocker(args, options = {}) {
  return spawnSync("docker", args, {
    encoding: "utf-8",
    timeout: options.timeout ?? 300000,
    cwd: options.cwd,
    env: process.env,
  })
}

function exitWithResult(result, fallbackMessage) {
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)

  if (result.error) {
    process.stderr.write(`${fallbackMessage}: ${result.error.message}\n`)
    process.exit(1)
  }

  process.exit(typeof result.status === "number" ? result.status : 1)
}

function ensureImage(pluginDir) {
  const inspect = runDocker(["image", "inspect", FULL_IMAGE], { timeout: 15000 })
  if (!inspect.error && inspect.status === 0) return

  const build = runDocker(
    [
      "build",
      "--tag",
      FULL_IMAGE,
      "--file",
      path.join(pluginDir, "Dockerfile"),
      pluginDir,
    ],
    { cwd: pluginDir, timeout: 600000 },
  )

  if (build.error || build.status !== 0) {
    exitWithResult(build, `Failed to build Docker image ${FULL_IMAGE}`)
  }
}

function run() {
  const pluginDir = process.env.SUPERCLI_PLUGIN_DIR || process.cwd()
  const passthroughArgs = process.argv.slice(2)
  const home = os.homedir()
  const hostRuntimeDir = process.env.BOXLITE_RUNTIME_HOME || path.join(home, ".boxlite")
  const hostWorkspace = process.cwd()
  const hostSdkDir = process.env.BOXLITE_SDK_DIR

  ensureImage(pluginDir)

  const dockerArgs = [
    "run",
    "--rm",
    "--privileged",
    "--volume",
    `${hostRuntimeDir}:/root/.boxlite`,
    "--volume",
    `${hostWorkspace}:${hostWorkspace}`,
    "--workdir",
    hostWorkspace,
  ]

  if (process.env.BOXLITE_PLUGIN_NO_NETWORK !== "1") {
    dockerArgs.push("--network", "host")
  }

  const kvmPath = "/dev/kvm"
  const kvmCheck = spawnSync("test", ["-e", kvmPath])
  if (kvmCheck.status === 0) {
    dockerArgs.push("--device", `${kvmPath}:${kvmPath}`)
  }

  if (process.env.RUST_LOG) {
    dockerArgs.push("--env", `RUST_LOG=${process.env.RUST_LOG}`)
  }

  let containerCommand = ["boxcli", ...passthroughArgs]

  if (hostSdkDir) {
    const cliEntry = path.join(hostSdkDir, "dist/cli/index.js")
    if (fs.existsSync(cliEntry)) {
      dockerArgs.push("--volume", `${hostSdkDir}:/opt/boxlite-sdk:ro`)
      containerCommand = ["node", "/opt/boxlite-sdk/dist/cli/index.js", ...passthroughArgs]
    }
  }

  dockerArgs.push(FULL_IMAGE, ...containerCommand)

  const result = runDocker(dockerArgs, { timeout: 600000 })
  exitWithResult(result, "Failed to run boxlite Docker container")
}

run()
