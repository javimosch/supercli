const { spawnSync } = require("child_process")

function run() {
  console.log("Installing @pydantic/monty globally...")
  const result = spawnSync("npm", ["install", "-g", "@pydantic/monty"], {
    encoding: "utf-8",
    stdio: "inherit"
  })

  if (result.error) {
    console.error(`Error starting npm: ${result.error.message}`)
    process.exit(1)
  }

  if (result.status !== 0) {
    console.error(`npm install failed with exit code ${result.status}`)
    console.log("\nIf you see permission errors, you may need to run this command with sudo or fix your npm global permissions.")
    process.exit(result.status)
  }

  console.log("\nSuccessfully installed @pydantic/monty globally.")
  console.log("You can now run Python code with: supercli monty python run \"code\"")
}

if (require.main === module) {
  run()
}
