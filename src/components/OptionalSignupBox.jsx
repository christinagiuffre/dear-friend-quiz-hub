import { site } from '../data/site'

export default function OptionalSignupBox() {
  return (
    <section className="rounded-card bg-mist p-5 sm:p-6">
      <p className="font-display text-base font-bold text-ink">{site.signup.heading}</p>
      <p className="muted-text mt-2">{site.signup.body}</p>
      <a
        href={site.links.signup}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost mt-4"
      >
        {site.labels.signup}
      </a>
      <p className="mt-3 text-center text-xs text-muted">Totally optional. Your result is already yours.</p>
    </section>
  )
}
