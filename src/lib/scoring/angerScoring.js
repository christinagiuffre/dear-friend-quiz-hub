/**
 * Anger scoring — cause weights by answer ID, tailoring excluded from cause tally.
 */

const CAUSE_WEIGHTS = {
  // a1 trigger
  'a1-a': { HURT: 1, BOUNDARY: 1 },
  'a1-b': { ACCUMULATED: 3 },
  'a1-c': { ACCUMULATED: 2, BOUNDARY: 1 },
  'a1-d': { OVERLOAD: 2 },
  'a1-other': {},
  // a2 underlying
  'a2-a': { HURT: 3 },
  'a2-b': { UNFAIR: 3 },
  'a2-c': { THREAT: 3 },
  'a2-d': { OVERLOAD: 2, CAPACITY: 2 },
  'a2-e': { POWERLESS: 3 },
  'a2-f': {},
  'a2-other': {},
  // a3 boundary
  'a3-a': { BOUNDARY: 3 },
  'a3-b': { BOUNDARY: 1 },
  'a3-c': {},
  'a3-d': { HURT: 2 },
  'a3-other': {},
  // a4 safety/power/unfair
  'a4-a': { SAFETY: 3, THREAT: 3 },
  'a4-b': { HURT: 2, UNMET_NEED: 2 },
  'a4-c': { POWERLESS: 3 },
  'a4-d': { UNFAIR: 3 },
  'a4-e': {},
  'a4-other': {},
  // a5 physical
  'a5-a': { OVERLOAD: 3, CAPACITY: 2 },
  'a5-b': { OVERLOAD: 1, CAPACITY: 1 },
  'a5-c': {},
  // a6 is tailoring only — no cause weights
}

const TIE_PRIORITY = [
  'SAFETY',
  'THREAT',
  'HURT',
  'UNFAIR',
  'POWERLESS',
  'BOUNDARY',
  'OVERLOAD',
  'CAPACITY',
  'ACCUMULATED',
  'UNMET_NEED',
]

const SECONDARY_MIN = 3
const SECONDARY_GAP = 2

export function scoreAngerResults(answersByQuestionId) {
  const tally = {}
  let tailoring = {}
  let shortCircuit = null

  for (const [questionId, answer] of Object.entries(answersByQuestionId)) {
    if (questionId === 'a6-need') {
      tailoring = { ...tailoring, ...answer.tailoring }
      continue
    }

    const weights = CAUSE_WEIGHTS[answer.id]
    if (!weights) continue

    if (answer.shortCircuit) {
      shortCircuit = answer.shortCircuit
      break
    }

    for (const [key, w] of Object.entries(weights)) {
      tally[key] = (tally[key] || 0) + w
    }
  }

  if (shortCircuit) {
    return {
      resultId: shortCircuit,
      secondResultId: null,
      tally: { [shortCircuit]: 999 },
      tailoring,
      showAlsoShowingUp: false,
    }
  }

  const entries = Object.entries(tally)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])

  if (!entries.length) {
    return { resultId: 'UNMET_NEED', secondResultId: null, tally, tailoring, showAlsoShowingUp: false }
  }

  const highest = entries[0][1]
  const leaders = entries.filter(([, s]) => s === highest).map(([k]) => k)
  const resultId =
    leaders.length === 1 ? leaders[0] : TIE_PRIORITY.find((k) => leaders.includes(k)) || leaders[0]

  const winnerScore = tally[resultId]
  const runner = entries.find(([k]) => k !== resultId)
  const secondResultId =
    runner &&
    runner[1] >= SECONDARY_MIN &&
    winnerScore - runner[1] <= SECONDARY_GAP
      ? runner[0]
      : null

  return {
    resultId,
    secondResultId,
    tally,
    tailoring,
    showAlsoShowingUp: secondResultId != null,
  }
}
