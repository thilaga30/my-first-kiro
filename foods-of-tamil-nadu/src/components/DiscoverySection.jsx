import SearchBar from './SearchBar.jsx'
import FilterBar from './FilterBar.jsx'
import RegionBar from './RegionBar.jsx'
import SurpriseMe from './SurpriseMe.jsx'
import FoodGrid from './FoodGrid.jsx'

export default function DiscoverySection({
  dishes,
  searchText,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeRegion,
  onRegionChange,
  regions,
  onSurpriseMe,
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
            {dishes.length > 0
              ? `${dishes.length} dish${dishes.length === 1 ? '' : 'es'} found`
              : 'No dishes match your selection'}
          </p>
        </header>

        <RegionBar
          regions={regions}
          activeRegion={activeRegion}
          onChange={onRegionChange}
        />

        <div className="discovery__controls">
          <SearchBar value={searchText} onChange={onSearchChange} />
          <div className="discovery__controls-row">
            <FilterBar activeFilter={activeFilter} onChange={onFilterChange} />
            <SurpriseMe onClick={onSurpriseMe} disabled={dishes.length === 0} />
          </div>
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
