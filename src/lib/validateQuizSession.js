import { getCheckin } from '../data/quizzes.js'
import { getApplicableQuestions } from './quizFlow.js'

function isAnswerComplete(question, answer) {
  if (!answer) return false
  if (question.questionType === 'compound') {
    return Boolean(answer.time && answer.budget)
  }
  if (question.questionType === 'multi') {
    return Boolean(answer.multi && Array.isArray(answer.options) && answer.options.length > 0)
  }
  return Boolean(answer.id)
}

/**
 * Validate session before scoring or showing results.
 * @returns {{ valid: true, applicableQuestionIds: string[] } | { valid: false, error: string, missingQuestionId: string | null, message: string }}
 */
export function validateQuizSession({ quizId, answersByQuestionId = {} }) {
  const quiz = getCheckin(quizId)
  if (!quiz) {
    return {
      valid: false,
      error: 'unknown_quiz',
      missingQuestionId: null,
      message: 'This check-in could not be found.',
    }
  }

  const applicable = getApplicableQuestions(quiz, answersByQuestionId)
  const applicableIds = new Set(applicable.map((q) => q.id))

  for (const questionId of Object.keys(answersByQuestionId)) {
    if (!applicableIds.has(questionId)) {
      return {
        valid: false,
        error: 'stale_answer',
        missingQuestionId: questionId,
        message: 'Some answers were from a previous run. Please start again.',
      }
    }
  }

  for (const question of applicable) {
    const answer = answersByQuestionId[question.id]
    if (!isAnswerComplete(question, answer)) {
      return {
        valid: false,
        error: 'missing_answer',
        missingQuestionId: question.id,
        message: 'Please complete every screen before viewing your result.',
      }
    }
  }

  return { valid: true, applicableQuestionIds: applicable.map((q) => q.id) }
}

export { isAnswerComplete }
