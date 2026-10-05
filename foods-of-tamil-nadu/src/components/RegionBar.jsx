const REGION_ICONS = {
  'Statewide':   '🗺️',
  'Chettinad':   '🏰',
  'Madurai':     '🕌',
  'Kongu Nadu':  '⛰️',
  'Chennai':     '🌊',
}

function getIcon(region) {
  return REGION_ICONS[region] || '📍'
}

export default function RegionBar({ regions, activeRegion, onChange }) {
  return (
    <section className="region-bar" aria-labelledby="region-heading">
      <h3 id="region-heading" className="region-bar__heading">
        Explore by Region
      </h3>
      <div
        className="region-bar__buttons"
        role="group"
        aria-label="Filter dishes by Tamil Nadu region"
      >
        <button
          className={`region-bar__btn${activeRegion === 'All' ? ' is-active' : ''}`}
          aria-pressed={activeRegion === 'All'}
          onClick={() => onChange('All')}
          type="button"
        >
          <span aria-hidden="true">🍽️</span>
          <span>All Regions</span>
        </button>

        {regions.map(region => (
          <button
            key={region}
            className={`region-bar__btn${activeRegion === region ? ' is-active' : ''}`}
            aria-pressed={activeRegion === region}
            onClick={() => onChange(region)}
            type="button"
          >
            <span aria-hidden="true">{getIcon(region)}</span>
            <span>{region}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
