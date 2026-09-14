/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BoredomResult from './BoredomResult.jsx'

const sampleAnswers = {
  'b-energy': { id: 'en-calm' },
  'b-setting': { id: 'set-out-with' },
  'b-cravings': { multi: true, options: [{ id: 'crave-comfort' }] },
  'b-limits': { id: 'b-limits', time: 'time-hour', budget: 'budget-more' },
}

describe('BoredomResult page', () => {
  it('renders suggestions on first paint without redirecting', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/quiz/help-my-boredom/result/suggestions',
            state: { answersByQuestionId: sampleAnswers, history: [] },
          },
        ]}
      >
        <Routes>
          <Route path="/quiz/:quizId/result/suggestions" element={<BoredomResult />} />
          <Route path="/quiz/:quizId" element={<div>Intro fallback</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Here are some ideas')).toBeInTheDocument()
    expect(screen.queryByText('Intro fallback')).not.toBeInTheDocument()
    expect(screen.getByText('Best match')).toBeInTheDocument()
  })

  it('redirects to play when session state is missing', () => {
    render(
      <MemoryRouter initialEntries={['/quiz/help-my-boredom/result/suggestions']}>
        <Routes>
          <Route path="/quiz/:quizId/result/suggestions" element={<BoredomResult />} />
          <Route path="/quiz/:quizId/play" element={<div>Play fallback</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Play fallback')).toBeInTheDocument()
  })
})
