/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AnswerCard from './AnswerCard.jsx'

describe('AnswerCard selection states', () => {
  const option = { id: 'opt-a', label: 'Option A' }

  it('renders unselected with aria-checked false', () => {
    const { container } = render(
      <AnswerCard option={option} selected={false} onSelect={() => {}} name="q1" />
    )
    const btn = container.querySelector('button[role="radio"]')
    expect(btn).toHaveAttribute('aria-checked', 'false')
    expect(btn.className).toContain('option-default')
    expect(btn.className).not.toContain('option-selected')
  })

  it('renders selected with aria-checked true', () => {
    const { container } = render(
      <AnswerCard option={option} selected onSelect={() => {}} name="q1" />
    )
    const btn = container.querySelector('button[role="radio"]')
    expect(btn).toHaveAttribute('aria-checked', 'true')
    expect(btn.className).toContain('option-selected')
  })

  it('does not appear selected before click', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <AnswerCard option={option} selected={false} onSelect={onSelect} name="q1" />
    )
    const btn = container.querySelector('button[role="radio"]')
    expect(btn).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(btn)
    expect(onSelect).toHaveBeenCalledWith(option)
  })
})
