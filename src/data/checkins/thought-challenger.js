/** Pattern detection for The Thought Challenger — deterministic, non-diagnostic. */

export const thoughtPatterns = {
  OVERGENERALISING: {
    id: 'OVERGENERALISING',
    label: 'Overgeneralising or all-or-nothing thinking',
    description:
      'Words like “always”, “never” or “everyone” may be stretching one event into a permanent rule.',
  },
  MIND_READING: {
    id: 'MIND_READING',
    label: 'Mind reading',
    description:
      'You may be assuming you know what someone else thinks or feels, without clear evidence.',
  },
  FORTUNE_TELLING: {
    id: 'FORTUNE_TELLING',
    label: 'Fortune telling',
    description: 'The thought may be predicting a bad outcome as if it is already certain.',
  },
  NEGATIVE_FILTER: {
    id: 'NEGATIVE_FILTER',
    label: 'Tunnel vision or negative filtering',
    description: 'You may be focusing only on what went wrong.',
  },
  LABELLING: {
    id: 'LABELLING',
    label: 'Labelling',
    description: 'One mistake or moment may have been turned into a judgement about who you are.',
  },
  SHOULDING: {
    id: 'SHOULDING',
    label: '“Shoulding” yourself',
    description: 'The thought may include harsh “should”, “must” or “ought” rules.',
  },
  PERSONALISING: {
    id: 'PERSONALISING',
    label: 'Personalising',
    description: 'You may be taking responsibility for something you cannot fully control.',
  },
  EMOTIONAL_REASONING: {
    id: 'EMOTIONAL_REASONING',
    label: 'Emotional reasoning',
    description:
      'The thought may feel true mainly because the emotion is strong — feelings are real, but they are not always facts.',
  },
  MAGNIFYING: {
    id: 'MAGNIFYING',
    label: 'Magnifying or minimising',
    description: 'The negative may feel enormous, or positives may be dismissed.',
  },
  NO_PATTERN: {
    id: 'NO_PATTERN',
    label: 'No clear pattern',
    description:
      'No clear thinking pattern stood out. The thought may still be painful, and you can decide what response would serve you best.',
  },
}

export const patternCheckQuestions = [
  {
    id: 'q-extremes',
    key: 'extremes',
    prompt: 'Does the thought use words like “always”, “never”, “everyone” or “nothing”?',
    pattern: 'OVERGENERALISING',
    keywords: /\b(always|never|everyone|everybody|nobody|nothing|everything|constantly|forever)\b/i,
  },
  {
    id: 'q-mindread',
    key: 'mindread',
    prompt: 'Are you assuming you know what someone else thinks or feels?',
    pattern: 'MIND_READING',
    keywords: /\b(they think|he thinks|she thinks|knows i|know i|thinks i|must think|probably thinks)\b/i,
  },
  {
    id: 'q-predict',
    key: 'predict',
    prompt: 'Are you predicting a bad outcome as if it is certain?',
    pattern: 'FORTUNE_TELLING',
    keywords:
      /\b(will fail|going to fail|never work|ruin|disaster|certainly|definitely will|bound to|going to happen|will never|won't work)\b/i,
  },
  {
    id: 'q-wrong',
    key: 'wrong',
    prompt: 'Are you focusing only on what went wrong?',
    pattern: 'NEGATIVE_FILTER',
    keywords: /\b(only|just|all i|nothing went|everything went wrong|only bad)\b/i,
  },
  {
    id: 'q-identity',
    key: 'identity',
    prompt: 'Are you turning one action into a judgement about who you are?',
    pattern: 'LABELLING',
    keywords: /\b(i am a|i'm a|i am such|i'm such|i am useless|i am stupid|i am worthless|bad person)\b/i,
  },
  {
    id: 'q-should',
    key: 'should',
    prompt: 'Are you holding yourself to a “should”, “must” or “ought”?',
    pattern: 'SHOULDING',
    keywords: /\b(should|must|ought|have to|need to be|supposed to)\b/i,
  },
  {
    id: 'q-control',
    key: 'control',
    prompt: 'Are you taking responsibility for something you cannot fully control?',
    pattern: 'PERSONALISING',
    keywords: /\b(my fault|because of me|i caused|i made them|if only i)\b/i,
  },
  {
    id: 'q-emotion',
    key: 'emotion',
    prompt: 'Does it feel true mainly because the emotion is strong?',
    pattern: 'EMOTIONAL_REASONING',
    keywords: /\b(feel like|feels like|because i feel|i feel.*(so|therefore|must be|means))\b/i,
  },
  {
    id: 'q-magnify',
    key: 'magnify',
    prompt: 'Does the negative feel enormous, or are positives being dismissed?',
    pattern: 'MAGNIFYING',
    keywords: /\b(worst|terrible|awful|hate myself|can't stand|unbearable|huge|massive)\b/i,
  },
]

/** Fallback questions only when no thought signal matches — excludes prediction catch-alls. */
const DEFAULT_QUEUE = ['q-should']

const MIND_READING_THOUGHT_SIGNAL =
  /\b(they|he|she|everyone|people|someone)\s+(hate|hates|think|thinks|feel|feels|want|wants|dislike|dislikes|don't like|doesn't like)\b/i

const MIND_READING_ABOUT_ME_SIGNAL =
  /\b(thinks?|thought|feels?|feeling)\s+(i'?m|i am|about me|of me)\b/i

function questionMatchesThought(q, thought) {
  return Boolean(q.keywords && q.keywords.test(thought))
}

export function thoughtSuggestsMindReading(thought) {
  const text = thought || ''
  return MIND_READING_THOUGHT_SIGNAL.test(text) || MIND_READING_ABOUT_ME_SIGNAL.test(text)
}

export function thoughtHasPredictionSignal(thought) {
  const q = patternCheckQuestions.find((item) => item.id === 'q-predict')
  return questionMatchesThought(q, thought)
}

function thoughtSupportsPattern(q, thought) {
  if (!q) return false
  if (questionMatchesThought(q, thought)) return true
  if (q.pattern === 'MIND_READING' && thoughtSuggestsMindReading(thought)) return true
  if (q.pattern === 'FORTUNE_TELLING' && thoughtHasPredictionSignal(thought)) return true
  return false
}

function confidenceForMatch(q, thought) {
  if (questionMatchesThought(q, thought)) return 'high'
  return 'possible'
}

function formatPatternLabel(id, confidence) {
  const base = thoughtPatterns[id]
  if (confidence === 'possible') {
    return `Possible ${base.label.toLowerCase()}`
  }
  return base.label
}

/** Pick up to 4 pattern questions — thought signals and keyword matches first. */
export function getPatternQuestionQueue(thought) {
  const text = thought || ''
  const matched = []

  for (const q of patternCheckQuestions) {
    if (thoughtSupportsPattern(q, text)) matched.push(q.id)
  }

  const defaults = DEFAULT_QUEUE.filter((id) => !matched.includes(id))
  const ordered = [...new Set([...matched, ...defaults])]
  return ordered.slice(0, 4)
}

export const checkPrompts = [
  { id: 'certain', label: 'What do I know for certain?' },
  { id: 'assuming', label: 'What might I be assuming?' },
  { id: 'friend', label: 'What would I say to a dear friend?' },
  { id: 'control', label: 'What part can I control?' },
  { id: 'other', label: 'Is there another explanation?' },
  { id: 'skip', label: 'Skip this' },
]

/**
 * Conservative pattern detection — yes answers need thought-level support for that pattern.
 */
export function detectPatterns(patternAnswers, questionQueue = [], thought = '') {
  const orderedIds =
    questionQueue.length > 0
      ? questionQueue
      : patternCheckQuestions.map((q) => q.id)

  const confirmed = []

  for (const qId of orderedIds) {
    const q = patternCheckQuestions.find((item) => item.id === qId)
    if (!q || patternAnswers[q.id] !== 'yes') continue
    if (!thoughtSupportsPattern(q, thought)) continue

    const confidence = confidenceForMatch(q, thought)
    const existing = confirmed.find((item) => item.id === q.pattern)
    if (existing) {
      if (confidence === 'high' && existing.confidence !== 'high') {
        existing.confidence = 'high'
        existing.label = formatPatternLabel(q.pattern, 'high')
      }
      continue
    }

    confirmed.push({
      id: q.pattern,
      ...thoughtPatterns[q.pattern],
      label: formatPatternLabel(q.pattern, confidence),
      confidence,
    })
  }

  if (confirmed.length === 0) {
    return {
      patterns: [{ id: 'NO_PATTERN', ...thoughtPatterns.NO_PATTERN, confidence: 'none' }],
      hasClearPattern: false,
    }
  }

  return { patterns: confirmed.slice(0, 2), hasClearPattern: true }
}

export function formatBeliefShift(beliefBefore, beliefAfter, { beforeRated = false, afterRated = false } = {}) {
  if (!beforeRated || !afterRated) return null
  if (typeof beliefBefore !== 'number' || typeof beliefAfter !== 'number') return null
  if (Number.isNaN(beliefBefore) || Number.isNaN(beliefAfter)) return null
  return `Before: ${beliefBefore}% → After: ${beliefAfter}%`
}

const STARTERS = {
  OVERGENERALISING: 'This is one moment, not my whole story. Some things went okay, even if this part is hard.',
  MIND_READING:
    'I don’t know for certain what they think. I can look for evidence, ask for clarity, or accept that I don’t have the answer yet.',
  FORTUNE_TELLING:
    'This might happen, but it is not certain. If it does, I can cope one step at a time.',
  NEGATIVE_FILTER:
    'Something went wrong — and other things may have gone okay too. I can hold both.',
  LABELLING: 'This action or mistake does not define my whole identity.',
  SHOULDING: 'I would prefer to do my best, but I do not have to be perfect.',
  PERSONALISING: 'I am responsible for my part, but I cannot control everything.',
  EMOTIONAL_REASONING:
    'I feel this strongly — and feelings are real. That doesn’t automatically make the thought a fact.',
  MAGNIFYING: 'This feels huge right now. It may not be the whole picture.',
  NO_PATTERN: 'This is a hard thought. I can choose a response that helps me, even without a neat label.',
}

function buildThoughtAnchoredStarter(thought) {
  const trimmed = thought.trim()
  if (!trimmed) return STARTERS.NO_PATTERN

  if (/\b(don'?t|do not) like\b/i.test(trimmed) || /\bdidn'?t like\b/i.test(trimmed)) {
    return 'I didn’t like how that felt. That reaction makes sense, and I can decide what I want to do next — without assuming what they meant.'
  }

  if (thoughtSuggestsMindReading(trimmed)) {
    return 'I don’t know for certain what they think or feel. I can notice what happened and choose how I want to respond.'
  }

  return `This thought matters: “${trimmed}”. I can respond in a way that helps me, without needing a perfect label.`
}

export function suggestBalancedThought(patterns, thought = '') {
  const primary = patterns[0]?.id
  if (!primary || primary === 'NO_PATTERN') {
    return buildThoughtAnchoredStarter(thought)
  }

  const patternStarter = STARTERS[primary] || STARTERS.NO_PATTERN
  const trimmed = thought.trim()
  if (!trimmed) return patternStarter
  return `About “${trimmed}”: ${patternStarter}`
}

const thoughtChallenger = {
  id: 'thought-challenger',
  type: 'wizard',
  stepCount: 4,
  title: 'The Thought Challenger',
  subtitle: 'Look at a thought without judging yourself.',
  description:
    'Your thoughts can feel completely true without telling the whole story. Let’s take a closer look, without judging you or forcing a positive spin.',
  supporting:
    'Your thoughts can feel completely true without telling the whole story. Let’s take a closer look, without judging you or forcing a positive spin.',
  meta: 'About 3 min · Private — stays on your device',
  duration: '3 min',
  accent: 'blue',
  art: 'gentleness',
  category: 'feel-better',
  startLabel: 'Start reflecting',
}

export default thoughtChallenger
