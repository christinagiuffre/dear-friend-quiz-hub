import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Disclaimer from '../components/Disclaimer'
import { Illustration } from '../components/Characters'
import { getCheckin } from '../data/quizzes'
import {
  getBoredomRecommendations,
  buildBoredomSummary,
  buildBoredomProfile,
  formatActivityCost,
  isPaidActivity,
} from '../lib/boredom'
import { validateQuizSession } from '../lib/validateQuizSession'
import { site } from '../data/site'

function SuggestionCard({ activity, label, profile }) {
  if (!activity) return null
  return (
    <div className="result-section-card boredom-suggestion">
      <p className="result-section-heading">{label}</p>
      <p className="font-display text-[17px] font-bold text-ink">{activity.title}</p>
      <p className="result-section-body mt-2">{activity.description}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
        {formatActivityCost(activity, profile)}
      </p>
    </div>
  )
}

export default function BoredomResult() {
  const { quizId } = useParams()
  const location = useLocation()
  const checkin = getCheckin(quizId)

  const answersByQuestionId = location.state?.answersByQuestionId
  const validation = useMemo(() => {
    if (!answersByQuestionId || !checkin) return null
    return validateQuizSession({ quizId: checkin.id, answersByQuestionId })
  }, [answersByQuestionId, checkin])

  const profile = useMemo(() => {
    if (!answersByQuestionId) return null
    return buildBoredomProfile(answersByQuestionId)
  }, [answersByQuestionId])

  const [history, setHistory] = useState(() => location.state?.history || [])
  const [rejectCount, setRejectCount] = useState(0)

  const suggestions = useMemo(
    () => (profile ? getBoredomRecommendations(profile, history) : null),
    [profile, history]
  )

  useEffect(() => {
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0 })
  }, [])

  if (!checkin || checkin.type !== 'boredom') return <Navigate to="/" replace />

  if (!answersByQuestionId || !validation?.valid || !profile || !suggestions) {
    return <Navigate to={`/quiz/${checkin.id}/play`} replace />
  }

  const summary = buildBoredomSummary(profile)
  const picks = [suggestions.best, suggestions.easy, suggestions.wildcard].filter(Boolean)
  const paidCount = picks.filter(isPaidActivity).length
  const showDeeperMessage = rejectCount >= 3 || suggestions.exhausted
  const showPaidNote =
    profile.budget === 'higher-spend' &&
    (suggestions.needsLoosen || suggestions.paidShortfall || paidCount < 2)

  function tryAgain() {
    const currentIds = picks.map((p) => p.id)
    setHistory((prev) => [...prev, ...currentIds])
    setRejectCount((c) => c + 1)
  }

  return (
    <Layout>
      <div className="animate-floatUp boredom-play">
        <section className="result-share-card boredom-result">
          <div className="result-art-wrap">
            <Illustration name="spark" size="result" priority />
          </div>

          <h1 className="result-title">Here are some ideas</h1>
          <p className="result-note">{summary}</p>

          {showPaidNote && (
            <p className="note-box mt-4 text-left">
              {suggestions.paidInPool < 2
                ? 'I could not find enough paid ideas that fit every preference at home. Try “Out” on screen 2, or loosen one preference.'
                : 'These include paid experiences that match your budget preference.'}
            </p>
          )}

          {suggestions.needsLoosen && suggestions.passed?.length < 3 && (
            <p className="note-box mt-4 text-left">
              I found fewer exact matches. Would you like to loosen one preference? Try again for
              different options, or start over to adjust your answers.
            </p>
          )}

          {picks.length === 0 ? (
            <p className="note-box mt-4 text-left">
              I could not find activities that match every preference. Try again or start over to
              adjust your answers.
            </p>
          ) : (
            <div className="result-sections mt-4">
              <SuggestionCard activity={suggestions.best} label="Best match" profile={profile} />
              <SuggestionCard
                activity={suggestions.easy}
                label="Easy alternative"
                profile={profile}
              />
              <SuggestionCard activity={suggestions.wildcard} label="Wildcard" profile={profile} />
            </div>
          )}

          {showDeeperMessage && (
            <p className="note-box mt-4 text-left">
              I might not need entertainment. I may need rest, connection, stimulation or a change
              of environment.
            </p>
          )}

          <div className="mt-4 space-y-2">
            <button type="button" onClick={tryAgain} className="btn-secondary">
              Nope, try again
            </button>
            <Link to={`/quiz/${checkin.id}/play?fresh=1`} className="btn-soft">
              Start over
            </Link>
            <Link to="/" className="btn-text mx-auto block pt-2 text-center">
              Back to quiz hub
            </Link>
          </div>

          <p className="result-watermark">Dear Friend Check-Ins · {site.shortUrl}</p>
        </section>

        <Disclaimer className="mt-5" />
      </div>
    </Layout>
  )
}
