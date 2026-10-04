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
