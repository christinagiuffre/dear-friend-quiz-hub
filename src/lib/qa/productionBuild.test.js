import { describe, it, expect, beforeAll } from 'vitest'
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const FORBIDDEN_IN_BUNDLE = [
  'Dev: logic audit',
  'DevAuditPanel',
  'attachScoringAudit',
  'rejected candidates',
  'Raw answer IDs',
  'logic audit',
]

function collectDistFiles(dir) {
  if (!existsSync(dir)) return []
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return collectDistFiles(full)
    if (/\.(js|css|html)$/i.test(entry.name)) return [full]
    return []
  })
}

describe('production build hygiene', () => {
  beforeAll(() => {
    execSync('npm run build', { stdio: 'pipe', cwd: process.cwd() })
  }, 60000)

  it('bundle does not contain developer audit strings', () => {
    const files = collectDistFiles(join(process.cwd(), 'dist'))
    expect(files.length).toBeGreaterThan(0)

    const combined = files.map((file) => readFileSync(file, 'utf8')).join('\n')
    for (const phrase of FORBIDDEN_IN_BUNDLE) {
      expect(combined).not.toContain(phrase)
    }
  })
})
