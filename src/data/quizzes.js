import feeling from './checkins/feeling.js'
import anger from './checkins/anger.js'
import boredom from './checkins/boredom.js'
import thoughtChallenger from './checkins/thought-challenger.js'
import needs from './checkins/needs.js'
import procrastination from './checkins/procrastination.js'

export const checkins = [feeling, anger, boredom, thoughtChallenger, needs, procrastination]

/** @deprecated Use checkins — kept for backward compatibility */
export const quizzes = checkins

export function getCheckin(id) {
  return checkins.find((c) => c.id === id)
}

/** @deprecated Use getCheckin */
export function getQuiz(id) {
  return getCheckin(id)
}

export function getCheckinsByCategory(categoryId) {
  return checkins.filter((c) => c.category === categoryId)
}
