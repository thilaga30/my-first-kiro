export default function EmptyState() {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">🍽️</div>
      <h3 className="empty-state__title">No dishes found</h3>
      <p className="empty-state__message">
        Try a different search term or select a different filter to discover more Tamil Nadu flavours.
      </p>
    </div>
  )
}
