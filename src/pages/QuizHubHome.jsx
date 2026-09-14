import Layout from '../components/Layout'
import CategorySection from '../components/hub/CategorySection'
import Disclaimer from '../components/Disclaimer'
import { checkins } from '../data/quizzes'
import { hubCategories } from '../data/hub'
import { site } from '../data/site'

export default function QuizHubHome() {
  const byCategory = (categoryId) => checkins.filter((c) => c.category === categoryId)

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

        {hubCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            checkins={byCategory(category.id)}
          />
        ))}

        <Disclaimer className="mt-5" />
      </div>
    </Layout>
  )
}
