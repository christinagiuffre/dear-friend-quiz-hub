import { boredomActivities } from '../data/checkins/boredomActivities.js'

const COST_ALIASES = {
  low: 'low-cost',
  spend: 'paid',
}

/** Merge tag objects from selected options into a preference profile. */
export function mergeTags(selectedOptions) {
  const profile = {}
  for (const option of selectedOptions) {
    if (!option?.tags) continue
    for (const [key, value] of Object.entries(option.tags)) {
      profile[key] = key === 'cost' ? COST_ALIASES[value] || value : value
    }
  }
  return profile
}

function normalizeCost(cost) {
  return COST_ALIASES[cost] || cost
}

function timeMatches(activityTime, preferred) {
  if (!preferred) return true
  if (preferred === 'short') return activityTime === 'short'
  if (preferred === 'medium') return activityTime === 'short' || activityTime === 'medium'
  return true
}

function energyMatches(activityEnergy, preferred) {
  if (!preferred) return true
  if (preferred === 'low') return activityEnergy === 'low' || activityEnergy === 'chill'
  if (preferred === 'active') return activityEnergy === 'active' || activityEnergy === 'medium'
  if (preferred === 'chill') return activityEnergy === 'chill' || activityEnergy === 'low' || activityEnergy === 'medium'
  if (preferred === 'medium') return true
  return activityEnergy === preferred
}

/** Hard constraint filter — incompatible activities are removed entirely. */
export function passesHardConstraints(activity, profile) {
  const tags = activity.tags

  if (profile.location && profile.location !== 'either') {
    if (tags.location !== profile.location) return false
  }

  if (profile.social && tags.social !== profile.social) return false

  if (!energyMatches(tags.energy, profile.energy)) return false

  if (!timeMatches(tags.time, profile.time)) return false

  const budget = normalizeCost(profile.cost)
  const activityCost = normalizeCost(tags.cost)
  if (budget === 'free' && activityCost !== 'free') return false
  if (budget === 'low-cost' && activityCost === 'paid') return false

  return true
}

function preferenceScore(activity, profile) {
  const tags = activity.tags
  let score = 0

  const prefs = [
    ['mode', 3],
    ['novelty', 2],
    ['mental', 2],
    ['stimulation', 1],
  ]

  for (const [key, weight] of prefs) {
    const preferred = profile[key]
    if (!preferred) continue
    if (tags[key] === preferred) score += weight
    else if (preferred === 'medium' && tags[key]) score += weight * 0.5
  }

  if (profile.cost === 'paid' && normalizeCost(tags.cost) === 'paid') score += 3
  if (profile.energy === 'active' && tags.energy === 'active') score += 2

  return score
}

function rankActivities(activities, profile) {
  return activities
    .map((activity) => ({
      activity,
      score: preferenceScore(activity, profile),
    }))
    .sort((a, b) => b.score - a.score || a.activity.id.localeCompare(b.activity.id))
}

function pickThree(ranked, profile, excludedIds = []) {
  const pool = ranked
    .map((r) => r.activity)
    .filter((a) => !excludedIds.includes(a.id))

  if (pool.length === 0) {
    return { best: null, easy: null, wildcard: null, exhausted: true, audit: { pool: [] } }
  }

  const budget = normalizeCost(profile.cost)
  let selected = []

  if (budget === 'paid') {
    const paid = pool.filter((a) => normalizeCost(a.tags.cost) === 'paid')
    const freeOrLow = pool.filter((a) => normalizeCost(a.tags.cost) !== 'paid')

    selected.push(paid[0] || pool[0])
    selected.push(paid[1] || pool.find((a) => !selected.includes(a)) || pool[1])
    selected.push(
      paid[2] ||
        freeOrLow[0] ||
        pool.find((a) => !selected.includes(a)) ||
        pool[2]
    )
  } else {
    selected = [pool[0], pool[1], pool[2]].filter(Boolean)
  }

  selected = [...new Set(selected)].slice(0, 3)
  while (selected.length < 3 && selected.length < pool.length) {
    const next = pool.find((a) => !selected.includes(a))
    if (!next) break
    selected.push(next)
  }

  return {
    best: selected[0] || null,
    easy: selected[1] || selected[0] || null,
    wildcard: selected[2] || selected[1] || selected[0] || null,
    exhausted: pool.length < 3,
    audit: {
      poolSize: pool.length,
      rankedTop: ranked.slice(0, 8).map((r) => ({
        id: r.activity.id,
        score: r.score,
        cost: r.activity.tags.cost,
      })),
    },
  }
}

export function filterActivities(profile, excludedIds = []) {
  const rejected = []
  const passed = []

  for (const activity of boredomActivities) {
    if (excludedIds.includes(activity.id)) continue
    if (passesHardConstraints(activity, profile)) {
      passed.push(activity)
    } else {
      rejected.push({
        id: activity.id,
        reason: 'hard_constraint',
      })
    }
  }

  return { passed, rejected }
}

/**
 * Two-stage recommendation: filter hard constraints, then rank by preferences.
 */
export function getBoredomRecommendations(profile, excludedIds = []) {
  const { passed, rejected } = filterActivities(profile, excludedIds)
  const ranked = rankActivities(passed, profile)
  const picks = pickThree(ranked, profile, excludedIds)

  return {
    ...picks,
    rejected,
    profile,
  }
}

export function buildBoredomSummary(profile) {
  const parts = []

  if (profile.location === 'out') parts.push('get out')
  else if (profile.location === 'in') parts.push('stay in')

  if (profile.social === 'alone') parts.push('on your own')
  else if (profile.social === 'connect') parts.push('with someone')
  else if (profile.social === 'ambient') {
    parts.push("be around people without pressure to chat")
  }

  if (profile.energy === 'active') parts.push('move your body')
  else if (profile.energy === 'low') parts.push('keep things gentle')
  else if (profile.energy === 'chill') parts.push('take it easy')

  if (profile.mode === 'explore') parts.push('explore something')
  else if (profile.mode === 'create') parts.push('make something')
  else if (profile.mode === 'consume') parts.push('enjoy something')

  if (profile.novelty === 'new') parts.push('try something new')

  const budget = normalizeCost(profile.cost)
  if (budget === 'paid') parts.push("you're comfortable spending a little")
  else if (budget === 'free') parts.push('keep it free')

  if (parts.length === 0) {
    return "You're looking for something that fits how you feel right now."
  }

  const lead = parts.slice(0, 3).join(', ')
  const tail = parts.length > 3 ? `, and ${parts.slice(3).join(', ')}` : ''
  return `You want to ${lead}${tail}.`
}

export function auditBoredomRecommendations(profile, excludedIds = []) {
  const { passed, rejected } = filterActivities(profile, excludedIds)
  const ranked = rankActivities(passed, profile)
  const result = getBoredomRecommendations(profile, excludedIds)

  return {
    profile,
    hardConstraints: {
      location: profile.location,
      social: profile.social,
      energy: profile.energy,
      time: profile.time,
      cost: normalizeCost(profile.cost),
    },
    rejected,
    candidates: ranked.map((r) => ({
      id: r.activity.id,
      title: r.activity.title,
      score: r.score,
      tags: r.activity.tags,
    })),
    selected: [result.best, result.easy, result.wildcard].filter(Boolean).map((a) => a.id),
  }
}
