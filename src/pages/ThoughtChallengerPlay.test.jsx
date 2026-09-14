/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ThoughtChallengerPlay from './ThoughtChallengerPlay.jsx'

function renderPlay() {
  return render(
    <MemoryRouter initialEntries={['/quiz/thought-challenger/reflect']}>
      <Routes>
        <Route path="/quiz/:quizId/reflect" element={<ThoughtChallengerPlay />} />
      </Routes>
    </MemoryRouter>
  )
}

function advanceToStep3() {
  renderPlay()
  fireEvent.change(screen.getByLabelText(/What thought showed up/i), {
    target: { value: 'They hate me' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))

  while (!screen.queryByRole('button', { name: 'Skip this step' })) {
    const noButtons = screen.queryAllByRole('radio', { name: 'No' })
    if (!noButtons.length) break
    fireEvent.click(noButtons[0])
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  }
}

describe('ThoughtChallengerPlay step 3', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows Skip this step before a prompt is selected', () => {
    advanceToStep3()
    expect(screen.getByRole('button', { name: 'Skip this step' })).toBeInTheDocument()
  })

  it('changes to Continue after selecting a reflection prompt', () => {
    advanceToStep3()
    fireEvent.click(screen.getAllByRole('radio', { name: /What do I know for certain/i })[0])
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: 'Skip this step' })).toHaveLength(0)
  })

  it('shows optional text field for a selected prompt', () => {
    advanceToStep3()
    fireEvent.click(screen.getAllByRole('radio', { name: /What do I know for certain/i })[0])
    expect(screen.getByLabelText(/What do I know for certain\? \(optional\)/i)).toBeInTheDocument()
  })

  it('retains reflection text after Continue and Back', () => {
    advanceToStep3()
    fireEvent.click(screen.getAllByRole('radio', { name: /What do I know for certain/i })[0])
    fireEvent.change(screen.getByLabelText(/What do I know for certain\? \(optional\)/i), {
      target: { value: 'I only know my own reaction' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText(/Your fairer thought/i)).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: /Back/i })[0])
    expect(screen.getByLabelText(/What do I know for certain\? \(optional\)/i)).toHaveValue(
      'I only know my own reaction'
    )
  })

  it('warns before clearing response when switching prompts', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    advanceToStep3()
    fireEvent.click(screen.getAllByRole('radio', { name: /What do I know for certain/i })[0])
    fireEvent.change(screen.getByLabelText(/What do I know for certain\? \(optional\)/i), {
      target: { value: 'Some notes' },
    })
    fireEvent.click(screen.getAllByRole('radio', { name: /What might I be assuming/i })[0])
    expect(screen.getByLabelText(/What do I know for certain\? \(optional\)/i)).toHaveValue(
      'Some notes'
    )
    vi.restoreAllMocks()
  })
})
