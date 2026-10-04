export default function Hero({ onExploreClick }) {
  return (
    <section className="hero" aria-label="Welcome banner">
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__content">
        <p className="hero__eyebrow">Kiro University 2026</p>
        <h1 className="hero__title">
          Flavours of<br />
          <em>Tamil Nadu</em>
        </h1>
        <p className="hero__subtitle">
          From Madurai's fiery Chettinad curries to Chennai's golden dosas — explore the
          rich, ancient culinary tapestry of Tamil Nadu, one dish at a time.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary hero__cta" onClick={onExploreClick}>
            Explore Foods
            <span className="btn__arrow" aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="hero__stats" aria-label="Collection statistics">
          <div className="hero__stat">
            <span className="hero__stat-number">12</span>
            <span className="hero__stat-label">Dishes</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">5</span>
            <span className="hero__stat-label">Regions</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">4</span>
            <span className="hero__stat-label">Categories</span>
          </div>
        </div>
      </div>
      <div className="hero__decorative" aria-hidden="true">
        <div className="hero__kolam" />
      </div>
    </section>
  )
}
