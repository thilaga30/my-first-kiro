# Implementation Plan: Foods of Tamil Nadu

## Overview

Incremental implementation of the Foods of Tamil Nadu React + Vite SPA. Each task builds on the previous, ending with full wiring and test coverage. The design document is the authoritative reference for all component interfaces, data shapes, and utility function signatures.

## Tasks

- [ ] 1. Scaffold project with Vite + React + Vitest
  - Run `npm create vite@latest` with the React + JavaScript template
  - Install `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, and `fast-check` as dev dependencies
  - Configure `vite.config.js` with the Vitest `test` block (`environment: "jsdom"`, `globals: true`)
  - Add `test` and `test:ui` scripts to `package.json`
  - Create the directory structure: `src/data/`, `src/hooks/`, `src/components/`, `src/utils/`
  - Delete Vite boilerplate files not needed (default `App.css` content, `assets/react.svg`, placeholder JSX in `App.jsx`)
  - _Requirements: NFR — Technology Stack_

- [ ] 2. Create the Food Dataset
  - [ ] 2.1 Implement `src/data/foods.js` with all 12 dishes
    - Define a `rawFoods` array containing all 12 dish objects: Pongal, Idli, Dosa, Parotta, Kothu Parotta, Chettinad Chicken, Sambar, Rasam, Paniyaram, Kuzhi Paniyaram, Kari Dosa, Jigarthanda
    - Each object must include all required fields: `id`, `name`, `image`, `description`, `region`, `category`, `isVegetarian`, `ingredients`, `culturalNote`
    - `isVegetarian` must be `false` for Chettinad Chicken and Kothu Parotta, `true` for all others
    - Export `FOODS` as `Object.freeze(rawFoods.map(dish => Object.freeze(dish)))`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.2 Write unit tests for Food Dataset structure
    - Verify `FOODS` contains exactly 12 dishes
    - Verify each dish has all required fields
    - Verify all `id` values are unique
    - Verify `isVegetarian` is a boolean for every dish
    - Verify `ingredients` is a non-empty array for every dish
    - Verify `category` is one of the four allowed values for every dish
    - Verify `isVegetarian` is `false` for Chettinad Chicken and Kothu Parotta
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 1.5_

  - [ ]* 2.3 Write property test for dish schema invariant
    - **Property 1: Dish Schema Invariant**
    - Iterate over `FOODS`; assert every dish satisfies all field-presence and type constraints
    - Tag comment: `// Feature: foods-of-tamil-nadu, Property 1: Dish Schema Invariant`
    - **Validates: Requirements 1.2, 13.2, 13.4, 13.5, 13.6**

- [ ] 3. Implement pure utility functions
  - [ ] 3.1 Implement `src/utils/filterFoods.js`
    - Write `searchFoods(dishes, searchText)` — returns all dishes when `searchText` trims to `""`; otherwise filters by case-insensitive name containment
    - Write `filterFoods(dishes, filter)` — applies the predicate table from the design document for `"All"`, `"Vegetarian"`, `"Non-Vegetarian"`, and each category string
    - Write `applyDiscovery(dishes, searchText, filter)` — composes both: `filterFoods(searchFoods(dishes, searchText), filter)`
    - None of the functions may mutate the input array or any dish object
    - _Requirements: 5.2, 5.3, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 3.2 Write unit tests for search logic
    - Verify empty string returns all 12 dishes
    - Verify a matching name returns only that dish
    - Verify case-insensitive match ("dosa", "DOSA", "DoSa")
    - Verify no-match string returns `[]`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ]* 3.3 Write property tests for search correctness
    - **Property 2: Search Result Correctness** — `fc.string()`: every result's `name` contains the search text (case-insensitive); result count ≤ total dishes
    - Tag comment: `// Feature: foods-of-tamil-nadu, Property 2: Search Result Correctness`
    - **Validates: Requirements 5.2, 14.5, 14.6**

  - [ ]* 3.4 Write unit tests for filter logic
    - Verify "All" returns all 12 dishes
    - Verify "Vegetarian" returns only `isVegetarian === true` dishes
    - Verify "Non-Vegetarian" returns only `isVegetarian === false` dishes
    - Verify each category filter returns the correct subset
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ]* 3.5 Write property tests for filter correctness and disjoint sets
    - **Property 3: Filter Result Correctness** — `fc.constantFrom(...allowedFilters)`: every result satisfies the filter predicate
    - **Property 4: Vegetarian / Non-Vegetarian Sets Are Disjoint** — verify intersection is always empty
    - Tag comments: `// Feature: foods-of-tamil-nadu, Property 3: Filter Result Correctness` and `// Feature: foods-of-tamil-nadu, Property 4: Vegetarian / Non-Vegetarian Sets Are Disjoint`
    - **Validates: Requirements 6.2, 6.4, 6.5, 6.6, 15.2, 15.3, 15.4, 15.5, 15.6**

  - [ ]* 3.6 Write unit and property tests for combined search + filter
    - Unit: verify combined search + filter returns the intersection
    - Unit: verify no-match combination returns `[]`
    - **Property 5: Combined Search + Filter Correctness** — `fc.tuple(fc.string(), fc.constantFrom(...allowedFilters))`: every result satisfies both predicates; combined result is a subset of search-only and filter-only results
    - Tag comment: `// Feature: foods-of-tamil-nadu, Property 5: Combined Search + Filter Correctness and Subset Invariants`
    - **Validates: Requirements 6.7, 16.1, 16.2, 16.3, 16.4, 16.5**

  - [ ]* 3.7 Write property test for dataset immutability
    - **Property 8: Dataset Immutability Under Operations** — snapshot `FOODS` fields before, apply `searchFoods` / `filterFoods` / `applyDiscovery`, deep-equal after
    - Tag comment: `// Feature: foods-of-tamil-nadu, Property 8: Dataset Immutability Under Operations`
    - **Validates: Requirements 1.3, 18.1, 18.2, 18.3, 18.4**

- [ ] 4. Checkpoint — ensure all dataset and utility tests pass
  - Run `npm test -- --run` and confirm all tests pass; resolve any failures before continuing.

- [ ] 5. Implement `useFavourites` hook
  - [ ] 5.1 Create `src/hooks/useFavourites.js`
    - Internal state: `Set<string>` of dish `id` values
    - On mount: read `localStorage.getItem("foods-tn-favourites")`, parse JSON, validate it is an array of strings, initialise the Set; catch all errors silently and fall back to empty Set
    - `toggleFavourite(id)`: add if absent, remove if present
    - On every state change: serialise Set to JSON array and call `localStorage.setItem`; wrap in try/catch for silent failure
    - Return `{ favourites, toggleFavourite, count }`
    - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 5.2 Write unit tests for favourites logic
    - Verify adding an id to empty list → singleton
    - Verify adding the same id twice → still singleton (idempotent)
    - Verify removing an existing id → removed
    - Verify removing a non-existent id → list unchanged
    - Verify malformed localStorage value → empty favourites, no throw
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 8.7_

  - [ ]* 5.3 Write property tests for favourites
    - **Property 6: Favourites Set Never Contains Duplicates** — `fc.array(fc.constantFrom(...ids))`: after any sequence of toggles, `Set.size <= distinct ids toggled in`
    - **Property 7: Favourites localStorage Round-Trip** — `fc.array(fc.constantFrom(...ids))`: serialise → deserialise → Set equality
    - Tag comments: `// Feature: foods-of-tamil-nadu, Property 6: Favourites Set Never Contains Duplicates` and `// Feature: foods-of-tamil-nadu, Property 7: Favourites localStorage Round-Trip`
    - **Validates: Requirements 17.2, 17.5, 8.5, 8.6, 17.6**

- [ ] 6. Implement `useDiscovery` hook
  - Create `src/hooks/useDiscovery.js`
  - Hold `searchText` (default `""`) and `activeFilter` (default `"All"`) state
  - Derive `visibleDishes` via `applyDiscovery(FOODS, searchText, activeFilter)` on every render
  - Return `{ searchText, setSearchText, activeFilter, setActiveFilter, visibleDishes }`
  - _Requirements: 5.1, 5.2, 5.3, 6.2, 6.7_

- [ ] 7. Implement Navbar component
  - Create `src/components/Navbar.jsx`
  - Props: `favouriteCount: number`
  - Display site title "Flavours of Tamil Nadu" as a brand link
  - Display a "Favourites" link showing the current `favouriteCount`
  - On desktop (≥ 768px): display links in a horizontal row
  - On mobile (< 768px): show hamburger icon; toggle a vertical dropdown on click
  - Add sticky positioning so it remains visible on scroll
  - Add `aria-label` to the hamburger button; add visible focus indicators to all interactive elements
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.1, 10.8_

- [ ] 8. Implement Hero component
  - Create `src/components/Hero.jsx`
  - Props: `onExploreClick: () => void`
  - Render heading "Flavours of Tamil Nadu", introductory paragraph, and "Explore Foods" CTA button
  - Wire `onExploreClick` to the button's `onClick`
  - Apply Tamil Nadu food-themed visual design
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 9. Implement SearchBar and FilterBar components
  - [ ] 9.1 Create `src/components/SearchBar.jsx`
    - Props: `value: string`, `onChange: (text: string) => void`
    - Render a labelled `<input type="text">` with placeholder text
    - Call `onChange` on every `input` event
    - Add visible focus indicator
    - _Requirements: 5.1, 5.5, 5.6, 10.4, 10.5_

  - [ ] 9.2 Create `src/components/FilterBar.jsx`
    - Props: `activeFilter: string`, `onChange: (filter: string) => void`
    - Render filter buttons for: All, Vegetarian, Non-Vegetarian, Breakfast, Main Course, Snack, Dessert/Drink
    - Visually highlight the active filter button
    - Wrap in `<div role="group" aria-label="Filter dishes">`
    - Add visible focus indicators; apply smooth CSS transitions on active state change
    - _Requirements: 6.1, 6.9, 6.10, 10.5, 10.9, 12.5_

- [ ] 10. Implement FoodCard component
  - Create `src/components/FoodCard.jsx`
  - Props: `dish: Dish`, `isFavourite: boolean`, `onToggleFavourite: () => void`, `onClick: () => void`
  - Display: dish name, image (`alt` = dish name), short description, region, category badge, vegetarian/non-vegetarian badge, favourite toggle button (heart icon)
  - `onClick` on the card opens the modal; `onToggleFavourite` on the heart button toggles favourite
  - Add `img onError` handler that swaps to a placeholder image
  - Apply hover state (shadow lift or scale) with 200ms–400ms CSS transition
  - Animate favourite toggle button on state change (pulse or scale)
  - Add `aria-label` to icon-only favourite button; add visible focus indicator
  - _Requirements: 4.6, 7.1, 8.1, 8.4, 10.2, 10.5, 10.8, 12.1, 12.2, 12.6_

- [ ] 11. Implement FoodGrid and EmptyState components
  - [ ] 11.1 Create `src/components/EmptyState.jsx`
    - No props; render a friendly message indicating no dishes match the current search/filter
    - _Requirements: 4.7, 5.4, 6.8_

  - [ ] 11.2 Create `src/components/FoodGrid.jsx`
    - Props: `dishes: Dish[]`, `favourites: Set<string>`, `onToggleFavourite`, `onCardClick`
    - Render a CSS Grid container with responsive column breakpoints (1 / 2 / 3 columns)
    - Map over `dishes` and render a `FoodCard` for each; render `EmptyState` when `dishes` is empty
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.7, 11.1, 11.2_

- [ ] 12. Implement FoodDetailModal component
  - Create `src/components/FoodDetailModal.jsx`
  - Props: `dish: Dish | null`, `isFavourite: boolean`, `onToggleFavourite: () => void`, `onClose: () => void`
  - Render nothing (return `null`) when `dish` is `null`
  - Render via `ReactDOM.createPortal(…, document.body)` when `dish` is non-null
  - Display: dish name, large image, full description, ingredients list, region, category, vegetarian/non-vegetarian badge, cultural note
  - Display a clearly labelled close button
  - Apply entrance animation (fade-in or scale-up) on open and exit animation on close
  - Close on: close button click, Escape keydown, backdrop click
  - On open: save `document.activeElement` ref, move focus to close button; on close: return focus to triggering element
  - Implement focus trap: intercept Tab / Shift+Tab to cycle among focusable children
  - ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`; close button `aria-label="Close"`
  - Ensure `max-height: 90vh; overflow-y: auto` for small viewports
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 10.7, 10.8, 11.5, 12.3, 12.4_

- [ ] 13. Implement Footer component
  - Create `src/components/Footer.jsx`
  - Display site name "Flavours of Tamil Nadu" and attribution line referencing Kiro University 2026
  - Apply Tamil Nadu-themed design consistent with the rest of the app
  - Use responsive layout that renders correctly at 320px, 768px, and 1280px
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 14. Wire everything together in App.jsx
  - Rewrite `src/App.jsx` as the single layout shell
  - Instantiate `useFavourites()` and `useDiscovery()`
  - Hold `selectedDish: Dish | null` state for modal open/close
  - Render in order: `<Navbar>`, `<Hero>`, `<DiscoverySection>` (or inline `<SearchBar>` + `<FilterBar>` + `<FoodGrid>`), `<Footer>`, `<FoodDetailModal>`
  - Wire `onExploreClick` to smooth-scroll to the discovery section ref
  - Pass all required props down to each component as specified in the design's component interfaces table
  - Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
  - _Requirements: 2.2, 3.4, 4.1, 8.8, 10.1, 12.7_

- [ ] 15. Apply CSS and responsive styling
  - Write global CSS in `src/index.css`: CSS custom properties for colour palette, typography, and spacing consistent with Tamil Nadu theme
  - Implement responsive Navbar layout: flex row ≥ 768px, hamburger + dropdown < 768px; sticky positioning
  - Implement Hero section styles: full-width banner, Tamil Nadu food imagery/decoratives, responsive at 320px / 768px / 1280px
  - Implement food grid responsive breakpoints (1 / 2 / 3 columns) and card hover transitions (200ms–400ms)
  - Implement FilterBar flex-wrap layout and active-button highlight with smooth transitions
  - Implement FoodDetailModal backdrop, content container, and entrance/exit animations
  - Implement favourite toggle animation (pulse or scale)
  - Ensure all touch targets have `min-width: 44px; min-height: 44px` on mobile viewports
  - Ensure no horizontal scroll at 320px, 768px, and 1280px
  - Verify colour contrast meets WCAG 2.1 Level AA (4.5:1 normal text, 3:1 large text)
  - Ensure all interactive elements have visible focus indicators
  - _Requirements: 2.3, 2.4, 2.7, 2.8, 3.5, 3.6, 4.3, 4.4, 4.5, 10.5, 10.6, 11.1, 11.2, 11.3, 11.4, 11.6, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 16. Final checkpoint — run tests and verify basics
  - Run `npm test -- --run` and confirm all unit and property tests pass
  - Verify the dev server starts without errors (`npm run dev`)
  - Manually confirm: modal opens/closes, focus trap works, hamburger toggles, favourites persist across page refresh, empty state shows on no-match search
  - Ensure all tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests must run a minimum of 100 iterations each
- Each property test must include the tag comment format specified in the design document
- The `useFavourites` hook is the only place that touches `localStorage` — no component accesses it directly
