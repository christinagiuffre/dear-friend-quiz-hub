import ToolCard from './ToolCard'

export default function CategorySection({ category, checkins }) {
  if (!checkins.length) return null

  return (
    <section className="category-section" aria-labelledby={`category-${category.id}`}>
      <h2 id={`category-${category.id}`} className="category-title">
        {category.title}
      </h2>
      {category.description && <p className="category-desc">{category.description}</p>}
      <ul className="tool-card-list">
        {checkins.map((checkin) => (
          <li key={checkin.id}>
            <ToolCard checkin={checkin} />
          </li>
        ))}
      </ul>
    </section>
  )
}
