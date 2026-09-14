import { Link } from 'react-router-dom'
import CTAButtons from '../CTAButtons'
import { Illustration } from '../Characters'
import { site } from '../../data/site'

export default function ResultLayout({
  title,
  subtitle,
  art = 'duo',
  summary,
  immediateAction,
  immediateLabel = 'What you can do now',
  secondaryNote,
  sections = [],
  reminder,
  quizId,
  shareTitle,
  shareText,
  shareUrl,
  showShare = true,
  children,
}) {
  return (
    <>
      <section className="result-share-card" id="result-card">
        <div className="result-art-wrap">
          <Illustration name={art} size="result" priority />
        </div>

        <h1 className="result-title">{title}</h1>
        {subtitle && <p className="result-label-pill">{subtitle}</p>}
        {summary && <p className="result-note">{summary}</p>}

        {immediateAction && (
          <div className="result-now-card mt-4">
            <p className="result-section-heading">{immediateLabel}</p>
            <p className="result-section-body">{immediateAction}</p>
          </div>
        )}

        {secondaryNote && <p className="result-note mt-3">{secondaryNote}</p>}

        {sections.length > 0 && (
          <div className="result-sections mt-4">
            {sections.map((section) => (
              <div key={section.heading} className="result-section-card text-left">
                <p className="result-section-heading">{section.heading}</p>
                <p className="result-section-body mt-2">{section.body}</p>
              </div>
            ))}
          </div>
        )}

        {children}

        {reminder && (
          <div className="result-section-card mt-4 text-left">
            <p className="result-section-heading">Dear Friend reminder</p>
            <p className="result-section-body mt-2">{reminder}</p>
          </div>
        )}

        <p className="result-watermark">Dear Friend Check-Ins · {site.shortUrl}</p>
      </section>

      <div className="result-cta-area">
        {showShare && shareText ? (
          <CTAButtons
            quizId={quizId}
            shareTitle={shareTitle || 'Dear Friend Check-In'}
            shareText={shareText}
            shareUrl={shareUrl || site.url}
          />
        ) : (
          <div className="result-cta-group">
            <Link to={`/quiz/${quizId}/play?fresh=1`} className="btn-primary">
              {site.labels.takeAgain}
            </Link>
            <Link to="/" className="btn-secondary">
              {site.labels.backToHub}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
