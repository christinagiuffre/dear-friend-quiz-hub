import { describe, it, expect } from 'vitest'
import {
  buildBoredomProfile,
  getBoredomRecommendations,
  filterActivities,
  validateAllActivities,
  BOREDOM_ACTIVITIES,
  activityViolatesProfile,
  isPaidActivity,
} from './index.js'

const CRAVING_IDS = [
  'crave-comfort',
  'crave-movement',
  'crave-creativity',
  'crave-exploration',
  'crave-mental',
  'crave-connection',
  'crave-switch-off',
  'crave-novelty',
]

const ENERGY_IDS = ['en-very-low', 'en-calm', 'en-movement', 'en-high', 'en-unsure']
const SETTING_IDS = [
  'set-home-solo',
  'set-home-with',
  'set-out-solo',
  'set-out-with',
  'set-around',
  'set-flex',
]
const TIME_IDS = ['time-5', 'time-hour', 'time-few', 'time-open']
const BUDGET_IDS = ['budget-free', 'budget-small', 'budget-more', 'budget-flex']

function cravingCombinations() {
  const combos = [['crave-unsure']]
  for (const id of CRAVING_IDS) combos.push([id])
  for (let i = 0; i < CRAVING_IDS.length; i++) {
    for (let j = i + 1; j < CRAVING_IDS.length; j++) {
      combos.push([CRAVING_IDS[i], CRAVING_IDS[j]])
    }
  }
  return combos
}

function makeAnswers(energy, setting, cravings, time, budget) {
  return {
    'b-energy': { id: energy },
    'b-setting': { id: setting },
    'b-cravings': {
      multi: true,
      options: cravings.map((id) => ({ id })),
    },
    'b-limits': { time, budget },
  }
}

function assertNoContradiction(activity, profile) {
  expect(activityViolatesProfile(activity, profile)).toBe(false)
}

function isPaid(activity) {
  return isPaidActivity(activity)
}

describe('boredom catalogue metadata', () => {
  it('every activity has valid metadata', () => {
    const results = validateAllActivities()
    const invalid = results.filter((r) => !r.valid)
    expect(invalid).toEqual([])
  })
})

describe('boredom exhaustive combinations', () => {
  const failures = []
  let tested = 0
  let passed = 0

  for (const energy of ENERGY_IDS) {
    for (const setting of SETTING_IDS) {
      for (const cravings of cravingCombinations()) {
        for (const time of TIME_IDS) {
          for (const budget of BUDGET_IDS) {
            tested++
            const answers = makeAnswers(energy, setting, cravings, time, budget)
            const profile = buildBoredomProfile(answers)

            try {
              expect(profile.energy).toBeTruthy()
              expect(profile.setting).toBeTruthy()
              expect(profile.budget).toBeTruthy()

              const result = getBoredomRecommendations(profile, [])
              expect(result).toBeDefined()
              expect(result.profile).toEqual(profile)

              const picks = [result.best, result.easy, result.wildcard].filter(Boolean)
              if (result.passed.length >= 3) {
                expect(picks.length).toBeGreaterThanOrEqual(1)
              }

              for (const activity of picks) {
                assertNoContradiction(activity, profile)
                if (profile.budget === 'free') {
                  expect(activity.costs.includes('free')).toBe(true)
                }
              }

              if (profile.budget === 'higher-spend') {
                const paidInPool = result.passed.filter(isPaid).length
                if (paidInPool >= 2) {
                  const paidCount = picks.filter(isPaid).length
                  if (paidCount < 2) {
                    failures.push({
                      profile,
                      reason: 'higher-spend needs 2 paid',
                      picks: picks.map((p) => p.id),
                    })
                    continue
                  }
                }
              }
              passed++

              const retry = getBoredomRecommendations(profile, picks.map((p) => p.id))
              const retryIds = [retry.best, retry.easy, retry.wildcard].filter(Boolean).map((p) => p.id)
              for (const id of retryIds) {
                expect(picks.map((p) => p.id)).not.toContain(id)
              }
            } catch (err) {
              failures.push({ profile, reason: err.message })
            }
          }
        }
      }
    }
  }

  it(`tests ${tested} combinations with ${passed} passed`, () => {
    console.log(`Boredom combinations tested: ${tested}, passed: ${passed}, failed: ${failures.length}`)
    if (failures.length) console.log('Sample failures:', failures.slice(0, 5))
    expect(failures).toEqual([])
    expect(tested).toBeGreaterThan(10000)
  })
})

describe('boredom golden journeys', () => {
  const journeyA = makeAnswers(
    'en-very-low',
    'set-home-solo',
    ['crave-comfort', 'crave-switch-off'],
    'time-hour',
    'budget-free'
  )

  const journeyB = makeAnswers(
    'en-movement',
    'set-out-with',
    ['crave-exploration', 'crave-novelty'],
    'time-few',
    'budget-more'
  )

  const journeyC = makeAnswers(
    'en-calm',
    'set-around',
    ['crave-mental', 'crave-exploration'],
    'time-hour',
    'budget-small'
  )

  const journeyD = makeAnswers(
    'en-unsure',
    'set-flex',
    ['crave-unsure'],
    'time-hour',
    'budget-flex'
  )

  const forbiddenA = [
    'out-photo-walk',
    'out-solo-cafe',
    'out-coffee-catchup',
    'out-bookshop',
    'out-market-wander',
  ]

  it('Journey A: quiet home option', () => {
    const profile = buildBoredomProfile(journeyA)
    const { best, easy, wildcard } = getBoredomRecommendations(profile, [])
    const picks = [best, easy, wildcard].filter(Boolean)

    picks.forEach((a) => {
      assertNoContradiction(a, profile)
      expect(a.settings.includes('home') || a.settings.includes('either')).toBe(true)
      expect(a.socialModes.includes('solo') || a.socialModes.includes('flexible')).toBe(true)
      expect(a.costs.includes('free')).toBe(true)
      expect(forbiddenA).not.toContain(a.id)
    })

    let excluded = picks.map((p) => p.id)
    const retry = getBoredomRecommendations(profile, excluded)
    ;[retry.best, retry.easy, retry.wildcard].filter(Boolean).forEach((a) => {
      assertNoContradiction(a, profile)
      expect(excluded).not.toContain(a.id)
    })
  })

  it('Journey B: paid outing', () => {
    const profile = buildBoredomProfile(journeyB)
    const { best, easy, wildcard } = getBoredomRecommendations(profile, [])
    const picks = [best, easy, wildcard].filter(Boolean)

    const paidCount = picks.filter(isPaid).length
    expect(paidCount).toBeGreaterThanOrEqual(2)

    picks.forEach((a) => {
      assertNoContradiction(a, profile)
      expect(a.settings.includes('out')).toBe(true)
      expect(a.socialModes.includes('with-someone') || a.socialModes.includes('flexible')).toBe(
        true
      )
      expect(a.id).not.toMatch(/home-/)
    })
  })

  it('Journey C: company without conversation', () => {
    const profile = buildBoredomProfile(journeyC)
    const { best, easy, wildcard } = getBoredomRecommendations(profile, [])
    const picks = [best, easy, wildcard].filter(Boolean)

    picks.forEach((a) => {
      assertNoContradiction(a, profile)
      expect(
        a.socialModes.includes('around-people-no-chat') || a.socialModes.includes('flexible')
      ).toBe(true)
      expect(a.id).not.toBe('out-coffee-catchup')
    })
  })

  it('home + happy to spend returns paid home ideas', () => {
    const profile = buildBoredomProfile(
      makeAnswers('en-calm', 'set-home-solo', ['crave-comfort'], 'time-hour', 'budget-more')
    )
    const { best, easy, wildcard } = getBoredomRecommendations(profile, [])
    const picks = [best, easy, wildcard].filter(Boolean)
    expect(picks.filter(isPaid).length).toBeGreaterThanOrEqual(2)
    picks.filter(isPaid).forEach((a) => {
      expect(a.settings.includes('home') || a.settings.includes('either')).toBe(true)
    })
  })

  it('Journey D: genuinely unsure', () => {
    const profile = buildBoredomProfile(journeyD)
    const { best, easy, wildcard } = getBoredomRecommendations(profile, [])
    const picks = [best, easy, wildcard].filter(Boolean)
    expect(picks.length).toBeGreaterThanOrEqual(3)
    const ids = new Set(picks.map((p) => p.id))
    expect(ids.size).toBe(picks.length)
  })
})
