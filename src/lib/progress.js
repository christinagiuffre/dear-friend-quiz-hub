/** Progress uses currentStep / totalSteps — never partial path length. */

export function calculateProgress(currentStep, totalSteps) {
  const total = Math.max(1, totalSteps)
  const current = Math.min(Math.max(1, currentStep), total)
  const percent = (current / total) * 100
  return {
    current,
    total,
    percent,
    label: Math.round(percent),
  }
}
