const CAUSE_WEIGHTS = {
  'p1-a': { UNCLEAR: 3 },
  'p1-b': { UNCLEAR: 2 },
  'p1-c': {},
  'p2-a': { TOO_BIG: 3 },
  'p2-b': { TOO_BIG: 1, FEAR_FAILURE: 1 },
  'p2-c': {},
  'p3-a': { BORING: 3 },
  'p3-b': {},
  'p3-c': {},
  'p4-a': { FEAR_FAILURE: 3 },
  'p4-b': { FEAR_FAILURE: 2, PERFECTIONISM: 2 },
  'p4-c': { PERFECTIONISM: 3 },
  'p4-d': {},
  'p5-a': { LOW_CAPACITY: 3 },
  'p5-b': { LOW_CAPACITY: 1 },
  'p5-c': {},
  'p6-a': { RESENTMENT: 3 },
  'p6-b': { COMPETING: 3 },
  'p6-c': { NO_MEANING: 3 },
  'p6-d': { WAITING_MOTIVATION: 3 },
  'p6-e': { NEED_SUPPORT: 3 },
  'p6-f': {},
  'p6-other': {},
}

const TIE_PRIORITY = [
  'UNCLEAR',
  'TOO_BIG',
  'FEAR_FAILURE',
  'PERFECTIONISM',
  'LOW_CAPACITY',
  'BORING',
  'RESENTMENT',
  'COMPETING',
  'NO_MEANING',
  'NEED_SUPPORT',
  'WAITING_MOTIVATION',
]

export function scoreProcrastinationResults(answersByQuestionId) {
  const tally = {}

  for (const answer of Object.values(answersByQuestionId)) {
    const weights = CAUSE_WEIGHTS[answer.id]
    if (!weights) continue
    for (const [key, w] of Object.entries(weights)) {
      tally[key] = (tally[key] || 0) + w
    }
  }

  const entries = Object.entries(tally)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])

  if (!entries.length) {
    return { resultId: 'WAITING_MOTIVATION', secondResultId: null, tally, showAlsoShowingUp: false }
  }

  const highest = entries[0][1]
  const leaders = entries.filter(([, s]) => s === highest).map(([k]) => k)
  const resultId =
    leaders.length === 1 ? leaders[0] : TIE_PRIORITY.find((k) => leaders.includes(k)) || leaders[0]

  const runner = entries.find(([k]) => k !== resultId)
  const secondResultId =
    runner && highest - runner[1] <= 1 && runner[1] >= 2 ? runner[0] : null

  return {
    resultId,
    secondResultId,
    tally,
    showAlsoShowingUp: secondResultId != null,
  }
}
