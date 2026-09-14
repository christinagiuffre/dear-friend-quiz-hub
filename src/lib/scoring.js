import { scoreAngerResults } from './scoring/angerScoring.js'
import { scoreNeedsResults } from './scoring/needsScoring.js'
import { scoreProcrastinationResults } from './scoring/procrastinationScoring.js'
import { getApplicableQuestions } from './quizFlow.js'

const SECONDARY_MIN_SCORE = 3
const SECONDARY_RATIO = 0.7
const SECONDARY_MAX_GAP = 2

export function scoreQuiz(quiz, answersByQuestionId) {
  const tally = {}
  for (const key of Object.keys(quiz.results)) tally[key] = 0

  const applicable = getApplicableQuestions(quiz, answersByQuestionId)
  for (const q of applicable) {
    const ans = answersByQuestionId[q.id]
    if (ans?.result && ans.result in tally) tally[ans.result] += 1
  }

  const priority = quiz.tiePriority || Object.keys(quiz.results)
  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1])
  const highest = entries[0]?.[1] ?? 0
  const leaders = entries.filter(([, s]) => s === highest).map(([k]) => k)

  let resultId
  if (leaders.length === 1) resultId = leaders[0]
  else resultId = priority.find((k) => leaders.includes(k)) || leaders[0]

  const winnerScore = tally[resultId]
  const runnerUp = entries.find(([k]) => k !== resultId && tally[k] > 0)
  const secondResultId = runnerUp ? runnerUp[0] : null
  const secondScore = runnerUp ? runnerUp[1] : 0
  const isMixed =
    leaders.length > 1 || (secondResultId && winnerScore - secondScore === 1)

  return {
    resultId,
    secondResultId: isMixed ? secondResultId : null,
    tally,
    isMixed,
    showAlsoShowingUp: isMixed && secondResultId != null,
    tailoring: {},
  }
}

export function scoreCheckinResult(checkin, answersByQuestionId) {
  if (checkin.type === 'simple') return scoreQuiz(checkin, answersByQuestionId)
  if (checkin.type === 'weighted') return scoreWeightedQuiz(checkin, answersByQuestionId)
  return null
}

export function scoreWeightedQuiz(quiz, answersByQuestionId) {
  if (quiz.id === 'behind-my-anger') return scoreAngerResults(answersByQuestionId)
  if (quiz.id === 'what-do-i-need') return scoreNeedsResults(answersByQuestionId)
  if (quiz.id === 'why-procrastinating') return scoreProcrastinationResults(answersByQuestionId)

  // Generic fallback
  const tally = {}
  const applicable = getApplicableQuestions(quiz, answersByQuestionId)

  for (const q of applicable) {
    const role = q.scoringRole || 'cause'
    const ans = answersByQuestionId[q.id]
    if (!ans || role === 'tailoring') continue
    if (ans.shortCircuit) {
      return {
        resultId: ans.shortCircuit,
        secondResultId: null,
        tally: { [ans.shortCircuit]: 999 },
        showAlsoShowingUp: false,
        tailoring: {},
      }
    }
    for (const [key, w] of Object.entries(ans.scores || {})) {
      tally[key] = (tally[key] || 0) + w
    }
  }

  const priority = quiz.tiePriority || Object.keys(quiz.results)
  const entries = Object.entries(tally)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])

  if (!entries.length) {
    return { resultId: priority[0], secondResultId: null, tally, showAlsoShowingUp: false, tailoring: {} }
  }

  const highest = entries[0][1]
  const leaders = entries.filter(([, s]) => s === highest).map(([k]) => k)
  const resultId =
    leaders.length === 1 ? leaders[0] : priority.find((k) => leaders.includes(k)) || leaders[0]

  const runner = entries.find(([k]) => k !== resultId)
  const secondResultId =
    runner &&
    runner[1] >= SECONDARY_MIN_SCORE &&
    (resultId && tally[resultId] - runner[1] <= SECONDARY_MAX_GAP ||
      runner[1] / tally[resultId] >= SECONDARY_RATIO)
      ? runner[0]
      : null

  return {
    resultId,
    secondResultId,
    tally,
    showAlsoShowingUp: secondResultId != null,
    tailoring: {},
  }
}

export function buildScoringAudit(quiz, answersByQuestionId) {
  const scored = scoreWeightedQuiz(quiz, answersByQuestionId)
  return {
    answersByQuestionId: Object.fromEntries(
      Object.entries(answersByQuestionId).map(([k, v]) => [k, v?.id || v])
    ),
    tally: scored.tally,
    primary: scored.resultId,
    secondary: scored.secondResultId,
    tertiary: scored.tertiaryResultId,
    tailoring: scored.tailoring,
    layered: scored.layered,
  }
}
