"use strict";

const { createPlan } = require("./planner")

function buildLocalPlan(cmd, args) {
  return {
    ...createPlan(cmd, args),
    persisted: false,
    execution_mode: "local"
  }
}

function annotateServerPlan(plan) {
  return {
    ...plan,
    persisted: true,
    execution_mode: "server"
  }
}

function outputHumanPlan(plan) {
  console.log(`\n  ⚡ Execution Plan: ${plan.plan_id}\n`)
  console.log(`  Command: ${plan.command}`)
  console.log(`  Risk:    ${plan.risk_level}`)
  console.log(`  Side effects: ${plan.side_effects ? "yes" : "no"}`)
  console.log(`  Persisted: ${plan.persisted ? "yes" : "no"}`)
  console.log("\n  Steps:")
  plan.steps.forEach((s, i) => console.log(`    ${i + 1}. [${s.type}] ${s.description || s.method || ""} ${s.url || ""}`))
  if (plan.persisted) console.log(`\n  Execute: supercli execute ${plan.plan_id}`)
  else console.log("\n  Execute: local plan preview only (set SUPERCLI_SERVER for persisted execute)")
  console.log("")
}

module.exports = { buildLocalPlan, annotateServerPlan, outputHumanPlan }
