/** @typedef {import('./types.js').BoredomProfile} BoredomProfile */

import { filterActivities } from './filter.js'
import { rankActivities } from './rank.js'
import { BOREDOM_ACTIVITIES } from './activities.js'
import { isPaidActivity } from './cost.js'

function selectDefaultThree(pool) {
  const selected = []
  selected.push(pool[0])

  const easyPick =
    pool.find((a) => a.id !== selected[0].id && a.energy.includes('calm')) ||
    pool.find((a) => a.id !== selected[0].id)
  if (easyPick) selected.push(easyPick)

  const wildcardPick = pool.find((a) => !selected.includes(a)) || pool[2]
  if (wildcardPick && !selected.includes(wildcardPick)) selected.push(wildcardPick)

  return selected.slice(0, 3)
}

function selectHigherSpendThree(pool) {
  const paid = pool.filter(isPaidActivity)

  if (paid.length >= 2) {
    const best = paid[0]
    const easy =
      paid.find((a) => a.id !== best.id && a.energy.includes('calm')) ||
      paid.find((a) => a.id !== best.id) ||
      paid[1]
    const wildcard =
      pool.find((a) => a.id !== best.id && a.id !== easy.id && isPaidActivity(a)) ||
      pool.find((a) => a.id !== best.id && a.id !== easy.id) ||
      paid[2] ||
      pool[0]

    return [best, easy, wildcard].filter(Boolean).slice(0, 3)
  }

  if (paid.length === 1) {
    const others = pool.filter((a) => a.id !== paid[0].id)
    return [paid[0], others[0], others[1]].filter(Boolean).slice(0, 3)
  }

  return selectDefaultThree(pool)
}

/**
 * Select best, easy, wildcard from ranked pool.
 */
export function selectRecommendations(profile, activities, history = []) {
  const { passed, rejected } = filterActivities(profile, activities, history)
  const ranked = rankActivities(profile, passed)

  if (ranked.length === 0) {
    return {
      best: null,
      easy: null,
      wildcard: null,
      exhausted: true,
      needsLoosen: true,
      paidShortfall: profile.budget === 'higher-spend',
      passed: [],
      rejected,
      profile,
      history,
    }
  }

  const pool = ranked.map((r) => r.activity)
  const paidInPool = pool.filter(isPaidActivity)

  let selected =
    profile.budget === 'higher-spend' ? selectHigherSpendThree(pool) : selectDefaultThree(pool)

  selected = [...new Map(selected.map((a) => [a.id, a])).values()].slice(0, 3)

  while (selected.length < 3 && selected.length < pool.length) {
    const next = pool.find((a) => !selected.some((s) => s.id === a.id))
    if (!next) break
    selected.push(next)
  }

  const paidInSelection = selected.filter(isPaidActivity).length
  const paidShortfall =
    profile.budget === 'higher-spend' && paidInPool.length >= 2 && paidInSelection < 2

  return {
    best: selected[0] || null,
    easy: selected[1] || selected[0] || null,
    wildcard: selected[2] || selected[1] || selected[0] || null,
    exhausted: pool.length < 3,
    needsLoosen: pool.length < 3 || (profile.budget === 'higher-spend' && paidInPool.length < 2),
    paidShortfall,
    paidInPool: paidInPool.length,
    paidInSelection,
    passed: pool,
    rejected,
    profile,
    history,
  }
}

export function getBoredomRecommendations(profile, history = []) {
  return selectRecommendations(profile, BOREDOM_ACTIVITIES, history)
}

export function buildBoredomSummary(profile) {
  const parts = []

  if (profile.setting === 'home') parts.push('stay in')
  else if (profile.setting === 'out') parts.push('get out')
  else parts.push('keep things flexible')

  if (profile.socialMode === 'solo') parts.push('on your own')
  else if (profile.socialMode === 'with-someone') parts.push('with someone')
  else if (profile.socialMode === 'around-people-no-chat') {
    parts.push('be around people without needing to chat')
  }

  if (profile.energy === 'movement') parts.push('move your body')
  else if (profile.energy === 'very-low') parts.push('keep it gentle')
  else if (profile.energy === 'high') parts.push('do something engaging')

  if (profile.cravings?.length && !profile.cravings.includes('unsure')) {
    parts.push(`lean into ${profile.cravings.slice(0, 2).join(' and ')}`)
  }

  if (profile.budget === 'higher-spend') parts.push("you're happy to spend for a good idea")
  else if (profile.budget === 'free') parts.push('keep it free')

  return parts.length
    ? `You want to ${parts.join(', ')}.`
    : 'Here are three varied ideas that might hit the spot.'
}
