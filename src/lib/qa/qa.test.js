import { describe, it, expect } from 'vitest'
import { generateQaReport } from './generateReport.js'
import fs from 'node:fs'
import path from 'node:path'

describe('QA report', () => {
  it('generates a readable report', () => {
    const report = generateQaReport()
    expect(report).toContain('Dear Friend Check-Ins QA Report')
    expect(report).toContain('Boredom catalogue')

    const out = path.join(process.cwd(), 'qa-report.txt')
    fs.writeFileSync(out, report, 'utf8')
    expect(fs.existsSync(out)).toBe(true)
  })
})
