# Design Document: Foods of Tamil Nadu

## Overview

A single-page React + Vite application that lets visitors browse, search, filter, and favourite Tamil Nadu dishes from a static local dataset. No backend. All state lives in React (component state + context) and is optionally persisted in localStorage.

The UI is split into a fixed navigation bar, a hero banner, a food discovery section (search bar + filter bar + card grid), and a footer. A modal overlay sits outside the main flow and is rendered via a React portal.

---

## Architecture

```
Vite (dev server / build)
  └── index.html
        └── React root (#root)
              └── App.jsx  ← single layout shell + state orchestration
                    ├── useFavourites()  ← custom hook (localStorage)
                    ├── useDiscovery()   ← custom hook (search + filter state)
                    └── renders: Navbar, Hero, DiscoverySection, Footer, FoodDetailModal
```

State is managed at the `App` level and flows down as props. No Redux or Zustand — the feature scope does not justify a global store library. `useFavourites` encapsulates localStorage access so no other component touches `localStorage` directly.

---

## Components and Interfaces

### Directory Layout

```
src/
  data/
    foods.js            ← Food_Dataset (frozen array)
  hooks/
    useFavourites.js    ← add/remove/persist favourites
    useDiscovery.js     ← search + filter state derived from dataset
  components/
    Navbar.jsx
    Hero.jsx
    DiscoverySection.jsx
    SearchBar.jsx
    FilterBar.jsx
    FoodGrid.jsx
    FoodCard.jsx
    FoodDetailModal.jsx
    EmptyState.jsx
    Footer.jsx
  utils/
    filterFoods.js      ← pure search/filter functions
  App.jsx
  main.jsx
```

One component per file, PascalCase filenames, camelCase for utilities and data fields.

### Component Interfaces (props)

| Component | Key Props |
|---|---|
| `Navbar` | `favouriteCount: number` |
| `Hero` | `onExploreClick: () => void` |
| `DiscoverySection` | `dishes: Dish[]`, `searchText: string`, `onSearchChange`, `activeFilter: string`, `onFilterChange`, `favourites: Set<string>`, `onToggleFavourite`, `onCardClick` |
| `SearchBar` | `value: string`, `onChange: (text: string) => void` |
| `FilterBar` | `activeFilter: string`, `onChange: (filter: string) => void` |
| `FoodGrid` | `dishes: Dish[]`, `favourites: Set<string>`, `onToggleFavourite`, `onCardClick` |
| `FoodCard` | `dish: Dish`, `isFavourite: boolean`, `onToggleFavourite: () => void`, `onClick: () => void` |
| `FoodDetailModal` | `dish: Dish \| null`, `isFavourite: boolean`, `onToggleFavourite: () => void`, `onClose: () => void` |
| `EmptyState` | *(no props)* |
| `Footer` | *(no props)* |

---

## Data Models

### Dish Object

```js
{
  id:           string,   // unique, e.g. "pongal"
  name:         string,   // e.g. "Pongal"
  image:        string,   // relative path or URL, e.g. "/images/pongal.jpg"
  description:  string,   // short paragraph, shown on card
  region:       string,   // e.g. "Statewide"
  category:     "Breakfast" | "Main Course" | "Snack" | "Dessert/Drink",
  isVegetarian: boolean,
  ingredients:  string[], // non-empty
  culturalNote: string,   // paragraph shown only in modal
}
```

The dataset is exported as `Object.freeze`d objects inside a frozen array so any accidental mutation throws at runtime:

```js
// src/data/foods.js
export const FOODS = Object.freeze(
  rawFoods.map(dish => Object.freeze(dish))
);
```

`FOODS` has exactly 12 entries. `isVegetarian` is `false` for Chettinad Chicken and Kothu Parotta, `true` for all others.

---

## Search and Filter Logic

All filtering is implemented as **pure functions** in `src/utils/filterFoods.js`. Neither function mutates its input.

```
searchFoods(dishes, searchText)  →  Dish[]
filterFoods(dishes, filter)      →  Dish[]
applyDiscovery(dishes, searchText, filter) → Dish[]
```

### `searchFoods(dishes, searchText)`

- Returns all dishes when `searchText` trims to `""`.
- Otherwise returns dishes whose `name.toLowerCase()` contains `searchText.toLowerCase()`.

### `filterFoods(dishes, filter)`

Filter values and their predicates:

| Filter value | Predicate |
|---|---|
| `"All"` | always true |
| `"Vegetarian"` | `dish.isVegetarian === true` |
| `"Non-Vegetarian"` | `dish.isVegetarian === false` |
| `"Breakfast"` / `"Main Course"` / `"Snack"` / `"Dessert/Drink"` | `dish.category === filter` |

### `applyDiscovery(dishes, searchText, filter)`

Composes both:

```js
return filterFoods(searchFoods(dishes, searchText), filter);
```

Because `searchFoods` runs first, the filter-only and search-only sets each form strict supersets of the combined result — satisfying the subset invariants in Requirements 16.4 and 16.5.

### `useDiscovery` hook

Holds `searchText` and `activeFilter` state. Returns the derived `visibleDishes` array computed by `applyDiscovery(FOODS, searchText, activeFilter)` on every render (12 items — no memoisation needed).

---

## Favourites / localStorage Design

### `useFavourites` hook

```
useFavourites() → { favourites: Set<string>, toggleFavourite(id), count: number }
```

- Internal state: `Set<string>` of dish `id` values.
- localStorage key: `"foods-tn-favourites"` (stable, app-scoped).
- On mount: reads `localStorage.getItem("foods-tn-favourites")`, parses JSON, validates it is an array of strings, initialises the Set. Any error (unavailable storage, corrupt JSON, wrong type) is caught silently and the Set starts empty.
- On every state change: serialises the Set to a JSON array and calls `localStorage.setItem`. Wrapped in try/catch — failure is silent (e.g., private browsing quota exceeded).

### Add / Remove semantics

`toggleFavourite(id)`:
- If `id` is in the Set → remove it.
- If `id` is not in the Set → add it.
- The Set never contains duplicates by construction.

---

## Modal Design

### Open / Close State

`App` holds `selectedDish: Dish | null`. Passing a non-null dish opens the modal; `null` closes it. The modal is always rendered into the DOM via `ReactDOM.createPortal(…, document.body)` so it sits above all other content in the stacking context.

### Close Triggers

1. Close button click → `onClose()`
2. Escape keydown → `onClose()` (listener attached on modal mount, removed on unmount)
3. Backdrop click → `onClose()` (click on the overlay `div`, not the modal content `div`)

### Focus Trap

On open:
- Save a ref to `document.activeElement` (the triggering `FoodCard` button).
- Move focus to the modal's close button immediately.
- Attach a `keydown` listener on the modal container; intercept `Tab` and `Shift+Tab` to cycle focus among all focusable children (`button`, `a`, `input`, `[tabindex]`).

On close:
- Return focus to the saved `triggerRef`.

### ARIA

```html
<div role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title">
  <h2 id="modal-title">{dish.name}</h2>
  ...
  <button aria-label="Close">×</button>
</div>
```

---

## Responsive UI Strategy

Two breakpoints driven by CSS custom properties / media queries:

| Range | Layout |
|---|---|
| `< 768px` (mobile) | Single column grid, hamburger nav |
| `768px – 1279px` (tablet) | Two-column card grid, horizontal nav |
| `≥ 1280px` (desktop) | Three-column card grid, horizontal nav |

### CSS Grid for the food grid

```css
.food-grid {
  display: grid;
  grid-template-columns: 1fr;           /* mobile */
}
@media (min-width: 768px) {
  .food-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1280px) {
  .food-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### Flexbox for Navbar and FilterBar

- Navbar: `display: flex; justify-content: space-between; align-items: center;` — collapses to hamburger below 768px.
- FilterBar: `display: flex; flex-wrap: wrap; gap: 8px;` — buttons wrap naturally on small screens.

### Touch targets

All interactive elements get `min-width: 44px; min-height: 44px` on mobile viewports (≤ 767px).

### Modal responsiveness

Modal content container: `max-height: 90vh; overflow-y: auto` so content scrolls inside the modal on small screens.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Dish Schema Invariant

*For any* dish object in the Food_Dataset, every required field (`id`, `name`, `image`, `description`, `region`, `category`, `isVegetarian`, `ingredients`, `culturalNote`) must be present, `isVegetarian` must be a boolean, `ingredients` must be a non-empty array, and `category` must be one of `"Breakfast" | "Main Course" | "Snack" | "Dessert/Drink"`.

**Validates: Requirements 1.2, 13.2, 13.4, 13.5, 13.6**

---

### Property 2: Search Result Correctness

*For any* search string `s` and any result dish `d` returned by `searchFoods`, `d.name.toLowerCase()` contains `s.toLowerCase()`. Equivalently, no dish whose name does not contain `s` (case-insensitive) appears in the results.

**Validates: Requirements 5.2, 14.5, 14.6**

---

### Property 3: Filter Result Correctness

*For any* filter value `f` and any result dish `d` returned by `filterFoods(dishes, f)`, `d` satisfies the predicate for `f` — e.g. if `f` is `"Vegetarian"` then `d.isVegetarian === true`, if `f` is a category string then `d.category === f`.

**Validates: Requirements 6.2, 6.4, 6.5, 6.6, 15.2, 15.3, 15.4, 15.5**

---

### Property 4: Vegetarian / Non-Vegetarian Sets Are Disjoint

*For any* dish dataset, the set of results for filter `"Vegetarian"` and the set of results for filter `"Non-Vegetarian"` share no common dish.

**Validates: Requirements 15.6**

---

### Property 5: Combined Search + Filter Correctness and Subset Invariants

*For any* search string `s` and filter value `f`, every result of `applyDiscovery(dishes, s, f)` satisfies both the search predicate and the filter predicate simultaneously. Furthermore, the combined result set is always a subset of `searchFoods(dishes, s)` and also a subset of `filterFoods(dishes, f)`.

**Validates: Requirements 6.7, 16.3, 16.4, 16.5**

---

### Property 6: Favourites Set Never Contains Duplicates

*For any* sequence of `toggleFavourite` calls, the internal favourites Set never contains the same `id` more than once. Adding the same `id` twice is idempotent; the Set size never increases beyond the number of distinct ids that have been added and not removed.

**Validates: Requirements 17.2, 17.5**

---

### Property 7: Favourites localStorage Round-Trip

*For any* favourites Set state, serialising it to localStorage and then deserialising produces a Set that is equal to the original (same members, same count).

**Validates: Requirements 8.5, 8.6, 17.6**

---

### Property 8: Dataset Immutability Under Operations

*For any* search string and filter value, applying `searchFoods`, `filterFoods`, or `applyDiscovery` to `FOODS` does not modify any field of any dish object in `FOODS`. The original array length and all object references remain unchanged after any operation.

**Validates: Requirements 1.3, 18.1, 18.2, 18.3, 18.4**

---

## Error Handling

| Scenario | Handling |
|---|---|
| localStorage unavailable (private browsing, quota) | `useFavourites` wraps read/write in try/catch; silently initialises with empty Set |
| localStorage contains non-JSON data | `JSON.parse` error caught; initialises with empty Set |
| localStorage contains JSON that is not an array of strings | Validation check after parse; falls back to empty Set |
| Dish image fails to load | `<img onError>` swaps to a placeholder image URL |
| No dishes match search + filter | `EmptyState` component renders; not an error state |

No network requests are made, so network error handling is out of scope.

---

## Testing Strategy

### Tooling

- **Test runner**: Vitest
- **Property-based testing**: `fast-check` (npm package `fast-check`)
- **Component testing** (if needed): `@testing-library/react` + `jsdom`

### What Gets Unit Tested

Unit tests cover concrete, specific assertions:

- `FOODS` contains exactly 12 dishes (Requirement 13.1)
- All `id` values are unique (Requirement 13.3)
- `isVegetarian` is `false` for Chettinad Chicken and Kothu Parotta (Requirement 1.5)
- `searchFoods(FOODS, "")` returns all 12 dishes (Requirement 14.1)
- `searchFoods(FOODS, "Dosa")` returns exactly the Dosa dish (Requirement 14.2)
- `searchFoods(FOODS, "zzznomatch")` returns `[]` (Requirement 14.4)
- `filterFoods(FOODS, "All")` returns all 12 dishes (Requirement 15.1)
- Each category filter returns the correct known subset (Requirement 15.4)
- `applyDiscovery` with both active returns only the intersection (Requirement 16.1)
- `applyDiscovery` with no-match combination returns `[]` (Requirement 16.2)
- Adding an id to empty favourites → singleton (Requirement 17.1)
- Removing an id that exists → removed (Requirement 17.3)
- Removing an id that doesn't exist → list unchanged (Requirement 17.4)
- Malformed localStorage value → empty favourites, no throw (Requirement 8.7)

### What Gets Property Tested (fast-check)

Each property test runs a minimum of **100 iterations** and is tagged with a comment in this format:

`// Feature: foods-of-tamil-nadu, Property N: <property text>`

| Property | fast-check arbitraries |
|---|---|
| P1 — Dish Schema Invariant | Iterate over `FOODS` array; no random input needed — deterministic structural check over the static dataset |
| P2 — Search Result Correctness | `fc.string()` for search text; assert every result contains the text |
| P3 — Filter Result Correctness | `fc.constantFrom(...allowedFilters)` for filter; assert every result satisfies predicate |
| P4 — Disjoint Sets | Deterministic for static dataset; verify intersection is empty across random permutations of dataset |
| P5 — Combined Subset Invariants | `fc.tuple(fc.string(), fc.constantFrom(...allowedFilters))`; assert subset and dual-predicate satisfaction |
| P6 — Favourites No Duplicates | `fc.array(fc.constantFrom(...FOODS.map(d => d.id)))` for sequences of toggle operations; assert `Set.size <= distinct ids` |
| P7 — localStorage Round-Trip | `fc.array(fc.constantFrom(...ids))` for any Set of ids; serialise → deserialise → compare |
| P8 — Immutability | `fc.tuple(fc.string(), fc.constantFrom(...allowedFilters))`; snapshot FOODS before, apply ops, deep-equal after |

### Balance

Unit tests are kept lean — they cover specific known values and edge cases not naturally hit by property tests (exact dish counts, specific name matches, empty-string behaviour). Property tests cover the universal correctness guarantees across arbitrary inputs. Both are required; neither replaces the other.
