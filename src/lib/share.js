// Web Share API where supported, clipboard fallback everywhere else.
// Returns 'shared' | 'copied' | 'failed' | 'cancelled'

function textAlreadyHasUrl(text, url) {
  if (!url) return true
  const bare = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '')
  return text.toLowerCase().includes(bare.toLowerCase())
}

export function buildShareText(resultTitle, shortUrl = 'quiz.mach.global') {
  return `I got ‘${resultTitle}’ on the Dear Friend check-in. A tiny reminder of what my mind might need today. Try it here: ${shortUrl}`
}

export async function shareResult({ title, text, url }) {
  const duplicate = textAlreadyHasUrl(text, url)

  if (navigator.share) {
    const payload = duplicate ? { title, text } : { title, text, url }
    try {
      await navigator.share(payload)
      return 'shared'
    } catch (error) {
      if (error && error.name === 'AbortError') return 'cancelled'
    }
  }

  const fallback = duplicate ? text : `${text} ${url}`

  try {
    await navigator.clipboard.writeText(fallback)
    return 'copied'
  } catch {
    return 'failed'
  }
}
