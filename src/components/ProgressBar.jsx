export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="mb-5">
      <div className="progress-header">
        <span className="progress-label">
          Question {current} of {total}
        </span>
        <span className="progress-pct">{percent}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
