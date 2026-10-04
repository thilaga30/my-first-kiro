# Frontend Conventions

## React / Vite
- Functional components only, hooks for all state and side effects
- State lives in `App.jsx` and flows down as props
- Custom hooks: `useFavourites` (localStorage), `useDiscovery` (search + filter)
- Modal rendered via `ReactDOM.createPortal` to `document.body`
- `App` holds `selectedDish: Dish | null` for modal open/close

## Component Interfaces
| Component | Key Props |
|---|---|
| `Navbar` | `favouriteCount: number` |
| `Hero` | `onExploreClick: () => void` |
| `DiscoverySection` | `dishes`, `searchText`, `onSearchChange`, `activeFilter`, `onFilterChange`, `favourites`, `onToggleFavourite`, `onCardClick` |
| `FoodCard` | `dish`, `isFavourite`, `onToggleFavourite`, `onClick` |
| `FoodDetailModal` | `dish \| null`, `isFavourite`, `onToggleFavourite`, `onClose` |

## File Structure
```
src/
  data/foods.js
  hooks/useFavourites.js
  hooks/useDiscovery.js
  utils/filterFoods.js
  components/Navbar.jsx
  components/Hero.jsx
  components/DiscoverySection.jsx
  components/SearchBar.jsx
  components/FilterBar.jsx
  components/FoodGrid.jsx
  components/FoodCard.jsx
  components/FoodDetailModal.jsx
  components/EmptyState.jsx
  components/Footer.jsx
  App.jsx
  main.jsx
  index.css
```
