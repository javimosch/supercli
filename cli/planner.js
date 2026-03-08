const crypto = require("crypto")

function generatePlanId() {
  return "plan_" + crypto.randomBytes(6).toString("hex")
}

function createPlan(cmd, args) {
  const steps = []

  // Step 1: Resolve command
  steps.push({
    step: 1,
    type: "resolve_command",
    description: "Resolve command definition from config cache"
  })

  // Step 2: Validate args
  steps.push({
    step: 2,
    type: "validate_args",
    description: "Validate input arguments against schema"
  })

  // Step 3: Adapter request
  const adapterStep = { step: 3, type: "adapter_request", adapter: cmd.adapter }
  if (cmd.adapter === "openapi") {
    adapterStep.method = (cmd.adapterConfig && cmd.adapterConfig.method) || "GET"
    adapterStep.operationId = cmd.adapterConfig && cmd.adapterConfig.operationId
    adapterStep.description = `Call OpenAPI operation: ${adapterStep.operationId}`
  } else if (cmd.adapter === "http") {
    adapterStep.method = (cmd.adapterConfig && cmd.adapterConfig.method) || "GET"
    adapterStep.url = cmd.adapterConfig && cmd.adapterConfig.url
    adapterStep.description = `HTTP ${adapterStep.method} ${adapterStep.url || "(dynamic)"}`
  } else if (cmd.adapter === "mcp") {
    adapterStep.tool = cmd.adapterConfig && cmd.adapterConfig.tool
    adapterStep.description = `Call MCP tool: ${adapterStep.tool}`
  } else {
    adapterStep.description = `Execute via ${cmd.adapter} adapter`
  }
  steps.push(adapterStep)

  // Step 4: Transform output
  steps.push({
    step: 4,
    type: "transform_output",
    description: "Normalize response into structured output envelope"
  })

  // Determine side effects and risk
  const isMutation = !!(cmd.mutation)
  const riskLevel = cmd.risk_level || (isMutation ? "medium" : "safe")

  return {
    plan_id: generatePlanId(),
    command: `${cmd.namespace}.${cmd.resource}.${cmd.action}`,
    args,
    steps,
    side_effects: isMutation,
    risk_level: riskLevel,
    estimated_duration_ms: cmd.adapter === "http" || cmd.adapter === "openapi" ? 200 : 100,
    status: "planned",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  }
}

module.exports = { createPlan }
