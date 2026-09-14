import { Link } from 'react-router-dom'
import { HubIllustration } from '../Characters'

export default function ToolCard({ checkin }) {
  return (
    <article className="tool-card">
      <div className="tool-card-inner">
        <div className="tool-card-art">
          <HubIllustration name={checkin.art || 'duo'} />
        </div>

        <div className="tool-card-content">
          <h3 className="tool-card-title">{checkin.title}</h3>
          <p className="tool-card-desc">{checkin.description || checkin.subtitle}</p>
          <p className="tool-card-meta">{checkin.meta || checkin.duration}</p>
          <Link to={`/quiz/${checkin.id}`} className="btn-primary tool-card-btn">
            Start
          </Link>
        </div>
      </div>
    </article>
  )
}
