import { ALLOWED_FILTERS } from '../utils/filterFoods.js'

const FILTER_LABELS = {
  'All': { label: 'All', icon: '🍽️' },
  'Vegetarian': { label: 'Vegetarian', icon: '🌿' },
  'Non-Vegetarian': { label: 'Non-Veg', icon: '🍗' },
  'Breakfast': { label: 'Breakfast', icon: '🌅' },
  'Main Course': { label: 'Main Course', icon: '🥘' },
  'Snack': { label: 'Snack', icon: '🫙' },
  'Dessert/Drink': { label: 'Dessert / Drink', icon: '🍮' },
}

export default function FilterBar({ activeFilter, onChange }) {
  return (
    <div
      className="filter-bar"
      role="group"
      aria-label="Filter dishes by category or dietary preference"
    >
      {ALLOWED_FILTERS.map(filter => {
        const { label, icon } = FILTER_LABELS[filter]
        const isActive = filter === activeFilter
        return (
          <button
            key={filter}
            className={`filter-bar__btn${isActive ? ' is-active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(filter)}
            type="button"
          >
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
