/**
 * Needs scoring — layered physical + emotional results.
 */

const CAUSE_WEIGHTS = {
  'n1-a': { REST: 2 },
  'n1-b': { PHYSICAL_RESET: 6, NOURISHMENT: 3 },
  'n1-c': { SPACE: 1, RELEASE: 1 },
  'n1-d': {},
  'n1-other': {},
  'n2-a': { SAFETY: 2, REASSURANCE: 2 },
  'n2-b': { CONNECTION: 2, VALIDATION: 2 },
  'n2-c': { VALIDATION: 2, REST: 2, CONNECTION: 1 },
  'n2-d': { SPACE: 2, RELEASE: 1 },
  'n2-e': { REST: 2, SPACE: 2 },
  'n2-other': {},
  'n3-a': { CONNECTION: 3 },
  'n3-b': { SPACE: 3 },
  'n3-c': { VALIDATION: 2, REST: 1 },
  'n3-d': { VALIDATION: 3, CONNECTION: 1 },
  'n3-e': {},
  'n3-other': {},
  'n4-a': { SAFETY: 3 },
  'n4-b': { SAFETY: 1, REASSURANCE: 1 },
  'n4-c': {},
  'n5-a': { CHOICE: 3 },
  'n5-b': { CLARITY: 3 },
  'n5-c': { BOUNDARY: 3 },
  'n5-d': { PRACTICAL: 3 },
  'n5-e': {},
  'n5-other': {},
}

const TIE_PRIORITY = [
  'SAFETY',
  'PHYSICAL_RESET',
  'NOURISHMENT',
  'REST',
  'SPACE',
  'CONNECTION',
  'VALIDATION',
  'REASSURANCE',
  'CLARITY',
  'CHOICE',
  'BOUNDARY',
  'RELEASE',
  'PRACTICAL',
  'PLAY',
]

const SECONDARY_MIN = 2
const SECONDARY_GAP = 2

export function scoreNeedsResults(answersByQuestionId) {
  const tally = {}
  let tailoring = {}

  for (const [questionId, answer] of Object.entries(answersByQuestionId)) {
    if (questionId === 'n6-format') {
      tailoring = answer.tailoring || {}
      continue
    }
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
    return {
      resultId: 'REST',
      secondResultId: null,
      tertiaryResultId: null,
      tally,
      tailoring,
      showAlsoShowingUp: false,
      layered: null,
    }
  }

  const pick = (exclude = []) => {
    const e = entries.filter(([k]) => !exclude.includes(k))
    if (!e.length) return null
    const highest = e[0][1]
    const leaders = e.filter(([, s]) => s === highest).map(([k]) => k)
    return leaders.length === 1
      ? leaders[0]
      : TIE_PRIORITY.find((k) => leaders.includes(k)) || leaders[0]
  }

  const primary = pick()
  const secondary = pick([primary])
  const tertiary = pick([primary, secondary])

  const primaryScore = tally[primary]
  const secondaryScore = secondary ? tally[secondary] : 0
  const secondResultId =
    secondary &&
    secondaryScore >= SECONDARY_MIN &&
    primaryScore - secondaryScore <= SECONDARY_GAP
      ? secondary
      : null

  const tertiaryResultId =
    tertiary && tertiary !== primary && tertiary !== secondResultId ? tertiary : null

  return {
    resultId: primary,
    secondResultId,
    tertiaryResultId,
    tally,
    tailoring,
    showAlsoShowingUp: secondResultId != null,
    layered: buildLayered(primary, secondResultId, tertiaryResultId, tailoring),
  }
}

function buildLayered(primary, secondary, tertiary, tailoring) {
  const physical = ['PHYSICAL_RESET', 'NOURISHMENT'].includes(primary)
  const startHere = physical
    ? 'Start with your basic needs. Food, water, physical comfort or a short pause may make the next step clearer.'
    : primary === 'REST'
      ? 'Start with genuine rest — not pushing through.'
      : primary === 'SAFETY'
        ? 'Start with safety — move somewhere you feel more secure.'
        : `Start with ${labelFor(primary)}.`

  const alsoNeed = secondary
    ? `You may also need ${labelFor(secondary).toLowerCase()}.`
    : null

  let thenConsider = tertiary
    ? `Then consider ${labelFor(tertiary).toLowerCase()}.`
    : null

  if (tailoring.format === 'action') {
    thenConsider = thenConsider
      ? `${thenConsider} Take one small practical step when you are ready.`
      : 'Then take one small practical step.'
  }

  return { startHere, alsoNeed, thenConsider }
}

function labelFor(id) {
  const labels = {
    PHYSICAL_RESET: 'a physical reset',
    NOURISHMENT: 'nourishment or hydration',
    REST: 'rest',
    SAFETY: 'safety',
    SPACE: 'space',
    CONNECTION: 'connection',
    VALIDATION: 'to feel seen',
    REASSURANCE: 'reassurance',
    CLARITY: 'clarity',
    CHOICE: 'more choice',
    BOUNDARY: 'a boundary',
    RELEASE: 'emotional release',
    PRACTICAL: 'practical support',
  }
  return labels[id] || id
}
