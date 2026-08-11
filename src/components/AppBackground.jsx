/** Soft pastel atmosphere — fixed behind all screens. */
export default function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      <div className="app-blob app-blob-1" />
      <div className="app-blob app-blob-2" />
      <div className="app-blob app-blob-3" />
      <div className="app-blob app-blob-4" />
      <svg className="app-deco app-deco-star" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.2 5.4L16 4l-1.8 5.2L20 10l-5.2 1.8L16 20l-4-2.8L8 20l1.8-5.2L4 10l5.2-1.8L8 4l3.8 3.4L12 2z" />
      </svg>
      <svg className="app-deco app-deco-heart" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-6.7-4.4-9.2-8.6C.4 12.1 1.6 8 5 6.4c2-.9 4.2-.4 5.7 1.2L12 8.5l1.3-1.3c1.5-1.6 3.7-2.1 5.7-1.2 3.4 1.6 4.6 5.7 2.2 8.6C18.7 16.6 12 21 12 21z" />
      </svg>
    </div>
  )
}
