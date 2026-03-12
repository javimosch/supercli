const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function getGlobalNodeModules() {
  const result = spawnSync("npm", ["root", "-g"], { encoding: "utf-8" });
  if (result.status === 0 && result.stdout) {
    return result.stdout.trim();
  }
  return null;
}

function resolveMonty() {
  if (process.env.MOCK_MISSING_MONTY === "1") return null;
  try {
    return require("@pydantic/monty");
  } catch (e) {
    const globalRoot = getGlobalNodeModules();
    if (globalRoot) {
      const globalMontyPath = path.join(globalRoot, "@pydantic", "monty");
      if (fs.existsSync(globalMontyPath)) {
        try {
          return require(globalMontyPath);
        } catch (inner) {
          // ignore
        }
      }
    }
  }
  return null;
}

function run() {
  const args = process.argv.slice(2);
  const isVersion = args.includes("--version");

  const MontyPkg = resolveMonty();

  if (!MontyPkg) {
    console.error(
      JSON.stringify({
        error: {
          code: 85,
          type: "invalid_argument",
          message:
            "Dependency @pydantic/monty not found. Please run the setup command first.",
          recoverable: true,
          suggestions: ["Run: supercli monty cli setup"],
        },
      })
    );
    process.exit(1);
  }

  if (isVersion) {
    const pkgPath = require.resolve("@pydantic/monty", {
      paths: [process.cwd(), getGlobalNodeModules()].filter(Boolean),
    });
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(path.dirname(pkgPath), "package.json"), "utf-8")
    );
    console.log(
      JSON.stringify({
        plugin_version: "0.1.0",
        monty_version: pkgJson.version,
        status: "ready",
        location: pkgPath,
      })
    );
    return;
  }

  // Find the code argument
  // In our plugin.json, code is the first positional arg
  // Flags like --inputs or --typeCheck will be passed as well
  let code = null;
  let inputs = {};
  let typeCheck = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--inputs") {
      try {
        inputs = JSON.parse(args[++i]);
      } catch (e) {
        console.error(
          JSON.stringify({ error: { message: "Invalid JSON for --inputs" } })
        );
        process.exit(1);
      }
    } else if (args[i] === "--typeCheck") {
      typeCheck = true;
    } else if (!args[i].startsWith("--") && code === null) {
      code = args[i];
    }
  }

  if (!code) {
    console.error(
      JSON.stringify({ error: { message: "No Python code provided" } })
    );
    process.exit(1);
  }

  try {
    const { Monty } = MontyPkg;
    const inputNames = Object.keys(inputs);
    const m = new Monty(code, { inputs: inputNames, typeCheck });
    const runOptions = {};
    if (inputNames.length > 0) {
      runOptions.inputs = inputs;
    }
    const result = m.run(runOptions);

    console.log(
      JSON.stringify({
        ok: true,
        result: result,
      })
    );
  } catch (error) {
    const errorInfo = {
      ok: false,
      error_type: error.constructor.name,
      message: error.message,
    };

    if (typeof error.traceback === "function") {
      errorInfo.traceback = error.traceback();
    }
    if (typeof error.displayDiagnostics === "function") {
      errorInfo.diagnostics = error.displayDiagnostics();
    }

    console.log(JSON.stringify(errorInfo));
  }
}

if (require.main === module) {
  run();
}
