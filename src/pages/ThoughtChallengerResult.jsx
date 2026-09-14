import { useEffect } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Disclaimer from '../components/Disclaimer'
import ResultLayout from '../components/checkin/ResultLayout'
import { getCheckin } from '../data/quizzes'
import { formatBeliefShift } from '../data/checkins/thought-challenger.js'

export default function ThoughtChallengerResult() {
  const { quizId } = useParams()
  const location = useLocation()
  const checkin = getCheckin(quizId)
  const data = location.state

  useEffect(() => {
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0 })
  }, [])

  if (!checkin || checkin.type !== 'wizard') return <Navigate to="/" replace />
  if (!data?.thought?.trim()) return <Navigate to={`/quiz/${checkin.id}`} replace />

  const patterns = (data.patterns || []).filter((p) => p.id !== 'NO_PATTERN')
  const beliefShift = formatBeliefShift(data.beliefBefore, data.beliefAfter, {
    beforeRated: data.beliefBeforeRated,
    afterRated: data.beliefAfterRated,
  })

  const nextAction =
    data.beliefAfterRated &&
    typeof data.beliefAfter === 'number' &&
    typeof data.beliefBefore === 'number' &&
    data.beliefAfter < data.beliefBefore
      ? 'When the original thought returns, gently try your fairer thought.'
      : 'Keep your fairer thought visible for the rest of today.'

  const patternBody =
    patterns.length > 0
      ? patterns
          .map((p) => `${p.label}. ${p.description}`)
          .join(' ')
      : 'No obvious thinking pattern was identified. The thought may still be painful, and you can choose what response would serve you best.'

  const sections = [
    { heading: 'Possible thinking pattern', body: patternBody },
    { heading: 'Original thought', body: `“${data.thought}”` },
    { heading: 'Fairer thought', body: `“${data.balancedThought}”` },
  ]

  if (beliefShift) {
    sections.push({ heading: 'Belief shift', body: beliefShift })
  }

  if (data.checkResponse?.trim() && data.selectedPrompt && data.selectedPrompt !== 'skip') {
    sections.splice(1, 0, {
      heading: 'Your reflection',
      body: data.checkResponse.trim(),
    })
  }

  return (
    <Layout>
      <div className="animate-floatUp">
        <ResultLayout
          title="Your thought check-in"
          subtitle="Private — only on this device"
          art="gentleness"
          summary="Here’s a balanced look at the thought you shared."
          immediateAction={nextAction}
          sections={sections}
          quizId={checkin.id}
          showShare={false}
        />

        <p className="note-box mt-4 text-center text-[12px]">
          Written thoughts stay in this browser session only.
        </p>

        <Disclaimer className="mt-5" />
      </div>
    </Layout>
  )
}
