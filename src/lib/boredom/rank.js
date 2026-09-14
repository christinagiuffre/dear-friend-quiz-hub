/** @typedef {import('./types.js').BoredomProfile} BoredomProfile */
/** @typedef {import('./types.js').Activity} Activity */

/**
 * Score by craving overlap and energy fit.
 */
export function rankActivities(profile, activities) {
  const cravings =
    profile.cravings.includes('unsure') || profile.cravings.length === 0
      ? ['comfort', 'exploration', 'novelty', 'switch-off', 'mental']
      : profile.cravings

  return activities
    .map((activity) => {
      let score = 0
      const cravingHits = activity.cravings.filter((c) => cravings.includes(c)).length
      score += cravingHits * 4

      if (profile.energy !== 'unsure' && activity.energy.includes(profile.energy)) score += 3

      if (profile.budget === 'higher-spend') {
        if (activity.costs.includes('higher-spend')) score += 10
        if (activity.costs.length === 1 && activity.costs[0] === 'free') score -= 8
      } else if (profile.budget === 'small-spend' && activity.costs.includes('small-spend')) {
        score += 2
      }

      return { activity, score }
    })
    .sort((a, b) => b.score - a.score || a.activity.id.localeCompare(b.activity.id))
}
