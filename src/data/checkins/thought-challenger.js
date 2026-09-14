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
    label: 'No obvious thinking pattern',
    description:
      'No obvious thinking pattern was identified. The thought may still be painful, and you can decide what response would serve you best.',
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
    keywords: /\b(will fail|going to fail|never work|ruin|disaster|certainly|definitely will|bound to)\b/i,
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
    keywords: null,
  },
  {
    id: 'q-magnify',
    key: 'magnify',
    prompt: 'Does the negative feel enormous, or are positives being dismissed?',
    pattern: 'MAGNIFYING',
    keywords: /\b(worst|terrible|awful|hate myself|can't stand|unbearable|huge|massive)\b/i,
  },
]

const DEFAULT_QUEUE = ['q-emotion', 'q-predict', 'q-mindread', 'q-should']

/** Pick up to 4 pattern questions — keyword hints first, then defaults. Transparent, not semantic AI. */
export function getPatternQuestionQueue(thought) {
  const text = thought || ''
  const matched = []
  const rest = []

  for (const q of patternCheckQuestions) {
    if (q.keywords && q.keywords.test(text)) matched.push(q.id)
    else if (!q.keywords) rest.push(q.id)
    else rest.push(q.id)
  }

  const ordered = [...new Set([...matched, ...DEFAULT_QUEUE, ...rest])]
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

export function detectPatterns(patternAnswers, questionQueue = []) {
  const matched = []
  const orderedIds =
    questionQueue.length > 0
      ? questionQueue
      : patternCheckQuestions.map((q) => q.id)

  for (const qId of orderedIds) {
    const q = patternCheckQuestions.find((item) => item.id === qId)
    if (q && patternAnswers[q.id] === 'yes') matched.push(q.pattern)
  }

  const unique = [...new Set(matched)]

  if (unique.length === 0) {
    return {
      patterns: [{ id: 'NO_PATTERN', ...thoughtPatterns.NO_PATTERN }],
    }
  }

  const patterns = unique.slice(0, 2).map((id) => ({ id, ...thoughtPatterns[id] }))

  return { patterns }
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
  SHOULDING: 'I would prefer to ___, but I do not have to be perfect.',
  PERSONALISING: 'I am responsible for ___, but I cannot control everything.',
  EMOTIONAL_REASONING:
    'I feel this strongly — and feelings are real. That doesn’t automatically make the thought a fact.',
  MAGNIFYING: 'This feels huge right now. It may not be the whole picture.',
  NO_PATTERN: 'This is a hard thought. I can choose a response that helps me, even without a neat label.',
}

export function suggestBalancedThought(patterns) {
  const primary = patterns[0]?.id
  return STARTERS[primary] || STARTERS.NO_PATTERN
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
