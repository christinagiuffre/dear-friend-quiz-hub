/** @typedef {import('./types.js').BoredomProfile} BoredomProfile */
/** @typedef {import('./types.js').Activity} Activity */

export function isPaidActivity(activity) {
  return activity.costs.includes('higher-spend')
}

export function isFreeOnly(activity) {
  return activity.costs.every((c) => c === 'free')
}

/**
 * Human-readable cost for the current profile.
 */
export function formatActivityCost(activity, profile) {
  if (!activity?.costs?.length) return ''

  if (profile.budget === 'free') return 'Free'

  if (profile.budget === 'higher-spend') {
    if (isPaidActivity(activity)) return 'Paid experience'
    if (activity.costs.includes('small-spend')) return 'Small spend'
    return 'Free'
  }

  if (profile.budget === 'small-spend') {
    if (activity.costs.includes('small-spend')) return 'Small spend'
    if (isFreeOnly(activity)) return 'Free'
    if (isPaidActivity(activity)) return 'Paid option'
    return activity.costs.join(', ')
  }

  if (isFreeOnly(activity)) return 'Free'
  if (isPaidActivity(activity)) return 'Paid experience'
  if (activity.costs.includes('small-spend')) return 'Small spend'
  return 'Flexible budget'
}
