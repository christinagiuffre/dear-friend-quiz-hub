import { getApplicableQuestions } from './quizFlow.js'

export function createSession(quizId) {
  return {
    quizId,
    answersByQuestionId: {},
    selectedAnswerIdByQuestionId: {},
  }
}

export function getSelectedAnswerId(session, questionId) {
  if (Object.prototype.hasOwnProperty.call(session.selectedAnswerIdByQuestionId, questionId)) {
    return session.selectedAnswerIdByQuestionId[questionId]
  }
  return null
}

export function setSelectedAnswerId(session, questionId, answerId) {
  return {
    ...session,
    selectedAnswerIdByQuestionId: {
      ...session.selectedAnswerIdByQuestionId,
      [questionId]: answerId,
    },
  }
}

export function clearSelectionForQuestion(session, questionId) {
  return {
    ...session,
    selectedAnswerIdByQuestionId: {
      ...session.selectedAnswerIdByQuestionId,
      [questionId]: null,
    },
  }
}

export function commitAnswer(session, quiz, questionId, findOption) {
  const raw = session.selectedAnswerIdByQuestionId[questionId]
  if (raw == null) return session

  if (Array.isArray(raw)) {
    const options = raw.map((id) => findOption(quiz, questionId, id)).filter(Boolean)
    if (!options.length) return session
    return {
      ...session,
      answersByQuestionId: {
        ...session.answersByQuestionId,
        [questionId]: { id: `${questionId}-multi`, multi: true, options },
      },
    }
  }

  const option = findOption(quiz, questionId, raw)
  if (!option) return session

  return {
    ...session,
    answersByQuestionId: {
      ...session.answersByQuestionId,
      [questionId]: option,
    },
  }
}

export function goBackOneQuestion(session, quiz) {
  const applicable = getApplicableQuestions(quiz, session.answersByQuestionId)
  const answered = applicable.filter((q) => session.answersByQuestionId[q.id])
  if (!answered.length) return session

  const lastQ = answered[answered.length - 1]
  const lastAnswer = session.answersByQuestionId[lastQ.id]
  const { [lastQ.id]: _, ...rest } = session.answersByQuestionId

  const restoredSelection = lastAnswer?.multi
    ? lastAnswer.options.map((o) => o.id)
    : lastAnswer?.id ?? null

  return {
    ...session,
    answersByQuestionId: rest,
    selectedAnswerIdByQuestionId: {
      ...session.selectedAnswerIdByQuestionId,
      [lastQ.id]: restoredSelection,
    },
  }
}

export function canGoNext(session, questionId, questionType = 'single') {
  const sel = session.selectedAnswerIdByQuestionId[questionId]
  if (questionType === 'multi') return Array.isArray(sel) && sel.length > 0
  if (questionType === 'compound') return sel?.time != null && sel?.budget != null
  return sel != null && sel !== ''
}

export function toggleMultiSelect(session, questionId, answerId, max = 2) {
  const current = session.selectedAnswerIdByQuestionId[questionId]
  let ids = Array.isArray(current) ? [...current] : []

  if (answerId === 'crave-unsure') {
    ids = ids.includes('crave-unsure') ? [] : ['crave-unsure']
  } else {
    ids = ids.filter((id) => id !== 'crave-unsure')
    const idx = ids.indexOf(answerId)
    if (idx >= 0) ids.splice(idx, 1)
    else if (ids.length < max) ids.push(answerId)
  }

  return {
    ...session,
    selectedAnswerIdByQuestionId: {
      ...session.selectedAnswerIdByQuestionId,
      [questionId]: ids.length ? ids : null,
    },
  }
}

export function setCompoundLimits(session, questionId, field, value) {
  const current = session.selectedAnswerIdByQuestionId[questionId] || {}
  return {
    ...session,
    selectedAnswerIdByQuestionId: {
      ...session.selectedAnswerIdByQuestionId,
      [questionId]: { ...current, [field]: value },
    },
  }
}

export function resetSession(quizId) {
  return createSession(quizId)
}
