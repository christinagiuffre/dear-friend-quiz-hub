import fs from 'node:fs'
import path from 'node:path'
import { buildBoredomProfile, getBoredomRecommendations, validateAllActivities, BOREDOM_ACTIVITIES } from '../boredom/index.js'
import { scoreAngerResults } from '../scoring/angerScoring.js'
import { scoreNeedsResults } from '../scoring/needsScoring.js'
import { scoreProcrastinationResults } from '../scoring/procrastinationScoring.js'
import anger from '../../data/checkins/anger.js'
import needs from '../../data/checkins/needs.js'
import procrastination from '../../data/checkins/procrastination.js'

export function generateQaReport() {
  const lines = []
  const log = (s) => lines.push(s)

  log('# Dear Friend Check-Ins QA Report')
  log(`Generated: ${new Date().toISOString()}`)
  log('')

  const meta = validateAllActivities()
  const invalidMeta = meta.filter((m) => !m.valid)
  log(`## Boredom catalogue`)
  log(`- Total activities: ${BOREDOM_ACTIVITIES.length}`)
  log(`- Invalid metadata: ${invalidMeta.length}`)
  invalidMeta.forEach((m) => log(`  - ${m.id}: missing ${m.missing.join(', ')}`))
  log('')

  const angerDistribution = {}
  const needsDistribution = {}
  const procrastinationDistribution = {}

  function bump(map, key) {
    map[key] = (map[key] || 0) + 1
  }

  // Sample anger paths
  for (const q2 of anger.questions[1].options) {
    const answers = {
      'a1-trigger': anger.questions[0].options[0],
      'a2-underlying': q2,
      'a3-boundary': anger.questions[2].options[2],
      'a4-safety': anger.questions[3].options[1],
      'a4-experience': anger.questions[4].options[4],
      'a5-physical': anger.questions[5].options[2],
      'a6-need': anger.questions[6].options[0],
    }
    bump(angerDistribution, scoreAngerResults(answers).resultId)
  }

  for (const q1 of needs.questions[0].options.slice(0, 4)) {
    const answers = {
      n1: q1,
      n2: needs.questions[1].options[0],
      n3: needs.questions[2].options[0],
      n4: needs.questions[3].options[2],
      n5: needs.questions[4].options[0],
      'n6-format': needs.questions[5].options[0],
    }
    bump(needsDistribution, scoreNeedsResults(answers).resultId)
  }

  for (const q6 of procrastination.questions[5].options) {
    const answers = {
      p1: procrastination.questions[0].options[0],
      p2: procrastination.questions[1].options[0],
      p3: procrastination.questions[2].options[0],
      p4: procrastination.questions[3].options[0],
      p5: procrastination.questions[4].options[0],
      p6: q6,
    }
    bump(procrastinationDistribution, scoreProcrastinationResults(answers).resultId)
  }

  log('## Result distribution (sampled)')
  log('### Anger')
  Object.entries(angerDistribution).forEach(([k, v]) => log(`- ${k}: ${v}`))
  log('### Needs')
  Object.entries(needsDistribution).forEach(([k, v]) => log(`- ${k}: ${v}`))
  log('### Procrastination')
  Object.entries(procrastinationDistribution).forEach(([k, v]) => log(`- ${k}: ${v}`))
  log('')

  const journeyD = buildBoredomProfile({
    'b-energy': { id: 'en-unsure' },
    'b-setting': { id: 'set-flex' },
    'b-cravings': { multi: true, options: [{ id: 'crave-unsure' }] },
    'b-limits': { time: 'time-hour', budget: 'budget-flex' },
  })
  const dResult = getBoredomRecommendations(journeyD, [])
  log('## Golden journey D')
  log(`- Profile: ${JSON.stringify(journeyD)}`)
  log(`- Results: ${[dResult.best, dResult.easy, dResult.wildcard].map((a) => a?.title).join(', ')}`)
  log('')

  return lines.join('\n')
}

export function writeQaReport(filePath) {
  const report = generateQaReport()
  fs.writeFileSync(filePath, report, 'utf8')
  return report
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = path.join(process.cwd(), 'qa-report.txt')
  writeQaReport(out)
  console.log(`Wrote ${out}`)
}
