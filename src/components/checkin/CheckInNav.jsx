import { Link } from 'react-router-dom'

export default function CheckInNav({ onBack, backLabel = '← Back', showHubLink = true }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      {onBack ? (
        <button type="button" onClick={onBack} className="btn-text px-1 py-2">
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      {showHubLink && (
        <Link to="/" className="btn-text px-1 py-2">
          Quiz hub
        </Link>
      )}
    </div>
  )
}
