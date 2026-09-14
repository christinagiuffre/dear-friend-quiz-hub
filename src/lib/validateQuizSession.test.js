import { describe, it, expect } from 'vitest'
import { validateQuizSession } from './validateQuizSession.js'
import boredom from '../data/checkins/boredom.js'
import anger from '../data/checkins/anger.js'

function answer(quiz, qId, optId) {
  const q = quiz.questions.find((x) => x.id === qId)
  return q.options.find((o) => o.id === optId)
}

describe('validateQuizSession', () => {
  it('rejects incomplete boredom session', () => {
    const result = validateQuizSession({
      quizId: boredom.id,
      answersByQuestionId: {
        'b-energy': answer(boredom, 'b-energy', 'en-calm'),
      },
    })
    expect(result.valid).toBe(false)
    expect(result.missingQuestionId).toBe('b-setting')
  })

  it('accepts complete boredom session', () => {
    const answers = {
      'b-energy': answer(boredom, 'b-energy', 'en-calm'),
      'b-setting': answer(boredom, 'b-setting', 'set-out-with'),
      'b-cravings': {
        multi: true,
        options: [answer(boredom, 'b-cravings', 'crave-comfort')],
      },
      'b-limits': { id: 'b-limits', time: 'time-hour', budget: 'budget-more' },
    }
    const result = validateQuizSession({ quizId: boredom.id, answersByQuestionId: answers })
    expect(result.valid).toBe(true)
  })

  it('stops applicable route after anger safety short-circuit', () => {
    const answers = {
      'a1-trigger': answer(anger, 'a1-trigger', 'a1-a'),
      'a2-underlying': answer(anger, 'a2-underlying', 'a2-a'),
      'a3-boundary': answer(anger, 'a3-boundary', 'a3-c'),
      'a4-safety': answer(anger, 'a4-safety', 'a4-a'),
    }
    const result = validateQuizSession({ quizId: anger.id, answersByQuestionId: answers })
    expect(result.valid).toBe(true)
    expect(result.applicableQuestionIds).toEqual([
      'a1-trigger',
      'a2-underlying',
      'a3-boundary',
      'a4-safety',
    ])
  })

  it('rejects stale answers outside applicable route', () => {
    const answers = {
      'b-energy': answer(boredom, 'b-energy', 'en-calm'),
      'b-setting': answer(boredom, 'b-setting', 'set-out-with'),
      'b-cravings': {
        multi: true,
        options: [answer(boredom, 'b-cravings', 'crave-comfort')],
      },
      'b-limits': { id: 'b-limits', time: 'time-hour', budget: 'budget-more' },
      'stale-question': { id: 'x' },
    }
    const result = validateQuizSession({ quizId: boredom.id, answersByQuestionId: answers })
    expect(result.valid).toBe(false)
    expect(result.error).toBe('stale_answer')
  })
})
