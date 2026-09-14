/** Returns the question path built so far plus the current unanswered question. */

export function getPlayState(quiz, answers) {
  const visibleQuestions = []
  const answersById = {}

  for (const question of quiz.questions) {
    if (question.showIf && !question.showIf(answersById)) continue

    const answerIndex = visibleQuestions.length
    visibleQuestions.push(question)

    if (answers[answerIndex]) {
      answersById[question.id] = answers[answerIndex]
      if (answers[answerIndex].shortCircuit) break
    } else {
      break
    }
  }

  const totalSteps = quiz.stepCount ?? quiz.questions.length
  const currentIndex = Math.min(answers.length, totalSteps - 1)

  return { visibleQuestions, answersById, currentIndex, totalSteps }
}

export function getQuestionById(quiz, questionId) {
  return quiz.questions.find((q) => q.id === questionId)
}
