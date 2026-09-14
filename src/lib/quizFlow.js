/**
 * Quiz flow — stable question IDs, full route for progress.
 */

export function getApplicableQuestions(quiz, answersByQuestionId = {}) {
  const applicable = []

  for (const question of quiz.questions) {
    if (question.showIf && !question.showIf(answersByQuestionId)) continue

    applicable.push(question)

    const answer = answersByQuestionId[question.id]
    if (answer?.shortCircuit) break
  }

  return applicable
}

export function getCurrentQuestionId(quiz, answersByQuestionId) {
  const applicable = getApplicableQuestions(quiz, answersByQuestionId)

  for (const question of applicable) {
    if (!answersByQuestionId[question.id]) return question.id
    if (answersByQuestionId[question.id]?.shortCircuit) return question.id
  }

  return applicable[applicable.length - 1]?.id ?? applicable[0]?.id ?? null
}

export function getProgress(quiz, answersByQuestionId, currentQuestionId) {
  const applicable = getApplicableQuestions(quiz, answersByQuestionId)
  const total = Math.max(1, applicable.length)
  const idx = applicable.findIndex((q) => q.id === currentQuestionId)
  const current = idx >= 0 ? idx + 1 : 1

  return {
    current,
    total,
    percent: (current / total) * 100,
    applicableQuestionIds: applicable.map((q) => q.id),
    showTotal: true,
  }
}

export function isQuizComplete(quiz, answersByQuestionId) {
  const applicable = getApplicableQuestions(quiz, answersByQuestionId)
  return applicable.length > 0 && applicable.every((q) => answersByQuestionId[q.id])
}

export function getAnswersInQuestionOrder(quiz, answersByQuestionId) {
  return getApplicableQuestions(quiz, answersByQuestionId)
    .map((q) => answersByQuestionId[q.id])
    .filter(Boolean)
}

export function findOption(quiz, questionId, answerId) {
  const question = quiz.questions.find((q) => q.id === questionId)
  if (!question) return null

  if (question.questionType === 'compound') return null

  if (Array.isArray(question.options)) {
    return question.options.find((o) => o.id === answerId) ?? null
  }

  return null
}

export function findQuestion(quiz, questionId) {
  return quiz.questions.find((q) => q.id === questionId) ?? null
}
