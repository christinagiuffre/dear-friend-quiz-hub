/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CheckInResult from './CheckInResult.jsx'

const completeFeelingAnswers = {
  q1: { id: 'q1-a', result: 'SPARK' },
  q2: { id: 'q2-a', result: 'SPARK' },
  q3: { id: 'q3-a', result: 'SPARK' },
  q4: { id: 'q4-a', result: 'SPARK' },
  q5: { id: 'q5-a', result: 'SPARK' },
  q6: { id: 'q6-a', result: 'SPARK' },
}

const completePauseAnswers = {
  q1: { id: 'q1-b', result: 'PAUSE' },
  q2: { id: 'q2-b', result: 'PAUSE' },
  q3: { id: 'q3-b', result: 'PAUSE' },
  q4: { id: 'q4-b', result: 'PAUSE' },
  q5: { id: 'q5-b', result: 'PAUSE' },
  q6: { id: 'q6-b', result: 'PAUSE' },
}

function renderResultRoute(initialEntries, extraRoutes = []) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/quiz/:quizId/result/:resultId" element={<CheckInResult />} />
        <Route path="/quiz/:quizId/play" element={<div>Play fallback</div>} />
        {extraRoutes}
      </Routes>
    </MemoryRouter>
  )
}

describe('CheckInResult session integrity', () => {
  afterEach(() => {
    cleanup()
  })

  it('redirects to play when result URL has no session state', () => {
    renderResultRoute(['/quiz/why-do-i-feel-weird/result/spark'])

    expect(screen.getByText('Play fallback')).toBeInTheDocument()
    expect(screen.queryByText('You may need a spark.')).not.toBeInTheDocument()
  })

  it('redirects to play when session is incomplete', () => {
    renderResultRoute([
      {
        pathname: '/quiz/why-do-i-feel-weird/result/spark',
        state: { answersByQuestionId: { q1: { id: 'q1-a', result: 'SPARK' } } },
      },
    ])

    expect(screen.getByText('Play fallback')).toBeInTheDocument()
    expect(screen.queryByText('You may need a spark.')).not.toBeInTheDocument()
  })

  it('renders result when session is complete and URL matches score', () => {
    renderResultRoute([
      {
        pathname: '/quiz/why-do-i-feel-weird/result/spark',
        state: { answersByQuestionId: completeFeelingAnswers },
      },
    ])

    expect(screen.getByText('You may need a spark.')).toBeInTheDocument()
    expect(screen.getByText('Try this now')).toBeInTheDocument()
  })

  it('does not render wrong result when URL disagrees with scored answers', () => {
    renderResultRoute([
      {
        pathname: '/quiz/why-do-i-feel-weird/result/pause',
        state: { answersByQuestionId: completeFeelingAnswers },
      },
    ])

    expect(screen.queryByText('You may need a pause.')).not.toBeInTheDocument()
    expect(screen.getByText('You may need a spark.')).toBeInTheDocument()
  })
})
