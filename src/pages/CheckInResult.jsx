import { useEffect } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Disclaimer from '../components/Disclaimer'
import ResultLayout from '../components/checkin/ResultLayout'
import { getCheckin } from '../data/quizzes'
import { site } from '../data/site'
import { buildShareText } from '../lib/share'
import { validateQuizSession } from '../lib/validateQuizSession'

function buildAngerPhrase(result, tailoring) {
  const need = tailoring?.phraseNeed || 'a moment to figure this out'
  if (result.couldSay) return result.couldSay.replace('___', need)
  return `“When ___ happened, I felt angry. What I need now is ${need}.”`
}

function buildSecondaryNote(result, secondId) {
  if (!secondId || !result.secondaryNote) return null
  return result.secondaryNote[secondId] || null
}

export default function CheckInResult() {
  const { quizId, resultId } = useParams()
  const location = useLocation()
  const checkin = getCheckin(quizId)
  const result = checkin?.results?.[String(resultId).toUpperCase()]
  const scoreState = location.state
  const answersByQuestionId = scoreState?.answersByQuestionId

  useEffect(() => {
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0 })
  }, [resultId])

  if (!checkin) return <Navigate to="/" replace />
  if (!result) return <Navigate to={`/quiz/${checkin.id}`} replace />

  if (answersByQuestionId) {
    const validation = validateQuizSession({ quizId: checkin.id, answersByQuestionId })
    if (!validation.valid) {
      return <Navigate to={`/quiz/${checkin.id}/play`} replace state={{ validationError: validation.message }} />
    }
  }

  const secondResult =
    scoreState?.showAlsoShowingUp && scoreState?.secondResultId
      ? checkin.results[scoreState.secondResultId]
      : null

  if (checkin.type === 'simple') {
    const shareText = buildShareText(result.title, site.shortUrl)
    const mixedNote =
      scoreState?.showAlsoShowingUp && secondResult
        ? `Also showing up: ${secondResult.shortLabel}.`
        : null

    return (
      <Layout>
        <div className="animate-floatUp">
          <ResultLayout
            title={result.title}
            subtitle={result.shortLabel}
            art={result.art}
            summary={result.body[0]}
            immediateAction={result.step}
            immediateLabel="Try this now"
            secondaryNote={mixedNote}
            sections={[
              ...(result.body[1]
                ? [{ heading: 'Why this might fit', body: result.body[1] }]
                : []),
              ...(result.appSuggestion
                ? [{ heading: 'More support in the Dear Friend app', body: result.appSuggestion }]
                : []),
            ]}
            quizId={checkin.id}
            shareTitle="Dear Friend Check-In"
            shareText={shareText}
            shareUrl={site.url}
          />
          <Disclaimer className="mt-5" />
        </div>
      </Layout>
    )
  }

  if (checkin.id === 'behind-my-anger') {
    const secondaryNote = buildSecondaryNote(result, scoreState?.secondResultId)

    return (
      <Layout>
        <div className="animate-floatUp">
          <ResultLayout
            title={result.title}
            subtitle={result.shortLabel}
            art={result.art}
            summary={result.summary}
            immediateAction={result.immediateAction}
            secondaryNote={secondaryNote}
            sections={[
              {
                heading: 'What may be underneath',
                body: `${result.underneath} ${result.signalling}`,
              },
              {
                heading: 'What may help now',
                body: `${result.beforeReacting} ${result.need}`,
              },
              {
                heading: 'Words you could use',
                body: buildAngerPhrase(result, scoreState?.tailoring),
              },
            ]}
            reminder={result.reminder}
            quizId={checkin.id}
            showShare={false}
          />
          <Disclaimer className="mt-5" />
        </div>
      </Layout>
    )
  }

  if (checkin.id === 'what-do-i-need') {
    const layered = scoreState?.layered
    const summary = layered
      ? [layered.startHere, layered.alsoNeed, layered.thenConsider].filter(Boolean).join(' ')
      : result.summary

    return (
      <Layout>
        <div className="animate-floatUp">
          <ResultLayout
            title={result.title}
            subtitle={result.shortLabel}
            art={result.art}
            summary={summary}
            immediateAction={result.nowDo || result.immediateAction}
            secondaryNote={
              secondResult
                ? `A possible secondary need: ${secondResult.shortLabel}.`
                : null
            }
            sections={[
              { heading: 'Something you could ask for', body: result.askFor },
              { heading: 'Something to consider later', body: result.considerLater },
            ]}
            reminder={result.affirmation}
            quizId={checkin.id}
            showShare={false}
          />
          <Disclaimer className="mt-5" />
        </div>
      </Layout>
    )
  }

  if (checkin.id === 'why-procrastinating') {
    const whyBody = secondResult
      ? `${result.summary} Also in the mix: ${secondResult.shortLabel.toLowerCase()}.`
      : result.summary

    return (
      <Layout>
        <div className="animate-floatUp">
          <ResultLayout
            title={result.title}
            subtitle={result.shortLabel}
            art={result.art}
            summary={result.summary}
            immediateAction={result.fiveMinuteStep || result.immediateAction}
            immediateLabel="Your five-minute starting step"
            secondaryNote={
              secondResult ? `Also in the mix: ${secondResult.shortLabel}.` : null
            }
            sections={[
              { heading: 'Why this may be happening', body: whyBody },
              { heading: 'Try this', body: result.strategy },
            ]}
            reminder={result.affirmation}
            quizId={checkin.id}
            showShare={false}
          />
          <Disclaimer className="mt-5" />
        </div>
      </Layout>
    )
  }

  return <Navigate to="/" replace />
}
