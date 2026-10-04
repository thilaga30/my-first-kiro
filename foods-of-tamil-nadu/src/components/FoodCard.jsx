const PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'

export default function FoodCard({ dish, isFavourite, onToggleFavourite, onClick }) {
  function handleImageError(e) {
    e.currentTarget.src = PLACEHOLDER
  }

  function handleFavouriteClick(e) {
    e.stopPropagation()
    onToggleFavourite()
  }

  return (
    <article
      className="food-card"
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${dish.name}`}
    >
      <div className="food-card__image-wrap">
        <img
          src={dish.image}
          alt={dish.name}
          className="food-card__image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="food-card__badges">
          <span
            className={`badge badge--diet ${dish.isVegetarian ? 'badge--veg' : 'badge--nonveg'}`}
            aria-label={dish.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}
          >
            <span aria-hidden="true">{dish.isVegetarian ? '🟢' : '🔴'}</span>
            {dish.isVegetarian ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
        <button
          className={`food-card__favourite${isFavourite ? ' is-active' : ''}`}
          onClick={handleFavouriteClick}
          aria-label={isFavourite ? `Remove ${dish.name} from favourites` : `Add ${dish.name} to favourites`}
          aria-pressed={isFavourite}
          type="button"
        >
          <span aria-hidden="true">{isFavourite ? '♥' : '♡'}</span>
        </button>
      </div>

      <div className="food-card__body">
        <div className="food-card__meta">
          <span className="badge badge--category">{dish.category}</span>
          <span className="food-card__region">
            <span aria-hidden="true">📍</span> {dish.region}
          </span>
        </div>
        <h2 className="food-card__name">{dish.name}</h2>
        <p className="food-card__desc">{dish.description}</p>
      </div>
    </article>
  )
}
