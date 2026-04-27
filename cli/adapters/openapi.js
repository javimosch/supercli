// OpenAPI Adapter
// Fetches spec, resolves operation by operationId, builds URL, executes HTTP call

const specCache = {};

async function fetchSpec(specName, context) {
  if (specCache[specName]) return specCache[specName];

  const localSpecs =
    context.config && Array.isArray(context.config.specs)
      ? context.config.specs
      : [];
  const localSpec = localSpecs.find((s) => s && s.name === specName);
  if (localSpec) {
    const sr = await fetch(localSpec.url);
    if (!sr.ok)
      throw new Error(
        `Failed to fetch OpenAPI spec from ${localSpec.url}: ${sr.status}`,
      );
    const specDoc = await sr.json();
    specCache[specName] = { ...specDoc, _auth: localSpec.auth };
    return specCache[specName];
  }

  if (!context.server) {
    throw Object.assign(
      new Error(
        `OpenAPI spec '${specName}' not found in local config. Run supercli sync to load specs.`,
      ),
      {
        code: 85,
        type: "invalid_argument",
        recoverable: false,
      },
    );
  }

  // Fetch spec URL from server
  const r = await fetch(`${context.server}/api/specs?format=json`);
  if (!r.ok) throw new Error(`Failed to fetch specs list: ${r.status}`);
  const specs = await r.json();
  const spec = specs.find((s) => s.name === specName);
  if (!spec) throw new Error(`OpenAPI spec '${specName}' not found`);

  // Fetch the actual OpenAPI spec
  const sr = await fetch(spec.url);
  if (!sr.ok)
    throw new Error(
      `Failed to fetch OpenAPI spec from ${spec.url}: ${sr.status}`,
    );
  const specDoc = await sr.json();
  specCache[specName] = { ...specDoc, _auth: spec.auth };
  return specCache[specName];
}

function findOperation(spec, operationId) {
  const paths = spec.paths || {};
  for (const [pathStr, methods] of Object.entries(paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (op.operationId === operationId) {
        return { path: pathStr, method: method.toUpperCase(), operation: op };
      }
    }
  }
  throw new Error(`Operation '${operationId}' not found in spec`);
}

function buildUrl(baseUrl, pathStr, method, operation, flags) {
  let url = pathStr;

  // Replace path parameters
  const pathParams = (operation.parameters || []).filter(
    (p) => p.in === "path",
  );
  for (const p of pathParams) {
    if (flags[p.name] !== undefined) {
      url = url.replace(`{${p.name}}`, encodeURIComponent(flags[p.name]));
    }
  }

  // Build query parameters
  const queryParams = (operation.parameters || []).filter(
    (p) => p.in === "query",
  );
  const query = [];
  for (const p of queryParams) {
    if (flags[p.name] !== undefined) {
      query.push(
        `${encodeURIComponent(p.name)}=${encodeURIComponent(flags[p.name])}`,
      );
    }
  }

  let fullUrl = baseUrl.replace(/\/+$/, "") + url;
  if (query.length > 0) {
    fullUrl += "?" + query.join("&");
  }
  return { url: fullUrl, method };
}

function resolveAuthValue(authConfig, flags) {
  if (!authConfig) return null;

  const { argName, envVar } = authConfig;

  // Check command arguments first (highest priority)
  if (argName && flags[argName] !== undefined) {
    return flags[argName];
  }

  // Check environment variable
  if (envVar && process.env[envVar] !== undefined) {
    return process.env[envVar];
  }

  return null;
}

function applyAuth(fetchOpts, authConfig, authValue) {
  if (!authConfig || !authValue) return;

  const { type, bearer, headerName, queryName, bodyName } = authConfig;

  switch (type) {
    case "bearer":
      fetchOpts.headers["Authorization"] = `Bearer ${authValue}`;
      break;
    case "basic": {
      const base64 = Buffer.from(authValue).toString("base64");
      fetchOpts.headers["Authorization"] = `Basic ${base64}`;
      break;
    }
    case "api-key":
      if (headerName) {
        fetchOpts.headers[headerName] = authValue;
      } else if (queryName) {
        // Add to URL query params
        const url = new URL(fetchOpts.url || "");
        url.searchParams.set(queryName, authValue);
        fetchOpts.url = url.toString();
      } else if (bodyName) {
        // Add to body for POST/PUT/PATCH
        if (fetchOpts.body) {
          try {
            const bodyObj = JSON.parse(fetchOpts.body);
            bodyObj[bodyName] = authValue;
            fetchOpts.body = JSON.stringify(bodyObj);
          } catch {
            // If body isn't JSON, can't add auth field
          }
        }
      }
      break;
    default:
      // Unknown auth type, ignore
      break;
  }
}

async function execute(cmd, flags, context) {
  const config = cmd.adapterConfig || {};
  const specName = config.spec;
  const operationId = config.operationId;

  if (!specName || !operationId) {
    throw new Error(
      "OpenAPI adapter requires 'spec' and 'operationId' in adapterConfig",
    );
  }

  const spec = await fetchSpec(specName, context);
  const { path: pathStr, method, operation } = findOperation(spec, operationId);

  // Determine base URL from spec
  const baseUrl =
    (spec.servers && spec.servers[0] && spec.servers[0].url) || "";
  const { url, method: httpMethod } = buildUrl(
    baseUrl,
    pathStr,
    method,
    operation,
    flags,
  );

  const fetchOpts = { method: httpMethod, headers: {}, url };

  // Handle request body for POST/PUT/PATCH
  if (["POST", "PUT", "PATCH"].includes(httpMethod)) {
    const bodyObj = {};
    for (const [k, v] of Object.entries(flags)) {
      if (!["human", "json", "compact"].includes(k)) {
        bodyObj[k] = v;
      }
    }
    fetchOpts.body = JSON.stringify(bodyObj);
    fetchOpts.headers["Content-Type"] = "application/json";
  }

  // Apply auth if configured
  const authConfig = config.auth;
  const authValue = resolveAuthValue(authConfig, flags);
  if (authConfig && authValue) {
    applyAuth(fetchOpts, authConfig, authValue);
  }

  const finalUrl = fetchOpts.url || url;
  delete fetchOpts.url;

  const r = await fetch(finalUrl, fetchOpts);
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw Object.assign(
      new Error(`API call failed: ${r.status} ${r.statusText} ${text}`),
      {
        code: r.status >= 500 ? 105 : 92,
        type: r.status >= 500 ? "integration_error" : "resource_not_found",
        recoverable: r.status >= 500,
      },
    );
  }

  const contentType = r.headers.get("content-type") || "";
  if (contentType.includes("json")) {
    return r.json();
  }
  return { raw: await r.text() };
}

module.exports = { execute };
