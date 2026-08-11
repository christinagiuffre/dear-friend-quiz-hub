import { useState } from 'react'

const ART = {
  spark: {
    file: 'spark',
    width: 720,
    height: 640,
    alt: 'Sunny and Sheepito celebrating together',
    emoji: '✨',
    gradient: 'from-amber-100 via-orange-100 to-pink-100',
  },
  pause: {
    file: 'pause',
    width: 720,
    height: 373,
    alt: 'Sunny and Sheepito wrapped in blankets with hot chocolate',
    emoji: '☁️',
    gradient: 'from-sky-100 via-blue-100 to-purple-100',
  },
  connection: {
    file: 'connection',
    width: 720,
    height: 640,
    alt: 'Sunny and Sheepito hugging',
    emoji: '💜',
    gradient: 'from-pink-100 via-purple-100 to-blue-100',
  },
  gentleness: {
    file: 'gentleness',
    width: 720,
    height: 470,
    alt: 'Sheepito comforting Sunny',
    emoji: '🌸',
    gradient: 'from-rose-100 via-pink-100 to-purple-100',
  },
  treats: {
    file: 'treats',
    width: 720,
    height: 421,
    alt: 'Sunny and Sheepito sharing a sweet treat',
    emoji: '🧁',
    gradient: 'from-yellow-100 via-pink-100 to-purple-100',
  },
  duo: {
    file: 'duo',
    width: 720,
    height: 640,
    alt: 'Sunny and Sheepito together',
    emoji: '🐕',
    gradient: 'from-purple/20 via-blue/15 to-pink/20',
  },
  books: {
    file: 'books',
    width: 800,
    height: 387,
    alt: 'The four Dear Friend books',
    emoji: '📚',
    gradient: 'from-purple/15 via-blue/10 to-pink/15',
  },
}

const SIZE_WIDTH = {
  sm: 96,
  md: 120,
  lg: 120,
  hub: 130,
  result: 110,
}

function IllustrationFallback({ art, displayWidth, className, compact }) {
  const box = compact ? 88 : Math.round(displayWidth * 0.85)
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br shadow-soft ${art.gradient} ${className}`}
      style={{ width: box, height: box }}
      role="img"
      aria-label={art.alt}
    >
      <span className={compact ? 'text-3xl' : 'text-4xl'} aria-hidden="true">{art.emoji}</span>
    </div>
  )
}

export function Illustration({ name, size = 'md', className = '', priority = false }) {
  const art = ART[name] || ART.duo
  const displayWidth = SIZE_WIDTH[size] || SIZE_WIDTH.md
  const displayHeight = Math.round(displayWidth * (art.height / art.width))
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <IllustrationFallback
        art={art}
        displayWidth={displayWidth}
        className={className}
        compact={size === 'lg' || size === 'md' || size === 'result'}
      />
    )
  }

  return (
    <img
      src={`/brand/${art.file}.png`}
      alt={art.alt}
      width={displayWidth}
      height={displayHeight}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={`mx-auto h-auto max-w-full select-none ${className}`}
      style={{
        width: displayWidth,
        maxWidth: size === 'result' ? 110 : undefined,
        maxHeight: size === 'result' ? 72 : size === 'lg' ? 120 : undefined,
      }}
      draggable="false"
    />
  )
}

/** Compact centred art for hub feature card (~130px). */
export function HubIllustration({ name = 'connection', priority = true }) {
  const art = ART[name] || ART.duo
  const width = SIZE_WIDTH.hub
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="hub-art-wrap">
        <IllustrationFallback art={art} displayWidth={width} compact />
      </div>
    )
  }

  return (
    <div className="hub-art-wrap">
      <img
        src={`/brand/${art.file}.png`}
        alt={art.alt}
        width={width}
        height={Math.round(width * (art.height / art.width))}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className="hub-art-img"
        draggable="false"
      />
    </div>
  )
}

/** Compact centred art for intro screen. */
export function IntroIllustration({ name = 'duo', priority = true }) {
  const art = ART[name] || ART.duo
  const width = SIZE_WIDTH.hub
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="intro-art-wrap">
        <IllustrationFallback art={art} displayWidth={width} compact />
      </div>
    )
  }

  return (
    <div className="intro-art-wrap">
      <img
        src={`/brand/${art.file}.png`}
        alt={art.alt}
        width={width}
        height={Math.round(width * (art.height / art.width))}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className="intro-art-img"
        draggable="false"
      />
    </div>
  )
}
