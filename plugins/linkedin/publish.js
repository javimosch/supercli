#!/usr/bin/env node

const https = require("https");
const http = require("http");
const { URL, URLSearchParams } = require("url");

const VERSION = "0.1.0";
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_API_HOST = "api.linkedin.com";
const SCOPES = "w_member_social openid profile email";

function parseFlags(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

function printJson(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function printError(message, details = {}) {
  printJson({ version: VERSION, status: "error", error: { message, ...details } });
}

function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on("error", (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

function startCallbackServer(port, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    let server;
    let timer;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (server) server.close();
    };

    server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${port}`);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      const errorDescription = url.searchParams.get("error_description");

      res.writeHead(200, { "Content-Type": "text/html" });
      if (code) {
        res.end("<html><body><h1>Authorization successful</h1><p>You can close this window.</p></body></html>");
        cleanup();
        resolve({ code });
      } else {
        res.end(`<html><body><h1>Authorization failed</h1><p>${errorDescription || error || "Unknown error"}</p></body></html>`);
        cleanup();
        reject(new Error(errorDescription || error || "OAuth authorization failed"));
      }
    });

    server.on("error", (err) => {
      cleanup();
      reject(err);
    });

    server.listen(port, () => {
      timer = setTimeout(() => {
        cleanup();
        reject(new Error(`OAuth callback timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  });
}

async function runAuthUrl(flags) {
  const clientId = flags["client-id"];
  const redirectPort = parseInt(flags["redirect-port"] || "3000", 10);

  if (!clientId) {
    printError("Missing required flag", { required: ["--client-id"] });
    process.exit(1);
  }

  const redirectUri = `http://localhost:${redirectPort}/callback`;
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);

  const authUrl = new URL(LINKEDIN_AUTH_URL);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);

  printJson({
    version: VERSION,
    status: "success",
    authorization_url: authUrl.toString(),
    redirect_uri: redirectUri,
    state,
    instructions: [
      "Open the authorization_url in your browser and authorize the app.",
      "After authorization, copy the 'code' query parameter from the browser's address bar.",
      "Run: linkedin auth exchange --code <CODE> --client-id <ID> --client-secret <SECRET>"
    ]
  });
}

async function runAuthExchange(flags) {
  const clientId = flags["client-id"];
  const clientSecret = flags["client-secret"];
  const code = flags.code;
  const redirectPort = parseInt(flags["redirect-port"] || "3000", 10);

  if (!clientId || !clientSecret || !code) {
    printError("Missing required flags", { required: ["--client-id", "--client-secret", "--code"] });
    process.exit(1);
  }

  const redirectUri = `http://localhost:${redirectPort}/callback`;
  const tokenParams = new URLSearchParams();
  tokenParams.set("grant_type", "authorization_code");
  tokenParams.set("code", code);
  tokenParams.set("client_id", clientId);
  tokenParams.set("client_secret", clientSecret);
  tokenParams.set("redirect_uri", redirectUri);

  try {
    const tokenResponse = await httpsRequest({
      hostname: "www.linkedin.com",
      path: "/oauth/v2/accessToken",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(tokenParams.toString())
      }
    }, tokenParams.toString());

    if (tokenResponse.status >= 200 && tokenResponse.status < 300 && tokenResponse.body.access_token) {
      printJson({
        version: VERSION,
        status: "success",
        access_token: tokenResponse.body.access_token,
        expires_in: tokenResponse.body.expires_in || null,
        scope: tokenResponse.body.scope || null
      });
    } else {
      printError("Token exchange failed", {
        status: tokenResponse.status,
        details: tokenResponse.body
      });
      process.exit(1);
    }
  } catch (err) {
    printError("Token exchange request failed", { message: err.message });
    process.exit(1);
  }
}

async function runPersonUrn(flags) {
  const accessToken = flags["access-token"];

  if (!accessToken) {
    printError("Missing required flag", { required: ["--access-token"] });
    process.exit(1);
  }

  try {
    const userinfoResponse = await httpsRequest({
      hostname: "www.linkedin.com",
      path: "/oauth/v2/userinfo",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (userinfoResponse.status === 200 && userinfoResponse.body.sub) {
      printJson({
        version: VERSION,
        status: "success",
        person_urn: userinfoResponse.body.sub,
        email: userinfoResponse.body.email || null,
        name: userinfoResponse.body.name || null,
        note: "Use this person_urn with --person-urn flag in linkedin post create"
      });
      return;
    }
    printError("Failed to fetch person URN from userinfo endpoint", {
      status: userinfoResponse.status,
      details: userinfoResponse.body
    });
    process.exit(1);
  } catch (err) {
    printError("Person URN fetch failed", { message: err.message });
    process.exit(1);
  }
}

async function runPost(flags) {
  const accessToken = flags["access-token"];
  const text = flags.text;
  const orgUrn = flags["org-urn"];
  const personUrn = flags["person-urn"];

  if (!accessToken || !text) {
    printError("Missing required flags", { required: ["--access-token", "--text"] });
    process.exit(1);
  }

  if (text.length > 3000) {
    printError("Post text exceeds 3000 character limit", { length: text.length });
    process.exit(1);
  }

  const authorUrn = orgUrn || personUrn;

  if (!authorUrn) {
    printError("Missing required flag", { required: ["--org-urn or --person-urn"] });
    process.exit(1);
  }

  const postBody = {
    author: authorUrn,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text
        },
        shareMediaCategory: "NONE"
      }
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  };

  const postData = JSON.stringify(postBody);

  try {
    const postResponse = await httpsRequest({
      hostname: LINKEDIN_API_HOST,
      path: "/v2/ugcPosts",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202304",
        "Content-Length": Buffer.byteLength(postData)
      }
    }, postData);

    if (postResponse.status >= 200 && postResponse.status < 300) {
      const postUrn = postResponse.headers["x-restli-id"] || postResponse.body.id || null;
      printJson({
        version: VERSION,
        status: "success",
        post_urn: postUrn,
        linkedin_response: postResponse.body
      });
    } else {
      printError("Post creation failed", {
        status: postResponse.status,
        details: postResponse.body
      });
      process.exit(1);
    }
  } catch (err) {
    printError("Post creation request failed", { message: err.message });
    process.exit(1);
  }
}

async function runPostBrowser(flags) {
  const text = flags.text;
  const cookiesFile = flags["cookies-file"];

  if (!text) {
    printError("Missing required flag", { required: ["--text"] });
    process.exit(1);
  }

  if (text.length > 3000) {
    printError("Post text exceeds 3000 character limit", { length: text.length });
    process.exit(1);
  }

  printJson({
    version: VERSION,
    status: "success",
    message: "To post via browser automation, run:",
    command: `lightpanda script run --url https://www.linkedin.com/feed/ --code 'await page.waitForSelector("[data-test-id=\\"start-post\\"]"); await page.click("[data-test-id=\\"start-post\\"]"); await page.waitForSelector("[contenteditable=\\"true\\"]"); await page.type("[contenteditable=\\"true\\"]", "${text.replace(/'/g, "\\'")}"); await page.click("[data-test-id=\\"post-submit-button\\"]");'`,
    note: "You must be logged into LinkedIn in the browser session"
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const subcommand = args[1];

  let rest;
  if (command === "post" || command === "person") {
    rest = args.slice(1);
  } else if (command === "auth") {
    rest = args.slice(2);
  } else {
    rest = args.slice(1);
  }

  const { flags } = parseFlags(rest);

  if (command === "auth" && subcommand === "url") {
    await runAuthUrl(flags);
  } else if (command === "auth" && subcommand === "exchange") {
    await runAuthExchange(flags);
  } else if (command === "person" && subcommand === "urn") {
    await runPersonUrn(flags);
  } else if (command === "post" && subcommand === "browser") {
    await runPostBrowser(flags);
  } else if (command === "post") {
    await runPost(flags);
  } else {
    printError("Unknown command", {
      provided: `${command} ${subcommand || ""}`.trim(),
      available: ["auth url", "auth exchange", "person urn", "post", "post browser"]
    });
    process.exit(1);
  }
}

main().catch((err) => {
  printError(err.message, { stack: err.stack });
  process.exit(1);
});
