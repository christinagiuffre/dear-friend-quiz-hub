import { Link } from 'react-router-dom'
import ShareButton from './ShareButton'
import { site } from '../data/site'

export default function CTAButtons({ quizId, shareTitle, shareText, shareUrl }) {
  return (
    <div className="result-cta-group">
      <a
        href={site.links.app}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        {site.labels.app}
      </a>

      <a
        href={site.links.books}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary"
      >
        {site.labels.books}
      </a>

      <div className="result-cta-links">
        <ShareButton
          title={shareTitle}
          text={shareText}
          url={shareUrl}
          variant="text"
        />
        <Link to={`/quiz/${quizId}/play?fresh=1`} className="btn-text">
          Take again
        </Link>
        <Link to="/" className="btn-text">
          Back to quiz hub
        </Link>
      </div>
    </div>
  )
}
