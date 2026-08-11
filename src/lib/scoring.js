// Counts category scores, picks winner with tie-break priority,
// and detects mixed / close-second results for the result screen.

export function scoreQuiz(quiz, answers) {
  const tally = {}
  for (const key of Object.keys(quiz.results)) tally[key] = 0
  for (const answer of answers) {
    if (answer && answer in tally) tally[answer] += 1
  }

  const priority = quiz.tiePriority || Object.keys(quiz.results)
  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1])
  const highest = entries[0][1]
  const leaders = entries.filter(([, score]) => score === highest).map(([key]) => key)

  let resultId
  if (leaders.length === 1) {
    resultId = leaders[0]
  } else {
    resultId = priority.find((key) => leaders.includes(key)) || leaders[0]
  }

  const winnerScore = tally[resultId]
  const runnerUp = entries.find(([key]) => key !== resultId && tally[key] > 0)
  const secondResultId = runnerUp ? runnerUp[0] : null
  const secondScore = runnerUp ? runnerUp[1] : 0

  const isTiedAtTop = leaders.length > 1
  const onePointApart = secondResultId !== null && winnerScore - secondScore === 1
  const isMixed = isTiedAtTop || onePointApart
  const showAlsoShowingUp = secondResultId !== null && isMixed

  return { resultId, secondResultId, tally, isMixed, showAlsoShowingUp }
}
