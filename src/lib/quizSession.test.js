import { describe, it, expect } from 'vitest'
import anger from '../data/checkins/anger.js'
import {
  createSession,
  setSelectedAnswerId,
  commitAnswer,
  goBackOneQuestion,
  canGoNext,
  resetSession,
  toggleMultiSelect,
} from './quizSession.js'
import { findOption } from './quizFlow.js'

describe('quizSession', () => {
  it('starts with null selection', () => {
    const session = createSession('test')
    expect(session.selectedAnswerIdByQuestionId).toEqual({})
    expect(session.answersByQuestionId).toEqual({})
  })

  it('Next requires active selection', () => {
    const session = createSession('test')
    expect(canGoNext(session, 'a1-trigger', 'single')).toBe(false)
    const withSel = setSelectedAnswerId(session, 'a1-trigger', 'a1-a')
    expect(canGoNext(withSel, 'a1-trigger', 'single')).toBe(true)
  })

  it('commit and back restores genuine selection', () => {
    let session = createSession(anger.id)
    session = setSelectedAnswerId(session, 'a1-trigger', 'a1-a')
    session = commitAnswer(session, anger, 'a1-trigger', findOption)
    session = setSelectedAnswerId(session, 'a2-underlying', 'a2-b')
    session = commitAnswer(session, anger, 'a2-underlying', findOption)
    session = goBackOneQuestion(session, anger)
    expect(session.answersByQuestionId['a2-underlying']).toBeUndefined()
    expect(session.selectedAnswerIdByQuestionId['a2-underlying']).toBe('a2-b')
  })

  it('reset clears all state', () => {
    let session = createSession(anger.id)
    session = setSelectedAnswerId(session, 'a1-trigger', 'a1-a')
    session = commitAnswer(session, anger, 'a1-trigger', findOption)
    const fresh = resetSession(anger.id)
    expect(fresh.answersByQuestionId).toEqual({})
    expect(fresh.selectedAnswerIdByQuestionId).toEqual({})
  })

  it('compound limits require both fields', () => {
    const session = createSession('help-my-boredom')
    expect(canGoNext(session, 'b-limits', 'compound')).toBe(false)
    let s = { ...session, selectedAnswerIdByQuestionId: { 'b-limits': { time: 'time-hour' } } }
    expect(canGoNext(s, 'b-limits', 'compound')).toBe(false)
    s = {
      ...session,
      selectedAnswerIdByQuestionId: { 'b-limits': { time: 'time-hour', budget: 'budget-free' } },
    }
    expect(canGoNext(s, 'b-limits', 'compound')).toBe(true)
  })

  it('clears cravings when selecting I genuinely do not know', () => {
    let session = createSession('help-my-boredom')
    session = toggleMultiSelect(session, 'b-cravings', 'crave-comfort', 2)
    session = toggleMultiSelect(session, 'b-cravings', 'crave-exploration', 2)
    expect(session.selectedAnswerIdByQuestionId['b-cravings']).toEqual([
      'crave-comfort',
      'crave-exploration',
    ])
    session = toggleMultiSelect(session, 'b-cravings', 'crave-unsure', 2)
    expect(session.selectedAnswerIdByQuestionId['b-cravings']).toEqual(['crave-unsure'])
  })

  it('clears unsure when selecting a specific craving', () => {
    let session = createSession('help-my-boredom')
    session = toggleMultiSelect(session, 'b-cravings', 'crave-unsure', 2)
    session = toggleMultiSelect(session, 'b-cravings', 'crave-comfort', 2)
    expect(session.selectedAnswerIdByQuestionId['b-cravings']).toEqual(['crave-comfort'])
  })
})
