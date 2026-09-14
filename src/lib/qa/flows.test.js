import { describe, it, expect } from 'vitest'
import { getProgress, isQuizComplete, findOption } from '../quizFlow.js'
import { canGoNext, createSession, setSelectedAnswerId } from '../quizSession.js'
import { buildBoredomProfile, getBoredomRecommendations, isPaidActivity } from '../boredom/index.js'
import { scoreAngerResults } from '../scoring/angerScoring.js'
import { scoreNeedsResults } from '../scoring/needsScoring.js'
import { scoreProcrastinationResults } from '../scoring/procrastinationScoring.js'
import { scoreQuiz } from '../scoring.js'
import feeling from '../../data/checkins/feeling.js'
import anger from '../../data/checkins/anger.js'
import boredom from '../../data/checkins/boredom.js'
import needs from '../../data/checkins/needs.js'
import procrastination from '../../data/checkins/procrastination.js'

function answer(quiz, qId, optId) {
  const q = quiz.questions.find((x) => x.id === qId)
  return q.options.find((o) => o.id === optId)
}

describe('QA: all quiz flows', () => {
  it('boredom: progress is 25% on first question', () => {
    const p = getProgress(boredom, {}, 'b-energy')
    expect(p).toEqual({
      current: 1,
      total: 4,
      percent: 25,
      showTotal: true,
      applicableQuestionIds: expect.any(Array),
    })
  })

  it('boredom: completes after 4 answers and returns suggestions', () => {
    const answers = {
      'b-energy': answer(boredom, 'b-energy', 'en-calm'),
      'b-setting': answer(boredom, 'b-setting', 'set-out-with'),
      'b-cravings': { multi: true, options: [answer(boredom, 'b-cravings', 'crave-exploration')] },
      'b-limits': { id: 'b-limits', time: 'time-few', budget: 'budget-more' },
    }
    expect(isQuizComplete(boredom, answers)).toBe(true)
    const profile = buildBoredomProfile(answers)
    expect(profile.budget).toBe('higher-spend')
    const rec = getBoredomRecommendations(profile, [])
    expect(rec.best).toBeTruthy()
    expect([rec.best, rec.easy, rec.wildcard].filter(isPaidActivity).length).toBeGreaterThanOrEqual(2)
  })

  it('boredom: next disabled until compound limits answered', () => {
    let session = createSession(boredom.id)
    session = setSelectedAnswerId(session, 'b-limits', { time: 'time-hour' })
    expect(canGoNext(session, 'b-limits', 'compound')).toBe(false)
    session = setSelectedAnswerId(session, 'b-limits', {
      time: 'time-hour',
      budget: 'budget-more',
    })
    expect(canGoNext(session, 'b-limits', 'compound')).toBe(true)
  })

  it('anger: recorded journey is not boundary primary', () => {
    const answers = {
      'a1-trigger': answer(anger, 'a1-trigger', 'a1-c'),
      'a2-underlying': answer(anger, 'a2-underlying', 'a2-a'),
      'a3-boundary': answer(anger, 'a3-boundary', 'a3-c'),
      'a4-signals': answer(anger, 'a4-signals', 'a4-c'),
      'a5-physical': answer(anger, 'a5-physical', 'a5-a'),
      'a6-need': answer(anger, 'a6-need', 'a6-a'),
    }
    const scored = scoreAngerResults(answers)
    expect(scored.resultId).not.toBe('BOUNDARY')
    expect(scored.resultId).toBe('HURT')
  })

  it('needs: physical reset for hunger + validation secondary', () => {
    const answers = {
      n1: answer(needs, 'n1', 'n1-b'),
      n2: answer(needs, 'n2', 'n2-c'),
      n3: answer(needs, 'n3', 'n3-d'),
      n4: answer(needs, 'n4', 'n4-b'),
      n5: answer(needs, 'n5', 'n5-a'),
      'n6-format': answer(needs, 'n6-format', 'n6-b'),
    }
    const scored = scoreNeedsResults(answers)
    expect(scored.resultId).toBe('PHYSICAL_RESET')
    expect(scored.layered?.startHere).toMatch(/basic needs/i)
    expect(scored.secondResultId).toBeTruthy()
  })

  it('procrastination: returns a primary result', () => {
    const answers = {
      p1: answer(procrastination, 'p1', 'p1-a'),
      p2: answer(procrastination, 'p2', 'p2-a'),
      p3: answer(procrastination, 'p3', 'p3-a'),
      p4: answer(procrastination, 'p4', 'p4-a'),
      p5: answer(procrastination, 'p5', 'p5-a'),
      p6: answer(procrastination, 'p6', 'p6-a'),
    }
    const scored = scoreProcrastinationResults(answers)
    expect(scored.resultId).toBe('UNCLEAR')
  })

  it('feeling: scores from answers by question id', () => {
    const answers = {
      q1: answer(feeling, 'q1', 'q1-a'),
      q2: answer(feeling, 'q2', 'q2-a'),
      q3: answer(feeling, 'q3', 'q3-a'),
      q4: answer(feeling, 'q4', 'q4-a'),
      q5: answer(feeling, 'q5', 'q5-a'),
      q6: answer(feeling, 'q6', 'q6-a'),
    }
    const scored = scoreQuiz(feeling, answers)
    expect(scored.resultId).toBe('SPARK')
  })

  it('weighted quizzes: 6 consecutive question numbers', () => {
    for (const quiz of [anger, needs, procrastination]) {
      const applicable = quiz.questions
      expect(applicable.length).toBe(6)
      applicable.forEach((q, i) => {
        const partial = {}
        for (let j = 0; j < i; j++) partial[applicable[j].id] = { id: 'answered' }
        const p = getProgress(quiz, partial, q.id)
        expect(p.current).toBe(i + 1)
        expect(p.total).toBe(6)
      })
    }
  })
})
