#!/usr/bin/env node
/**
 * Aggregates the per-scan JSON written by tests/e2e/a11y.spec.ts (docs/evidence/axe/*.json)
 * into docs/evidence/axe/summary.json and prints a compact table: one line per rule × route × viewport.
 *
 *   node scripts/axe-summary.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const dir = path.join(process.cwd(), 'docs', 'evidence', 'axe')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'summary.json').sort()
// Only per-scan records written by the spec (other evidence JSON in this folder, e.g. manual checks, is skipped).
const scans = files
  .map((f) => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }))
  .filter((s) => Array.isArray(s.violations) && Array.isArray(s.incomplete))

const violations = []
const incomplete = {}
for (const s of scans) {
  for (const v of s.violations) {
    violations.push({
      rule: v.id,
      impact: v.impact,
      help: v.help,
      route: s.route,
      viewport: s.viewport?.width,
      state: s.state,
      nodes: v.nodes.length,
      targets: v.nodes.map((n) => n.target.join(' ')),
      data: v.nodes.map((n) => n.data?.[0]).filter(Boolean),
      file: s.file,
    })
  }
  for (const i of s.incomplete) {
    incomplete[i.id] ??= { rule: i.id, impact: i.impact, scans: 0, nodes: 0, reasons: {} }
    incomplete[i.id].scans += 1
    incomplete[i.id].nodes += i.count
    for (const n of i.nodes) if (n.reason) incomplete[i.id].reasons[n.reason] = (incomplete[i.id].reasons[n.reason] ?? 0) + 1
  }
}

const summary = {
  generated: new Date().toISOString(),
  scans: scans.length,
  scansWithViolations: scans.filter((s) => s.violations.length).length,
  totalViolationNodes: violations.reduce((n, v) => n + v.nodes, 0),
  byImpact: violations.reduce((acc, v) => ({ ...acc, [v.impact]: (acc[v.impact] ?? 0) + 1 }), {}),
  violations,
  incomplete: Object.values(incomplete),
  clean: scans.filter((s) => !s.violations.length).map((s) => `${s.route} @${s.viewport?.width}${s.state !== 'default' ? ` (${s.state})` : ''}`),
}
fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 2))

console.log(`${summary.scans} scans · ${summary.scansWithViolations} with violations · ${summary.totalViolationNodes} failing nodes`)
for (const v of violations) {
  console.log(`- ${v.rule} [${v.impact}] ${v.route} @${v.viewport}${v.state !== 'default' ? ` (${v.state})` : ''} ×${v.nodes}: ${v.targets.slice(0, 3).join(' | ')}`)
}
console.log('incomplete (manual review):')
for (const i of summary.incomplete) console.log(`- ${i.rule} [${i.impact}] ${i.nodes} nodes in ${i.scans} scans`)
