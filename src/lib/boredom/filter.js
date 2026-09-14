/** @typedef {import('./types.js').BoredomProfile} BoredomProfile */
/** @typedef {import('./types.js').Activity} Activity */

const ENERGY_COMPAT = {
  'very-low': ['very-low', 'calm'],
  calm: ['calm', 'very-low'],
  movement: ['movement', 'high', 'calm'],
  high: ['high', 'movement'],
  unsure: ['very-low', 'calm', 'movement', 'high'],
}

const TIME_COMPAT = {
  'five-minutes': ['five-minutes'],
  'one-hour': ['five-minutes', 'one-hour'],
  'few-hours': ['five-minutes', 'one-hour', 'few-hours'],
  unlimited: ['five-minutes', 'one-hour', 'few-hours', 'unlimited'],
}

function matchesSetting(activity, profile) {
  if (profile.setting === 'either') return true
  return activity.settings.includes(profile.setting) || activity.settings.includes('either')
}

function matchesSocial(activity, profile) {
  if (profile.socialMode === 'flexible') return true
  return (
    activity.socialModes.includes(profile.socialMode) ||
    activity.socialModes.includes('flexible')
  )
}

function matchesEnergy(activity, profile) {
  if (profile.energy === 'unsure') return true
  const allowed = ENERGY_COMPAT[profile.energy] || [profile.energy]
  return activity.energy.some((e) => allowed.includes(e))
}

function matchesTime(activity, profile) {
  const allowed = TIME_COMPAT[profile.time] || TIME_COMPAT['one-hour']
  return activity.durations.some((d) => allowed.includes(d))
}

function matchesBudget(activity, profile, strict = true) {
  if (profile.budget === 'flexible') return true
  if (profile.budget === 'free') return activity.costs.includes('free')
  if (profile.budget === 'small-spend') {
    return activity.costs.includes('free') || activity.costs.includes('small-spend')
  }
  return true
}

/**
 * Hard filter — returns { passed, rejected } with reasons.
 */
export function filterActivities(profile, activities, excludedIds = []) {
  const passed = []
  const rejected = []

  for (const activity of activities) {
    if (excludedIds.includes(activity.id)) {
      rejected.push({ id: activity.id, reason: 'already_shown' })
      continue
    }

    if (!matchesSetting(activity, profile)) {
      rejected.push({ id: activity.id, reason: 'setting' })
      continue
    }
    if (!matchesSocial(activity, profile)) {
      rejected.push({ id: activity.id, reason: 'social' })
      continue
    }
    if (!matchesEnergy(activity, profile)) {
      rejected.push({ id: activity.id, reason: 'energy' })
      continue
    }
    if (!matchesTime(activity, profile)) {
      rejected.push({ id: activity.id, reason: 'time' })
      continue
    }
    if (!matchesBudget(activity, profile)) {
      rejected.push({ id: activity.id, reason: 'budget' })
      continue
    }

    passed.push(activity)
  }

  return { passed, rejected }
}

export function activityViolatesProfile(activity, profile) {
  const { passed } = filterActivities(profile, [activity], [])
  return passed.length === 0
}
