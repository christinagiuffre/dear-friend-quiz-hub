import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Disclaimer from '../components/Disclaimer'
import { IntroIllustration } from '../components/Characters'
import { getCheckin } from '../data/quizzes'
import { site } from '../data/site'

export default function QuizIntro() {
  const { quizId } = useParams()
  const checkin = getCheckin(quizId)

  if (!checkin) return <Navigate to="/" replace />

  const playPath =
    checkin.type === 'wizard' ? `/quiz/${checkin.id}/reflect` : `/quiz/${checkin.id}/play`

  return (
    <Layout>
      <div className={`animate-floatUp ${checkin.playful ? 'boredom-play' : ''}`}>
        <section className={`app-card text-center ${checkin.playful ? 'boredom-card' : ''}`}>
          <IntroIllustration name={checkin.art || 'duo'} priority />

          <h1 className="heading-lg mt-4">{checkin.title}</h1>
          <p className="mt-2 text-[15px] font-semibold text-purple" style={{ lineHeight: 1.45 }}>
            {checkin.subtitle}
          </p>
          <p className="muted-text mx-auto mt-3 max-w-[300px]">
            {checkin.supporting || checkin.description}
          </p>
          <p className="hub-hook mx-auto mt-3">{checkin.meta}</p>

          {checkin.trustPoints && (
            <ul className="mx-auto mt-4 max-w-[280px] space-y-2 text-left">
              {checkin.trustPoints.map((point) => (
                <li key={point} className="trust-item">
                  <CheckIcon />
                  <span className="text-[13px] text-ink/85" style={{ lineHeight: 1.45 }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Link to={playPath} className="btn-primary mt-5">
            {checkin.startLabel}
          </Link>
        </section>

        <Disclaimer className="mt-5" />

        <p className="mt-4 text-center">
          <Link to="/" className="btn-text">
            Back to quiz hub
          </Link>
        </p>
      </div>
    </Layout>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-purple"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}
