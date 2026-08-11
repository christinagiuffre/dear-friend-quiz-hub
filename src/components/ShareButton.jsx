import { useEffect, useState } from 'react'
import { shareResult } from '../lib/share'
import { site } from '../data/site'

export default function ShareButton({ title, text, url, variant = 'soft' }) {
  const [status, setStatus] = useState(null)
  const isText = variant === 'text'

  useEffect(() => {
    if (!status || status === 'shared') return
    const timer = setTimeout(() => setStatus(null), 3200)
    return () => clearTimeout(timer)
  }, [status])

  async function handleShare() {
    const outcome = await shareResult({ title, text, url })
    if (outcome !== 'cancelled') setStatus(outcome)
  }

  const message = {
    shared: 'Shared — thank you!',
    copied: 'Copied — ready to share.',
    failed: 'Couldn’t copy automatically — select the text below instead.',
  }[status]

  return (
    <div className={isText ? 'result-share-link-wrap' : undefined}>
      <button
        type="button"
        onClick={handleShare}
        className={isText ? 'btn-text' : 'btn-soft'}
      >
        {!isText && <ShareIcon />}
        {site.labels.share}
      </button>

      {message && (
        <p className="result-share-status animate-floatUp" role="status">
          {message}
        </p>
      )}

      {status === 'failed' && (
        <p className="result-share-fallback select-all">{text}</p>
      )}
    </div>
  )
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v13" />
      <path d="m7 8 5-5 5 5" />
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </svg>
  )
}
