export default function ProgressBar({ current, total, label = 'Question' }) {
  const safeTotal = Math.max(1, total)
  const safeCurrent = Math.min(Math.max(1, current), safeTotal)
  const percent = (safeCurrent / safeTotal) * 100
  const displayPercent = Math.round(percent * 10) / 10

  return (
    <div className="mb-5">
      <div className="progress-header">
        <span className="progress-label">
          {label} {safeCurrent} of {safeTotal}
        </span>
        <span className="progress-pct">{displayPercent % 1 === 0 ? Math.round(percent) : displayPercent}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-label={`${label} ${safeCurrent} of ${safeTotal}`}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
