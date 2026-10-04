import FoodCard from './FoodCard.jsx'
import EmptyState from './EmptyState.jsx'

export default function FoodGrid({ dishes, favourites, onToggleFavourite, onCardClick }) {
  if (dishes.length === 0) return <EmptyState />

  return (
    <div className="food-grid" aria-label="Tamil Nadu dishes">
      {dishes.map(dish => (
        <FoodCard
          key={dish.id}
          dish={dish}
          isFavourite={favourites.has(dish.id)}
          onToggleFavourite={() => onToggleFavourite(dish.id)}
          onClick={() => onCardClick(dish)}
        />
      ))}
    </div>
  )
}
