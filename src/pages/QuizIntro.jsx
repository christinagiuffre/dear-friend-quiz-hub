import { Link, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Disclaimer from '../components/Disclaimer'
import { IntroIllustration } from '../components/Characters'
import { getQuiz } from '../data/quizzes'
import { site } from '../data/site'

export default function QuizIntro() {
  const { quizId } = useParams()
  const quiz = getQuiz(quizId)

  if (!quiz) return <Navigate to="/" replace />

  return (
    <Layout>
      <div className="animate-floatUp">
        <section className="app-card text-center">
          <IntroIllustration name="duo" priority />

          <h1 className="heading-lg mt-4">{quiz.title}</h1>
          <p className="mt-2 text-[15px] font-semibold text-purple" style={{ lineHeight: 1.45 }}>
            {quiz.subtitle}
          </p>
          <p className="hub-hook mx-auto mt-3">{site.hubHook}</p>
          <p className="muted-text mx-auto mt-3 max-w-[280px]">{quiz.supporting}</p>

          <ul className="mx-auto mt-4 max-w-[280px] space-y-2 text-left">
            {quiz.trustPoints.map((point) => (
              <li key={point} className="trust-item">
                <CheckIcon />
                <span className="text-[13px] text-ink/85" style={{ lineHeight: 1.45 }}>{point}</span>
              </li>
            ))}
          </ul>

          <Link to={`/quiz/${quiz.id}/play`} className="btn-primary mt-5">
            {quiz.startLabel}
          </Link>
        </section>

        <Disclaimer className="mt-5" />

        <p className="mt-4 text-center">
          <Link to="/" className="btn-text">Back to quiz hub</Link>
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
