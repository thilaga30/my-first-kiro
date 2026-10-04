import SearchBar from './SearchBar.jsx'
import FilterBar from './FilterBar.jsx'
import FoodGrid from './FoodGrid.jsx'

export default function DiscoverySection({
  dishes,
  searchText,
  onSearchChange,
  activeFilter,
  onFilterChange,
  favourites,
  onToggleFavourite,
  onCardClick,
}) {
  return (
    <section id="discover" className="discovery" aria-labelledby="discovery-heading">
      <div className="discovery__inner">
        <header className="discovery__header">
          <h2 id="discovery-heading" className="discovery__title">Discover Tamil Nadu</h2>
          <p className="discovery__subtitle">
            Explore {dishes.length > 0 ? dishes.length : 'our collection of'} traditional dishes from across the state
          </p>
        </header>

        <div className="discovery__controls">
          <SearchBar value={searchText} onChange={onSearchChange} />
          <FilterBar activeFilter={activeFilter} onChange={onFilterChange} />
        </div>

        <FoodGrid
          dishes={dishes}
          favourites={favourites}
          onToggleFavourite={onToggleFavourite}
          onCardClick={onCardClick}
        />
      </div>
    </section>
  )
}
