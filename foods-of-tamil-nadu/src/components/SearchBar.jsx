export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="food-search" className="search-bar__label">
        Search dishes
      </label>
      <div className="search-bar__wrapper">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="food-search"
          type="search"
          className="search-bar__input"
          placeholder="Search for a dish…"
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
          aria-label="Search Tamil Nadu dishes by name"
        />
        {value && (
          <button
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
