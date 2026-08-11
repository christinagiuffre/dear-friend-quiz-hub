import AppBackground from './AppBackground'
import { site } from '../data/site'

export default function Layout({ children, hideFooter = false }) {
  return (
    <div className="app-viewport">
      <AppBackground />
      <div className="app-frame">
        <div className="app-shell flex min-h-dvh flex-col">
          <header className="app-header">
            <a
              href={site.links.app}
              target="_blank"
              rel="noopener noreferrer"
              className="app-header-cta"
            >
              Get the app
            </a>
          </header>

          <main className="flex-1">{children}</main>

          {!hideFooter && (
            <footer className="app-footer">
              <div className="footer-links">
                <a className="footer-link" href={site.links.app} target="_blank" rel="noopener noreferrer">
                  App
                </a>
                <span className="footer-dot" aria-hidden="true">·</span>
                <a className="footer-link" href={site.links.books} target="_blank" rel="noopener noreferrer">
                  Books
                </a>
                <span className="footer-dot" aria-hidden="true">·</span>
                <a className="footer-link" href={site.links.signup} target="_blank" rel="noopener noreferrer">
                  Updates
                </a>
              </div>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-muted/70">
                We don’t store your answers. Results are for self-reflection only.
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
