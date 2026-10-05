import { useState, useRef } from 'react'
import { useFavourites } from './hooks/useFavourites.js'
import { useDiscovery } from './hooks/useDiscovery.js'
import { pickRandom } from './utils/filterFoods.js'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import DiscoverySection from './components/DiscoverySection.jsx'
import FoodDetailModal from './components/FoodDetailModal.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { favourites, toggleFavourite, count: favouriteCount } = useFavourites()
  const {
    searchText, setSearchText,
    activeFilter, setActiveFilter,
    activeRegion, setActiveRegion,
    visibleDishes, regions,
  } = useDiscovery()
  const [selectedDish, setSelectedDish] = useState(null)
  const discoverRef = useRef(null)

  function handleExploreClick() {
    discoverRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleCardClick(dish) {
    setSelectedDish(dish)
  }

  function handleModalClose() {
    setSelectedDish(null)
  }

  function handleSurpriseMe() {
    const dish = pickRandom(visibleDishes)
    if (dish) setSelectedDish(dish)
  }

  return (
    <>
      <Navbar favouriteCount={favouriteCount} />

      <main id="main-content">
        <Hero onExploreClick={handleExploreClick} />

        <div ref={discoverRef}>
          <DiscoverySection
            dishes={visibleDishes}
            searchText={searchText}
            onSearchChange={setSearchText}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            activeRegion={activeRegion}
            onRegionChange={setActiveRegion}
            regions={regions}
            onSurpriseMe={handleSurpriseMe}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
            onCardClick={handleCardClick}
          />
        </div>
      </main>

      <Footer />

      <FoodDetailModal
        dish={selectedDish}
        isFavourite={selectedDish ? favourites.has(selectedDish.id) : false}
        onToggleFavourite={() => selectedDish && toggleFavourite(selectedDish.id)}
        onClose={handleModalClose}
      />
    </>
  )
}
