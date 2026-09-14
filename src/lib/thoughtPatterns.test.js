import { describe, it, expect } from 'vitest'
import {
  detectPatterns,
  getPatternQuestionQueue,
  suggestBalancedThought,
  formatBeliefShift,
  thoughtHasPredictionSignal,
  thoughtSuggestsMindReading,
} from '../data/checkins/thought-challenger.js'

const DISLIKE_THOUGHT = "I don't like how they spoke to me"

describe('thoughtPatterns', () => {
  it('queues keyword-matched questions first', () => {
    const queue = getPatternQuestionQueue('They always ignore me and everyone hates me')
    expect(queue[0]).toBe('q-extremes')
    expect(queue.length).toBeLessThanOrEqual(4)
  })

  it('does not include fortune-telling question for neutral observations', () => {
    const queue = getPatternQuestionQueue(DISLIKE_THOUGHT)
    expect(queue).not.toContain('q-predict')
    expect(thoughtHasPredictionSignal(DISLIKE_THOUGHT)).toBe(false)
  })

  it('dislike observation is not fortune telling even if user says yes to unrelated prompts', () => {
    const queue = getPatternQuestionQueue(DISLIKE_THOUGHT)
    const answers = Object.fromEntries(queue.map((qId) => [qId, 'yes']))
    const { patterns } = detectPatterns(answers, queue, DISLIKE_THOUGHT)
    expect(patterns.some((p) => p.id === 'FORTUNE_TELLING')).toBe(false)
  })

  it('detects possible mind reading for "They hate me" when user confirms', () => {
    const thought = 'They hate me'
    expect(thoughtSuggestsMindReading(thought)).toBe(true)
    const queue = getPatternQuestionQueue(thought)
    expect(queue).toContain('q-mindread')
    const { patterns } = detectPatterns({ 'q-mindread': 'yes' }, queue, thought)
    expect(patterns[0].id).toBe('MIND_READING')
    expect(patterns[0].label).toMatch(/possible mind reading/i)
  })

  it('detects mind reading for explicit thought attribution', () => {
    const thought = "She thinks I'm incompetent"
    const queue = getPatternQuestionQueue(thought)
    expect(queue).toContain('q-mindread')
    const { patterns } = detectPatterns({ 'q-mindread': 'yes' }, queue, thought)
    expect(patterns[0].id).toBe('MIND_READING')
  })

  it('detects fortune telling when thought has prediction language and user confirms', () => {
    const thought = 'I am going to fail this interview'
    const queue = getPatternQuestionQueue(thought)
    expect(queue).toContain('q-predict')
    const { patterns } = detectPatterns({ 'q-predict': 'yes' }, queue, thought)
    expect(patterns[0].id).toBe('FORTUNE_TELLING')
  })

  it('neutral observation returns no clear pattern', () => {
    const thought = 'The meeting was at 3pm'
    const queue = getPatternQuestionQueue(thought)
    const { patterns } = detectPatterns(
      Object.fromEntries(queue.map((qId) => [qId, 'no'])),
      queue,
      thought
    )
    expect(patterns[0].id).toBe('NO_PATTERN')
  })

  it('single yes without thought support returns no clear pattern', () => {
    const { patterns } = detectPatterns({ 'q-mindread': 'yes' }, ['q-mindread'], DISLIKE_THOUGHT)
    expect(patterns[0].id).toBe('NO_PATTERN')
  })

  it('maybe does not count as pattern match', () => {
    const thought = 'They think I am pathetic'
    const { patterns } = detectPatterns({ 'q-mindread': 'maybe' }, ['q-mindread'], thought)
    expect(patterns[0].id).toBe('NO_PATTERN')
  })

  it('detects patterns in queue order when both have thought support', () => {
    const thought = 'They always ignore me and they think I am useless'
    const queue = getPatternQuestionQueue(thought)
    const { patterns } = detectPatterns(
      { 'q-extremes': 'yes', 'q-mindread': 'yes' },
      queue,
      thought
    )
    expect(patterns[0].id).toBe('OVERGENERALISING')
    expect(patterns[1].id).toBe('MIND_READING')
  })

  it('suggestBalancedThought stays relevant to dislike observation', () => {
    const text = suggestBalancedThought([{ id: 'NO_PATTERN' }], DISLIKE_THOUGHT)
    expect(text.toLowerCase()).toContain('didn’t like')
    expect(text.toLowerCase()).not.toContain('might happen')
  })

  it('suggestBalancedThought weaves pattern with original thought', () => {
    const text = suggestBalancedThought(
      [{ id: 'MIND_READING' }],
      'They think I am pathetic'
    )
    expect(text).toContain('They think I am pathetic')
    expect(text).toContain('don’t know for certain')
  })

  it('formatBeliefShift returns null when only before is rated', () => {
    expect(formatBeliefShift(70, 40, { beforeRated: true, afterRated: false })).toBeNull()
  })
})
