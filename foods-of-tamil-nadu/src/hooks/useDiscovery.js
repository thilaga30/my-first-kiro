import { useState } from 'react'
import { FOODS } from '../data/foods.js'
import { applyDiscovery } from '../utils/filterFoods.js'

/**
 * Manages search text and active filter, derives visible dishes.
 */
export function useDiscovery() {
  const [searchText, setSearchText] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const visibleDishes = applyDiscovery(FOODS, searchText, activeFilter)

  return { searchText, setSearchText, activeFilter, setActiveFilter, visibleDishes }
}
