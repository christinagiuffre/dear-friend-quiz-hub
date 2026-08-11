import { useEffect } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import CTAButtons from '../components/CTAButtons'
import Disclaimer from '../components/Disclaimer'
import { Illustration } from '../components/Characters'
import { getQuiz } from '../data/quizzes'
import { site } from '../data/site'
import { buildShareText } from '../lib/share'

function ResultNote({ showAlsoShowingUp, secondResult, isMixed }) {
  if (showAlsoShowingUp && secondResult && isMixed) {
    return (
      <>
        Also showing up:{' '}
        <span className="result-note-emphasis">{secondResult.shortLabel}</span>. Your answers were a
        little mixed, which is completely normal.
      </>
    )
  }

  if (showAlsoShowingUp && secondResult) {
    return (
      <>
        Also showing up:{' '}
        <span className="result-note-emphasis">{secondResult.shortLabel}</span>
      </>
    )
  }

  if (isMixed) {
    return (
      <>
        Your answers were a little mixed, which is completely normal. We&apos;ve shown the result
        that came through strongest today.
      </>
    )
  }

  return null
}

export default function ResultScreen() {
  const { quizId, resultId } = useParams()
  const location = useLocation()
  const quiz = getQuiz(quizId)
  const result = quiz?.results?.[String(resultId).toUpperCase()]

  const scoreState = location.state
  const isMixed = scoreState?.isMixed ?? false
  const showAlsoShowingUp = scoreState?.showAlsoShowingUp ?? false
  const secondResult =
    showAlsoShowingUp && scoreState?.secondResultId
      ? quiz?.results?.[scoreState.secondResultId]
      : null

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [resultId])

  if (!quiz) return <Navigate to="/" replace />
  if (!result) return <Navigate to={`/quiz/${quiz.id}`} replace />

  const shareText = buildShareText(result.title, site.shortUrl)
  const note = (
    <ResultNote
      showAlsoShowingUp={showAlsoShowingUp}
      secondResult={secondResult}
      isMixed={isMixed}
    />
  )

  return (
    <Layout>
      <div className="animate-floatUp">
        <section className="result-share-card" id="result-card">
          <div className="result-art-wrap">
            <Illustration name={result.art} size="result" priority />
          </div>

          <h1 className="result-title">{result.title}</h1>
          <p className="result-label-pill">{result.shortLabel}</p>

          {note && <p className="result-note">{note}</p>}

          <div className="result-body">
            {result.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="result-sections">
            <div className="result-section-card">
              <p className="result-section-heading">Tiny next step</p>
              <p className="result-section-body">{result.step}</p>
            </div>
            <div className="result-section-card">
              <p className="result-section-heading">In the app</p>
              <p className="result-section-body">{result.appSuggestion}</p>
            </div>
          </div>

          <p className="result-watermark">Dear Friend Check-Ins · quiz.mach.global</p>
        </section>

        <div className="result-cta-area">
          <CTAButtons
            quizId={quiz.id}
            shareTitle="Dear Friend Check-In"
            shareText={shareText}
            shareUrl={site.url}
          />
        </div>

        <Disclaimer className="mt-5" />
      </div>
    </Layout>
  )
}
