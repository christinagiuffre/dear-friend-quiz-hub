import { describe, it, expect } from 'vitest'
import { scoreQuiz, scoreWeightedQuiz } from '../scoring.js'
import { scoreAngerResults } from '../scoring/angerScoring.js'
import { scoreNeedsResults } from '../scoring/needsScoring.js'
import { scoreProcrastinationResults } from '../scoring/procrastinationScoring.js'
import feeling from '../../data/checkins/feeling.js'
import anger from '../../data/checkins/anger.js'
import needs from '../../data/checkins/needs.js'
import procrastination from '../../data/checkins/procrastination.js'

function byId(quiz, pairs) {
  const answers = {}
  for (const [qId, optId] of pairs) {
    const q = quiz.questions.find((x) => x.id === qId)
    const opt = q.options.find((o) => o.id === optId)
    answers[qId] = opt
  }
  return answers
}

describe('scoreQuiz (simple)', () => {
  it('picks the most frequent result', () => {
    const answers = byId(feeling, [
      ['q1', 'q1-a'],
      ['q2', 'q2-a'],
      ['q3', 'q3-a'],
      ['q4', 'q4-a'],
      ['q5', 'q5-a'],
      ['q6', 'q6-a'],
    ])
    const result = scoreQuiz(feeling, answers)
    expect(result.resultId).toBe('SPARK')
  })
})

describe('anger scoring', () => {
  it('recorded journey does not primary BOUNDARY', () => {
    const answers = byId(anger, [
      ['a1-trigger', 'a1-c'],
      ['a2-underlying', 'a2-a'],
      ['a3-boundary', 'a3-c'],
      ['a4-safety', 'a4-safety-no'],
      ['a4-experience', 'a4-c'],
      ['a5-physical', 'a5-a'],
      ['a6-need', 'a6-a'],
    ])
    const result = scoreAngerResults(answers)
    expect(result.resultId).not.toBe('BOUNDARY')
    expect(['HURT', 'UNFAIR', 'POWERLESS', 'OVERLOAD', 'CAPACITY', 'THREAT']).toContain(
      result.resultId
    )
  })

  it('tailoring does not change cause', () => {
    const base = byId(anger, [
      ['a1-trigger', 'a1-b'],
      ['a2-underlying', 'a2-b'],
      ['a3-boundary', 'a3-a'],
      ['a4-safety', 'a4-safety-no'],
      ['a4-experience', 'a4-d'],
      ['a5-physical', 'a5-c'],
    ])
    const a = scoreAngerResults({ ...base, 'a6-need': anger.questions[6].options[0] })
    const b = scoreAngerResults({ ...base, 'a6-need': anger.questions[6].options[4] })
    expect(a.resultId).toBe(b.resultId)
  })

  it('short-circuits to safety only for explicit physical risk', () => {
    const answers = byId(anger, [['a4-safety', 'a4-a']])
    const result = scoreAngerResults(answers)
    expect(result.resultId).toBe('SAFETY')
  })

  it('dismissed, powerless and unfair answers do not short-circuit to safety', () => {
    for (const optId of ['a4-b', 'a4-c', 'a4-d']) {
      const answers = byId(anger, [
        ['a1-trigger', 'a1-a'],
        ['a2-underlying', 'a2-a'],
        ['a3-boundary', 'a3-c'],
        ['a4-safety', 'a4-safety-no'],
        ['a4-experience', optId],
        ['a5-physical', 'a5-c'],
        ['a6-need', 'a6-a'],
      ])
      const result = scoreAngerResults(answers)
      expect(result.resultId).not.toBe('SAFETY')
    }
  })

  it('emotional unease routes to threat not safety short-circuit', () => {
    const answers = byId(anger, [
      ['a1-trigger', 'a1-a'],
      ['a2-underlying', 'a2-c'],
      ['a3-boundary', 'a3-c'],
      ['a4-safety', 'a4-safety-no'],
      ['a4-experience', 'a4-e'],
      ['a5-physical', 'a5-c'],
      ['a6-need', 'a6-f'],
    ])
    const result = scoreAngerResults(answers)
    expect(result.resultId).toBe('THREAT')
    expect(result.resultId).not.toBe('SAFETY')
  })

  it('angry at myself does not add boundary points', () => {
    const answers = byId(anger, [
      ['a1-trigger', 'a1-a'],
      ['a2-underlying', 'a2-a'],
      ['a3-boundary', 'a3-d'],
      ['a4-safety', 'a4-safety-no'],
      ['a4-experience', 'a4-e'],
      ['a5-physical', 'a5-c'],
      ['a6-need', 'a6-f'],
    ])
    const result = scoreAngerResults(answers)
    expect(result.tally.BOUNDARY || 0).toBeLessThan(result.tally.HURT || 0)
  })
})

describe('needs scoring', () => {
  it('recorded journey prioritises physical reset over generic rest', () => {
    const answers = byId(needs, [
      ['n1', 'n1-b'],
      ['n2', 'n2-c'],
      ['n3', 'n3-d'],
      ['n4', 'n4-b'],
      ['n5', 'n5-a'],
      ['n6-format', 'n6-b'],
    ])
    const result = scoreNeedsResults(answers)
    expect(result.resultId).toBe('PHYSICAL_RESET')
    expect(result.layered?.startHere).toMatch(/basic needs/i)
    expect(result.secondResultId).toBeTruthy()
  })

  it('tailoring action adds practical then-consider', () => {
    const answers = byId(needs, [
      ['n1', 'n1-b'],
      ['n2', 'n2-c'],
      ['n3', 'n3-d'],
      ['n4', 'n4-b'],
      ['n5', 'n5-b'],
      ['n6-format', 'n6-b'],
    ])
    const result = scoreNeedsResults(answers)
    expect(result.layered?.thenConsider).toMatch(/practical/i)
  })
})

describe('procrastination scoring properties', () => {
  it('unrelated answers do not add points', () => {
    const answers = byId(procrastination, [['p1', 'p1-c']])
    const result = scoreProcrastinationResults(answers)
    expect(Object.keys(result.tally).length).toBe(0)
  })

  it('all-neutral answers return NO_CLEAR_BLOCKER', () => {
    const answers = byId(procrastination, [
      ['p1', 'p1-c'],
      ['p2', 'p2-c'],
      ['p3', 'p3-c'],
      ['p4', 'p4-d'],
      ['p5', 'p5-c'],
      ['p6', 'p6-f'],
    ])
    const result = scoreProcrastinationResults(answers)
    expect(result.resultId).toBe('NO_CLEAR_BLOCKER')
    expect(result.tally).toEqual({})
  })

  it('waiting for motivation answers still return WAITING_MOTIVATION', () => {
    const answers = byId(procrastination, [
      ['p1', 'p1-c'],
      ['p2', 'p2-c'],
      ['p3', 'p3-c'],
      ['p4', 'p4-d'],
      ['p5', 'p5-c'],
      ['p6', 'p6-d'],
    ])
    const result = scoreProcrastinationResults(answers)
    expect(result.resultId).toBe('WAITING_MOTIVATION')
  })

  it('unclear first step still returns UNCLEAR', () => {
    const answers = byId(procrastination, [
      ['p1', 'p1-a'],
      ['p2', 'p2-c'],
      ['p3', 'p3-c'],
      ['p4', 'p4-d'],
      ['p5', 'p5-c'],
      ['p6', 'p6-f'],
    ])
    const result = scoreProcrastinationResults(answers)
    expect(result.resultId).toBe('UNCLEAR')
  })
})

describe('scoreWeightedQuiz routing', () => {
  it('routes needs quiz to needs scorer', () => {
    const answers = byId(needs, [['n1', 'n1-b']])
    const result = scoreWeightedQuiz(needs, answers)
    expect(result.resultId).toBe('PHYSICAL_RESET')
  })
})
