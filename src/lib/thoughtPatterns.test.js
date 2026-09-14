import { describe, it, expect } from 'vitest'
import {
  detectPatterns,
  getPatternQuestionQueue,
  suggestBalancedThought,
  formatBeliefShift,
} from '../data/checkins/thought-challenger.js'

describe('thoughtPatterns', () => {
  it('queues keyword-matched questions first', () => {
    const queue = getPatternQuestionQueue('They always ignore me and everyone hates me')
    expect(queue[0]).toBe('q-extremes')
    expect(queue.length).toBeLessThanOrEqual(4)
  })

  it('detects mind reading from yes answer only', () => {
    const { patterns } = detectPatterns({ 'q-mindread': 'yes' })
    expect(patterns[0].id).toBe('MIND_READING')
  })

  it('maybe does not count as pattern match', () => {
    const { patterns } = detectPatterns({ 'q-mindread': 'maybe' })
    expect(patterns[0].id).toBe('NO_PATTERN')
  })

  it('returns no pattern when all answers are no', () => {
    const { patterns } = detectPatterns({ 'q-mindread': 'no', 'q-predict': 'no' })
    expect(patterns[0].id).toBe('NO_PATTERN')
  })

  it('detects patterns in queue order not array order', () => {
    const queue = getPatternQuestionQueue('They always ignore me')
    const { patterns } = detectPatterns(
      { 'q-extremes': 'yes', 'q-mindread': 'yes' },
      queue
    )
    expect(patterns[0].id).toBe('OVERGENERALISING')
    expect(patterns[1].id).toBe('MIND_READING')
  })

  it('suggestBalancedThought returns pattern starter', () => {
    const text = suggestBalancedThought([{ id: 'MIND_READING' }])
    expect(text).toContain('don’t know for certain')
  })
})
