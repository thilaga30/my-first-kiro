import { useState } from 'react'
import { FOODS } from '../data/foods.js'
import { applyAllFilters, getRegions } from '../utils/filterFoods.js'

/**
 * Manages search text, active filter, and active region.
 * Derives visible dishes from the full composition of all three.
 */
export function useDiscovery() {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeRegion, setActiveRegion] = useState('All')

  const visibleDishes = applyAllFilters(FOODS, searchText, activeFilter, activeRegion)
  const regions = getRegions(FOODS)

  return {
    searchText, setSearchText,
    activeFilter, setActiveFilter,
    activeRegion, setActiveRegion,
    visibleDishes,
    regions,
  }
}
