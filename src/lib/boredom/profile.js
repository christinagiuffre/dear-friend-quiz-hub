/** @typedef {import('./types.js').BoredomProfile} BoredomProfile */
/** @typedef {import('./types.js').Activity} Activity */

import { BOREDOM_ACTIVITIES } from './activities.js'

const SETTING_SOCIAL_MAP = {
  'set-home-solo': { setting: 'home', socialMode: 'solo' },
  'set-home-with': { setting: 'home', socialMode: 'with-someone' },
  'set-out-solo': { setting: 'out', socialMode: 'solo' },
  'set-out-with': { setting: 'out', socialMode: 'with-someone' },
  'set-around': { setting: 'out', socialMode: 'around-people-no-chat' },
  'set-flex': { setting: 'either', socialMode: 'flexible' },
}

const ENERGY_MAP = {
  'en-very-low': 'very-low',
  'en-calm': 'calm',
  'en-movement': 'movement',
  'en-high': 'high',
  'en-unsure': 'unsure',
}

const CRAVING_MAP = {
  'crave-comfort': 'comfort',
  'crave-movement': 'movement',
  'crave-creativity': 'creativity',
  'crave-exploration': 'exploration',
  'crave-mental': 'mental',
  'crave-connection': 'connection',
  'crave-switch-off': 'switch-off',
  'crave-novelty': 'novelty',
  'crave-unsure': 'unsure',
}

const TIME_MAP = {
  'time-5': 'five-minutes',
  'time-hour': 'one-hour',
  'time-few': 'few-hours',
  'time-open': 'unlimited',
}

const BUDGET_MAP = {
  'budget-free': 'free',
  'budget-small': 'small-spend',
  'budget-more': 'higher-spend',
  'budget-flex': 'flexible',
}

export const BOREDOM_QUESTION_IDS = ['b-energy', 'b-setting', 'b-cravings', 'b-limits']

/**
 * Build profile from answers keyed by question ID.
 * Returns null when required answers are missing (strict mode, default).
 * @param {Record<string, unknown>} answersByQuestionId
 * @param {{ strict?: boolean }} [options]
 * @returns {BoredomProfile | null}
 */
export function buildBoredomProfile(answersByQuestionId, { strict = true } = {}) {
  const energyAns = answersByQuestionId['b-energy']?.id
  const settingAns = answersByQuestionId['b-setting']?.id
  const cravingAns = answersByQuestionId['b-cravings']
  const limitsAns = answersByQuestionId['b-limits']

  const settingSocial = SETTING_SOCIAL_MAP[settingAns]

  let cravings = []
  if (cravingAns?.multi) {
    cravings = cravingAns.options.map((o) => CRAVING_MAP[o.id]).filter(Boolean)
  } else if (cravingAns?.id) {
    cravings = [CRAVING_MAP[cravingAns.id]].filter(Boolean)
  }

  if (strict) {
    if (!energyAns || !settingAns || !settingSocial || !limitsAns?.time || !limitsAns?.budget) {
      return null
    }
    if (!cravings.length) return null
  }

  const time = TIME_MAP[limitsAns?.time]
  const budget = BUDGET_MAP[limitsAns?.budget]

  if (strict && (!time || !budget)) return null

  return {
    energy: ENERGY_MAP[energyAns] || 'unsure',
    setting: settingSocial?.setting || 'either',
    socialMode: settingSocial?.socialMode || 'flexible',
    cravings,
    time: time || 'one-hour',
    budget: budget || 'flexible',
  }
}

export function validateActivityMetadata(activity) {
  const required = ['settings', 'socialModes', 'energy', 'cravings', 'durations', 'costs']
  const missing = required.filter((k) => !Array.isArray(activity[k]) || activity[k].length === 0)
  return { valid: missing.length === 0, missing }
}

export function validateAllActivities(activities = BOREDOM_ACTIVITIES) {
  return activities.map((a) => ({ id: a.id, ...validateActivityMetadata(a) }))
}

export { BOREDOM_ACTIVITIES }
