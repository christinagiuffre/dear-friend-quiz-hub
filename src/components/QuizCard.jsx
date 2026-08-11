import { Link } from 'react-router-dom'
import { HubIllustration } from './Characters'

export default function QuizCard({ quiz }) {
  return (
    <article className="feature-card">
      <div className="feature-card-inner">
        <div className="feature-card-art">
          <HubIllustration name="connection" priority />
        </div>

        <span className="live-badge">Live now</span>

        <Link to={`/quiz/${quiz.id}`} className="group mt-3 block">
          <h2 className="heading-lg transition group-hover:text-purple">{quiz.title}</h2>
          <p className="mt-1.5 text-[15px] font-semibold text-purple" style={{ lineHeight: 1.45 }}>
            {quiz.subtitle}
          </p>
        </Link>

        <p className="meta-line mt-2">{quiz.meta}</p>

        <Link to={`/quiz/${quiz.id}`} className="btn-primary mt-4">
          {quiz.startLabel}
        </Link>
      </div>
    </article>
  )
}

export function ComingSoonCard({ title }) {
  return (
    <li className="soon-row">
      <span className="soon-title">{title}</span>
      <span className="soon-pill">Soon</span>
    </li>
  )
}
