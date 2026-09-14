import { describe, it, expect } from 'vitest'
import { getProgress, getApplicableQuestions } from './quizFlow.js'
import feeling from '../data/checkins/feeling.js'
import anger from '../data/checkins/anger.js'
import boredom from '../data/checkins/boredom.js'
import needs from '../data/checkins/needs.js'
import procrastination from '../data/checkins/procrastination.js'

const tools = [
  { name: 'feeling', checkin: feeling, total: 6 },
  { name: 'anger', checkin: anger, total: 7 },
  { name: 'boredom', checkin: boredom, total: 4 },
  { name: 'needs', checkin: needs, total: 6 },
  { name: 'procrastination', checkin: procrastination, total: 6 },
]

describe('quizFlow progress', () => {
  it.each(tools)('$name: first question is not 100%', ({ checkin, total }) => {
    const applicable = getApplicableQuestions(checkin, {})
    const firstId = applicable[0].id
    const p = getProgress(checkin, {}, firstId)
    expect(p.total).toBe(total)
    expect(p.current).toBe(1)
    expect(p.percent).toBeLessThan(100)
  })

  it.each(tools)('$name: last question is 100%', ({ checkin, total }) => {
    const applicable = getApplicableQuestions(checkin, {})
    const answers = {}
    applicable.slice(0, -1).forEach((q) => {
      answers[q.id] = { id: `${q.id}-answered` }
    })
    const lastId = applicable[applicable.length - 1].id
    const p = getProgress(checkin, answers, lastId)
    expect(p.current).toBe(total)
    expect(p.percent).toBe(100)
  })

  it('anger short-circuit: sequential steps without skipped numbers', () => {
    const routeIds = ['a1-trigger', 'a2-underlying', 'a3-boundary', 'a4-safety']
    let previousPercent = 0

    for (let i = 0; i < routeIds.length; i++) {
      const partial = {}
      for (let j = 0; j < i; j++) partial[routeIds[j]] = { id: 'answered' }
      const p = getProgress(anger, partial, routeIds[i])
      expect(p.current).toBe(i + 1)
      expect(p.percent).toBeGreaterThanOrEqual(previousPercent)
      expect(p.percent).toBeLessThan(100)
      previousPercent = p.percent
    }

    const completed = {
      'a1-trigger': { id: 'a1-a' },
      'a2-underlying': { id: 'a2-a' },
      'a3-boundary': { id: 'a3-c' },
      'a4-safety': { id: 'a4-a', shortCircuit: 'SAFETY' },
    }
    const done = getProgress(anger, completed, 'a4-safety')
    expect(done.current).toBe(4)
    expect(done.total).toBe(4)
    expect(done.percent).toBe(100)
  })
})
