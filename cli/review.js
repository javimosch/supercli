"use strict";

// review.js — `sc review` — review results from `sc act`.
//
// Takes execution results (JSON from --file, stdin, or positional) and
// produces:
//   - Audit trail (step-by-step what happened)
//   - Failure analysis (grouped by error type, with suggested fixes)
//   - Rollback audit (what was rolled back and whether it succeeded)
//   - Optional LLM-powered analysis of failures with fix suggestions
//   - Save to file for later replay (--save flag)
//
// This completes the sc plan / sc act / sc review trilogy from VISION.md.

const fs = require("fs");
const { makeOutput, makeOutputError } = require("./output");

function readResultsFromInput(positional, flags) {
  // Priority: --file flag > flags._stdin > flags.results > positional JSON

  if (flags.file) {
    const content = fs.readFileSync(flags.file, "utf-8");
    return JSON.parse(content);
  }

  // The main CLI's readStdin() consumes piped stdin at startup.
  if (flags._stdin && typeof flags._stdin === "string") {
    try {
      return JSON.parse(flags._stdin);
    } catch {
      // fall through
    }
  }

  // Reconstruct from merged flags (when stdin was valid JSON results)
  if (Array.isArray(flags.results)) {
    return {
      version: flags.version || "1.0",
      mode: flags.mode || "act",
      plan_summary: flags.plan_summary || "",
      total_steps: flags.total_steps || 0,
      succeeded: flags.succeeded || 0,
      failed: flags.failed || 0,
      skipped: flags.skipped || 0,
      dry_run: flags.dry_run || 0,
      rollbacks_executed: flags.rollbacks_executed || 0,
      aborted: flags.aborted || false,
      status: flags.status || "unknown",
      results: flags.results,
      rollbacks: flags.rollbacks || [],
    };
  }

  // Positional: sc review '<json string>'
  if (positional[1]) {
    return JSON.parse(positional[1]);
  }

  return null;
}

function analyzeResults(resultsData) {
  const results = resultsData.results || [];
  const rollbacks = resultsData.rollbacks || [];

  // Group results by status
  const byStatus = {
    success: results.filter((r) => r.status === "success"),
    error: results.filter((r) => r.status === "error"),
    verify_failed: results.filter((r) => r.status === "verify_failed"),
    skipped: results.filter((r) => r.status === "skipped"),
    dry_run: results.filter((r) => r.status === "dry_run"),
  };

  // Group failures by error type/pattern
  const failureGroups = {};
  for (const r of byStatus.error) {
    const errKey = categorizeError(r.error || "");
    if (!failureGroups[errKey]) {
      failureGroups[errKey] = { category: errKey, steps: [], suggestion: suggestFix(errKey) };
    }
    failureGroups[errKey].steps.push(r);
  }
  for (const r of byStatus.verify_failed) {
    const key = "verify_failed";
    if (!failureGroups[key]) {
      failureGroups[key] = { category: key, steps: [], suggestion: "Check the verify command — it may not exist or may be returning an error" };
    }
    failureGroups[key].steps.push(r);
  }

  // Build audit trail (ordered by results array order)
  const auditTrail = results.map((r, i) => ({
    order: i + 1,
    step_id: r.step_id,
    command: r.command,
    status: r.status,
    exit_code: r.exit_code,
    error: r.error || null,
    verify: r.verify || null,
    duration_note: r.status === "success" ? "completed" : r.status,
  }));

  // Rollback audit
  const rollbackAudit = rollbacks.map((rb) => ({
    failed_step: rb.failed_step,
    rollback_status: rb.rollback?.status || "unknown",
    rollback_error: rb.rollback?.error || null,
  }));

  // Overall health assessment
  const total = results.length;
  const successRate = total > 0 ? Math.round((byStatus.success.length / total) * 100) : 0;
  const hasFailures = byStatus.error.length + byStatus.verify_failed.length > 0;
  const hasRollbacks = rollbacks.length > 0;

  let healthStatus;
  if (resultsData.aborted) {
    healthStatus = "aborted";
  } else if (!hasFailures && !hasRollbacks) {
    healthStatus = "healthy";
  } else if (hasFailures && resultsData.status === "completed_with_errors") {
    healthStatus = "degraded";
  } else if (hasRollbacks) {
    healthStatus = "rolled_back";
  } else {
    healthStatus = "unknown";
  }

  return {
    summary: {
      status: resultsData.status,
      health: healthStatus,
      total_steps: total,
      succeeded: byStatus.success.length,
      failed: byStatus.error.length + byStatus.verify_failed.length,
      skipped: byStatus.skipped.length,
      dry_run: byStatus.dry_run.length,
      success_rate: successRate,
      aborted: resultsData.aborted || false,
      rollbacks_executed: rollbacks.length,
      plan_summary: resultsData.plan_summary || "",
    },
    audit_trail: auditTrail,
    failures: {
      error_count: byStatus.error.length,
      verify_failed_count: byStatus.verify_failed.length,
      groups: Object.values(failureGroups),
    },
    rollbacks: rollbackAudit,
    by_status: {
      success: byStatus.success.length,
      error: byStatus.error.length,
      verify_failed: byStatus.verify_failed.length,
      skipped: byStatus.skipped.length,
      dry_run: byStatus.dry_run.length,
    },
  };
}

function categorizeError(errorMessage) {
  const msg = (errorMessage || "").toLowerCase();
  if (msg.includes("not found") || msg.includes("resource_not_found")) {
    return "command_not_found";
  }
  if (msg.includes("auth") || msg.includes("401") || msg.includes("403") || msg.includes("unauthorized")) {
    return "authentication_error";
  }
  if (msg.includes("timeout") || msg.includes("timed out")) {
    return "timeout_error";
  }
  if (msg.includes("network") || msg.includes("econnrefused") || msg.includes("enotfound")) {
    return "network_error";
  }
  if (msg.includes("rate limit") || msg.includes("429")) {
    return "rate_limit_error";
  }
  if (msg.includes("missing") && msg.includes("command")) {
    return "missing_command_field";
  }
  if (msg.includes("invalid") && msg.includes("format")) {
    return "invalid_format";
  }
  if (msg.includes("adapter") && msg.includes("not found")) {
    return "adapter_not_found";
  }
  return "unknown_error";
}

function suggestFix(errorCategory) {
  const fixes = {
    command_not_found: "Verify the command exists: sc commands --query <keyword> --json. The plan may reference a command that isn't installed.",
    authentication_error: "Check API keys and credentials. The command may require auth env vars that aren't set.",
    timeout_error: "The command took too long. Consider increasing timeout or checking if the target service is responsive.",
    network_error: "Cannot reach the target service. Check network connectivity and the service URL.",
    rate_limit_error: "Rate limit exceeded. Wait and retry, or reduce parallelism in the plan.",
    missing_command_field: "The plan step is missing the 'command' field. Fix the plan JSON.",
    invalid_format: "The command format is invalid. Expected namespace.resource.action.",
    adapter_not_found: "The command's adapter is not installed locally and no server is available. Install the adapter or configure SUPERCLI_SERVER.",
    verify_failed: "The verify command failed or was not found. Check that the verify command exists and returns success when the step actually succeeded.",
    unknown_error: "Review the error message for details. This is an uncategorized error.",
  };
  return fixes[errorCategory] || fixes.unknown_error;
}

async function llmAnalyzeFailures(analysis, resultsData, baseUrl, model, apiKey) {
  const failures = analysis.failures.groups;
  if (failures.length === 0) return null;

  const failureSummary = failures.map((g) => ({
    category: g.category,
    step_count: g.steps.length,
    step_ids: g.steps.map((s) => s.step_id),
    sample_error: g.steps[0]?.error || "",
  }));

  const systemPrompt = `You are an AI DevOps debugger. Analyze execution failures from a workflow run and suggest actionable fixes.

Failures:
${JSON.stringify(failureSummary, null, 2)}

Plan summary: ${analysis.summary.plan_summary}
Total steps: ${analysis.summary.total_steps}
Succeeded: ${analysis.summary.succeeded}
Failed: ${analysis.summary.failed}

Respond STRICTLY with a valid JSON array of fix suggestions. Do not wrap in markdown.
Format:
[
  {
    "category": "error category",
    "severity": "high|medium|low",
    "diagnosis": "What likely went wrong",
    "fix": "Specific action to resolve it",
    "prevent": "How to prevent it in future runs"
  }
]`;

  const r = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze these failures: ${JSON.stringify(failureSummary)}` },
      ],
      temperature: 0,
    }),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`LLM Error ${r.status}: ${txt}`);
  }

  const data = await r.json();
  const content =
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;
  if (!content) throw new Error("Invalid LLM response");

  let jsonStr = content.trim();
  if (jsonStr.startsWith("```json"))
    jsonStr = jsonStr.replace(/^```json/, "").replace(/```$/, "").trim();
  else if (jsonStr.startsWith("```"))
    jsonStr = jsonStr.replace(/^```/, "").replace(/```$/, "").trim();

  return JSON.parse(jsonStr);
}

async function handleReviewCommand({
  positional,
  flags,
  context,
  humanMode,
  output,
  outputError,
}) {
  let resultsData;
  try {
    resultsData = readResultsFromInput(positional, flags);
  } catch (err) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: `Failed to read results: ${err.message}`,
      recoverable: false,
      suggestions: [
        "sc act --file plan.json --json > results.json  (generate results first)",
        "sc review --file results.json  (review them)",
      ],
    });
    return;
  }

  if (!resultsData || !Array.isArray(resultsData.results)) {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: 'Usage: sc review --file <results.json>  |  cat results.json | sc review  |  sc review \'<json>\'',
      recoverable: false,
      suggestions: [
        "sc act --file plan.json --json > results.json  (generate results)",
        "sc review --file results.json  (review them)",
      ],
    });
    return;
  }

  const analysis = analyzeResults(resultsData);

  // Optional LLM analysis of failures
  const useLLM = flags["llm-analyze"] && analysis.failures.groups.length > 0;
  if (useLLM) {
    const hasLocalLLM = !!process.env.OPENAI_BASE_URL;
    if (hasLocalLLM) {
      try {
        const llmSuggestions = await llmAnalyzeFailures(
          analysis,
          resultsData,
          process.env.OPENAI_BASE_URL,
          process.env.OPENAI_MODEL || "gpt-3.5-turbo",
          process.env.OPENAI_API_KEY || "dummy",
        );
        analysis.llm_analysis = llmSuggestions;
      } catch (err) {
        analysis.llm_analysis_error = err.message;
      }
    } else {
      analysis.llm_analysis_error = "OPENAI_BASE_URL not set — cannot run LLM analysis";
    }
  }

  // Save to file if requested
  if (flags.save) {
    const reviewOutput = {
      version: "1.0",
      mode: "review",
      reviewed_at: new Date().toISOString(),
      ...analysis,
    };
    fs.writeFileSync(flags.save, JSON.stringify(reviewOutput, null, 2));
    if (humanMode) {
      process.stderr.write(`  Review saved to ${flags.save}\n`);
    }
  }

  if (humanMode) {
    console.log("\n  🔍 Review\n");
    console.log(`  Plan: ${analysis.summary.plan_summary || "(no summary)"}`);
    console.log(`  Status: ${analysis.summary.status}`);
    console.log(`  Health: ${analysis.summary.health}`);
    console.log(`  Success rate: ${analysis.summary.success_rate}% (${analysis.summary.succeeded}/${analysis.summary.total_steps})`);
    if (analysis.summary.aborted) console.log("  ⛔ Plan was aborted");
    console.log("");

    console.log("  Audit trail:");
    for (const entry of analysis.audit_trail) {
      const icon = entry.status === "success" ? "✓"
        : entry.status === "error" ? "✗"
        : entry.status === "verify_failed" ? "⚠"
        : entry.status === "skipped" ? "⊘"
        : entry.status === "dry_run" ? "○"
        : "?";
      console.log(`    ${entry.order}. ${icon} ${entry.step_id} (${entry.status})`);
      if (entry.error) console.log(`       error: ${entry.error.substring(0, 100)}`);
      if (entry.verify && entry.verify.status !== "passed" && entry.verify.status !== "skipped") {
        console.log(`       verify: ${entry.verify.status}`);
      }
    }

    if (analysis.failures.groups.length > 0) {
      console.log("\n  Failure analysis:");
      for (const group of analysis.failures.groups) {
        console.log(`    [${group.category}] ${group.steps.length} step(s): ${group.steps.map((s) => s.step_id).join(", ")}`);
        console.log(`      suggestion: ${group.suggestion}`);
      }
    }

    if (analysis.rollbacks.length > 0) {
      console.log("\n  Rollback audit:");
      for (const rb of analysis.rollbacks) {
        console.log(`    ${rb.failed_step}: rollback ${rb.rollback_status}`);
        if (rb.rollback_error) console.log(`      error: ${rb.rollback_error}`);
      }
    }

    if (analysis.llm_analysis && Array.isArray(analysis.llm_analysis)) {
      console.log("\n  LLM analysis:");
      for (const suggestion of analysis.llm_analysis) {
        console.log(`    [${suggestion.severity || "?"}] ${suggestion.category}`);
        console.log(`      diagnosis: ${suggestion.diagnosis}`);
        console.log(`      fix: ${suggestion.fix}`);
        if (suggestion.prevent) console.log(`      prevent: ${suggestion.prevent}`);
      }
    } else if (analysis.llm_analysis_error) {
      console.log(`\n  LLM analysis: skipped (${analysis.llm_analysis_error})`);
    }

    console.log("");
  } else {
    output({
      version: "1.0",
      mode: "review",
      reviewed_at: new Date().toISOString(),
      ...analysis,
    });
  }
}

module.exports = { handleReviewCommand };
