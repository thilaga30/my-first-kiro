/**
 * Pure search/filter functions — never mutate input.
 */

/**
 * Filter dishes by name containing searchText (case-insensitive).
 * Empty/whitespace-only searchText returns all dishes.
 * @param {readonly object[]} dishes
 * @param {string} searchText
 * @returns {object[]}
 */
export function searchFoods(dishes, searchText) {
  const term = searchText.trim().toLowerCase()
  if (!term) return [...dishes]
  return dishes.filter(d => d.name.toLowerCase().includes(term))
}

/**
 * Filter dishes by dietary type or category.
 * @param {readonly object[]} dishes
 * @param {string} filter - 'All' | 'Vegetarian' | 'Non-Vegetarian' | category string
 * @returns {object[]}
 */
export function filterFoods(dishes, filter) {
  switch (filter) {
    case 'All':
      return [...dishes]
    case 'Vegetarian':
      return dishes.filter(d => d.isVegetarian === true)
    case 'Non-Vegetarian':
      return dishes.filter(d => d.isVegetarian === false)
    default:
      return dishes.filter(d => d.category === filter)
  }
}

/**
 * Apply search then filter — returns the intersection.
 * @param {readonly object[]} dishes
 * @param {string} searchText
 * @param {string} filter
 * @returns {object[]}
 */
export function applyDiscovery(dishes, searchText, filter) {
  return filterFoods(searchFoods(dishes, searchText), filter)
}

export const ALLOWED_FILTERS = [
  'All',
  'Vegetarian',
  'Non-Vegetarian',
  'Breakfast',
  'Main Course',
  'Snack',
  'Dessert/Drink',
]

/**
 * Filter dishes by region. 'All' returns all dishes.
 * @param {readonly object[]} dishes
 * @param {string} region
 * @returns {object[]}
 */
export function filterByRegion(dishes, region) {
  if (!region || region === 'All') return [...dishes]
  return dishes.filter(d => d.region === region)
}

/**
 * Derive the unique sorted list of regions from the dataset.
 * @param {readonly object[]} dishes
 * @returns {string[]}
 */
export function getRegions(dishes) {
  const regions = [...new Set(dishes.map(d => d.region))].sort()
  return regions
}

/**
 * Apply region, then search, then category filter — full three-way composition.
 * @param {readonly object[]} dishes
 * @param {string} searchText
 * @param {string} filter
 * @param {string} region
 * @returns {object[]}
 */
export function applyAllFilters(dishes, searchText, filter, region) {
  return filterFoods(searchFoods(filterByRegion(dishes, region), searchText), filter)
}

/**
 * Pick one random dish from the given array. Returns null if empty.
 * @param {object[]} dishes
 * @returns {object|null}
 */
export function pickRandom(dishes) {
  if (!dishes || dishes.length === 0) return null
  return dishes[Math.floor(Math.random() * dishes.length)]
}
