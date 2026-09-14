/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BoredomResult from './BoredomResult.jsx'
import CheckInResult from './CheckInResult.jsx'
import ThoughtChallengerResult from './ThoughtChallengerResult.jsx'
import { formatBeliefShift } from '../data/checkins/thought-challenger.js'

const FORBIDDEN = [
  'Dev: logic audit',
  'logic audit',
  'debug',
  'undefined%',
  'null%',
  'NaN%',
  '[object Object]',
  'rejected',
  'a1-trigger',
]

function expectNoForbiddenText(container) {
  const text = container.textContent || ''
  for (const phrase of FORBIDDEN) {
    expect(text.toLowerCase()).not.toContain(phrase.toLowerCase())
  }
  expect(text).not.toMatch(/undefined/i)
}

const boredomAnswers = {
  'b-energy': { id: 'en-calm' },
  'b-setting': { id: 'set-out-with' },
  'b-cravings': { multi: true, options: [{ id: 'crave-comfort' }] },
  'b-limits': { id: 'b-limits', time: 'time-hour', budget: 'budget-more' },
}

const angerState = {
  resultId: 'HURT',
  answersByQuestionId: {
    'a1-trigger': { id: 'a1-c' },
    'a2-underlying': { id: 'a2-a' },
    'a3-boundary': { id: 'a3-c' },
    'a4-safety': { id: 'a4-safety-no' },
    'a4-experience': { id: 'a4-e' },
    'a5-physical': { id: 'a5-a' },
    'a6-need': { id: 'a6-a', tailoring: { phraseNeed: 'to be heard' } },
  },
  tailoring: { phraseNeed: 'to be heard' },
}

describe('result page production hygiene', () => {
  it('boredom result has no dev or internal data visible', () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/quiz/help-my-boredom/result/suggestions',
            state: { answersByQuestionId: boredomAnswers, history: [] },
          },
        ]}
      >
        <Routes>
          <Route path="/quiz/:quizId/result/suggestions" element={<BoredomResult />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Here are some ideas')).toBeInTheDocument()
    expect(screen.getByText('Best match')).toBeInTheDocument()
    expectNoForbiddenText(container)
    expect(container.querySelector('details')).toBeNull()
  })

  it('anger result shows visible sections without accordions', () => {
    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/quiz/behind-my-anger/result/hurt', state: angerState }]}>
        <Routes>
          <Route path="/quiz/:quizId/result/:resultId" element={<CheckInResult />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('What may be underneath')).toBeInTheDocument()
    expect(screen.getByText('What may help now')).toBeInTheDocument()
    expect(screen.getByText('Words you could use')).toBeInTheDocument()
    expectNoForbiddenText(container)
    expect(container.querySelector('details')).toBeNull()
  })

  it('thought result omits belief shift when after rating missing', () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/quiz/thought-challenger/result/complete',
            state: {
              thought: 'They hate me',
              balancedThought: 'I do not know what they think',
              patterns: [{ id: 'MIND_READING', label: 'Mind reading', description: 'Test' }],
              beliefBefore: 70,
              beliefBeforeRated: true,
              beliefAfterRated: false,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/quiz/:quizId/result/complete" element={<ThoughtChallengerResult />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByText(/Belief shift/i)).not.toBeInTheDocument()
    expect(container.textContent).not.toContain('undefined')
  })

  it('thought result shows belief shift when both ratings supplied', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/quiz/thought-challenger/result/complete',
            state: {
              thought: 'They hate me',
              balancedThought: 'I do not know what they think',
              patterns: [{ id: 'MIND_READING', label: 'Mind reading', description: 'Test' }],
              beliefBefore: 80,
              beliefBeforeRated: true,
              beliefAfter: 40,
              beliefAfterRated: true,
            },
          },
        ]}
      >
        <Routes>
          <Route path="/quiz/:quizId/result/complete" element={<ThoughtChallengerResult />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Before: 80% → After: 40%')).toBeInTheDocument()
  })
})

describe('formatBeliefShift', () => {
  it('returns null when only before is rated', () => {
    expect(formatBeliefShift(70, 40, { beforeRated: true, afterRated: false })).toBeNull()
  })

  it('returns null when only after is rated', () => {
    expect(formatBeliefShift(70, 40, { beforeRated: false, afterRated: true })).toBeNull()
  })

  it('returns null when neither is rated', () => {
    expect(formatBeliefShift(70, 40, { beforeRated: false, afterRated: false })).toBeNull()
  })

  it('formats when both are rated', () => {
    expect(formatBeliefShift(70, 40, { beforeRated: true, afterRated: true })).toBe(
      'Before: 70% → After: 40%'
    )
  })
})

const feelingState = {
  resultId: 'SPARK',
  answersByQuestionId: {
    q1: { id: 'q1-a' },
    q2: { id: 'q2-a' },
    q3: { id: 'q3-a' },
    q4: { id: 'q4-a' },
    q5: { id: 'q5-a' },
    q6: { id: 'q6-a' },
  },
}

const procrastinationState = {
  resultId: 'UNCLEAR',
  answersByQuestionId: {
    p1: { id: 'p1-a' },
    p2: { id: 'p2-a' },
    p3: { id: 'p3-a' },
    p4: { id: 'p4-a' },
    p5: { id: 'p5-a' },
    p6: { id: 'p6-a' },
  },
}

describe('result visibility by tool', () => {
  it('feeling result shows immediate action and why without accordions', () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/quiz/why-do-i-feel-weird/result/spark', state: feelingState },
        ]}
      >
        <Routes>
          <Route path="/quiz/:quizId/result/:resultId" element={<CheckInResult />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Try this now')).toBeInTheDocument()
    expect(screen.getByText('Why this might fit')).toBeInTheDocument()
    expect(screen.getByText('More support in the Dear Friend app')).toBeInTheDocument()
    expect(container.querySelector('details')).toBeNull()
    expectNoForbiddenText(container)
  })

  it('procrastination result shows strategy and reminder visibly', () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/quiz/why-procrastinating/result/unclear', state: procrastinationState },
        ]}
      >
        <Routes>
          <Route path="/quiz/:quizId/result/:resultId" element={<CheckInResult />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Your five-minute starting step')).toBeInTheDocument()
    expect(screen.getByText('Why this may be happening')).toBeInTheDocument()
    expect(screen.getByText('Try this')).toBeInTheDocument()
    expect(screen.getAllByText('Dear Friend reminder').length).toBeGreaterThan(0)
    expect(container.querySelector('details')).toBeNull()
    expectNoForbiddenText(container)
  })
})
