import Layout from '../components/Layout'
import QuizCard, { ComingSoonCard } from '../components/QuizCard'
import Disclaimer from '../components/Disclaimer'
import { quizzes, comingSoon } from '../data/quizzes'
import { site } from '../data/site'

export default function QuizHubHome() {
  const liveQuiz = quizzes[0]

  return (
    <Layout>
      <div className="animate-floatUp">
        <section className="hero-section">
          <h1 className="hero-title">
            Dear Friend
            <span className="hero-title-accent"> Check-Ins</span>
          </h1>
          <p className="hub-hook">{site.hubHook}</p>
          <p className="hub-intro">{site.hubIntro}</p>
        </section>

        {liveQuiz && <QuizCard quiz={liveQuiz} />}

        <section className="soon-section">
          <h2 className="soon-heading">More gentle check-ins coming soon</h2>
          <ul className="soon-list">
            {comingSoon.map((title) => (
              <ComingSoonCard key={title} title={title} />
            ))}
          </ul>
        </section>

        <Disclaimer className="mt-5" />
      </div>
    </Layout>
  )
}
