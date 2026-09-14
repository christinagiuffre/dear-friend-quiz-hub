/** Pure play-state helpers — testable without React. */

export function getTotalSteps(quiz, answers = []) {
  if (typeof quiz.stepCount === 'number') return quiz.stepCount
  if (quiz.type === 'wizard') return quiz.stepCount || 4

  const answersById = {}
  let count = 0

  for (const question of quiz.questions) {
    if (question.showIf && !question.showIf(answersById)) continue
    count++
    const answer = answers[count - 1]
    if (answer) {
      answersById[question.id] = answer
      if (answer.shortCircuit) break
    } else {
      break
    }
  }

  // Before answering, show full static count when no branching is active yet
  if (answers.length === 0 && !quiz.questions.some((q) => q.showIf)) {
    return quiz.questions.length
  }

  // Count all questions reachable along the current answer path
  let reachable = 0
  const map = {}
  for (const question of quiz.questions) {
    if (question.showIf && !question.showIf(map)) continue
    reachable++
    const ans = answers[reachable - 1]
    if (ans) {
      map[question.id] = ans
      if (ans.shortCircuit) break
    } else {
      // Include remaining unconditional questions in total estimate
      for (let i = quiz.questions.indexOf(question) + 1; i < quiz.questions.length; i++) {
        const q = quiz.questions[i]
        if (!q.showIf || q.showIf(map)) reachable++
      }
      break
    }
  }

  return Math.max(reachable, quiz.questions.length)
}

export function getCurrentStepIndex(answers) {
  return answers.length
}

export function getCommittedAnswer(answers, index) {
  return answers[index] ?? null
}

export function getSelectionForStep(answers, stepIndex, pendingSelection) {
  if (pendingSelection != null) return pendingSelection
  return getCommittedAnswer(answers, stepIndex)
}

export function canAdvance(selection) {
  return selection != null
}

export function commitAnswer(answers, stepIndex, selection) {
  const next = [...answers]
  next[stepIndex] = selection
  return next.slice(0, stepIndex + 1)
}

export function goBackAnswers(answers) {
  return answers.slice(0, -1)
}

export function isPlayComplete(quiz, answers) {
  const total = getTotalSteps(quiz, answers)
  return answers.length >= total
}
