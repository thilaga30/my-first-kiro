# Requirements Document

## Introduction

"Foods of Tamil Nadu" is a food discovery web application built for Kiro University 2026. The application showcases the rich culinary heritage of Tamil Nadu through an interactive, visually polished interface. Users can browse, search, filter, and save their favourite traditional Tamil Nadu dishes. The application runs entirely in the browser using React + Vite + JavaScript with local mock data — no backend is required.

---

## Glossary

- **App**: The "Foods of Tamil Nadu" React + Vite single-page application.
- **Food_Card**: A visual card component displaying summary information for a single dish.
- **Food_Detail_Modal**: An overlay dialog presenting the full details of a selected dish.
- **Food_Dataset**: The static, local JavaScript data array containing all dish objects.
- **Filter_Bar**: The UI control strip that allows users to filter dishes by category or dietary type.
- **Search_Bar**: The text input component used to search dishes by name.
- **Favorites_Store**: The localStorage-backed persistence layer for user-saved favourite dishes.
- **Hero_Section**: The full-width introductory banner at the top of the page.
- **Navigation**: The top navigation bar supporting both desktop and mobile (hamburger) layouts.
- **Footer**: The bottom section of the page with Tamil Nadu themed content.
- **Vegetarian**: A dish containing no meat, poultry, or seafood.
- **Non_Vegetarian**: A dish containing meat, poultry, or seafood.
- **Category**: A meal-time or type classification — one of: Breakfast, Main Course, Snack, Dessert/Drink.
- **Region**: The geographic area within Tamil Nadu associated with a dish.
- **Cultural_Note**: A short contextual paragraph about the dish's history or significance in Tamil culture.
- **Empty_State**: A visual message shown when no results match the current search or filter selection.

---

## Requirements

### Requirement 1: Food Dataset

**User Story:** As a developer, I want a complete, well-structured local dataset of Tamil Nadu dishes, so that the application can run without a backend and all features work against consistent data.

#### Acceptance Criteria

1. THE Food_Dataset SHALL contain exactly the following twelve dishes: Pongal, Idli, Dosa, Parotta, Kothu Parotta, Chettinad Chicken, Sambar, Rasam, Paniyaram, Kuzhi Paniyaram, Kari Dosa, Jigarthanda.
2. THE Food_Dataset SHALL represent each dish as an object with the fields: `id` (unique string), `name` (string), `image` (string URL or path), `description` (string), `region` (string), `category` (one of: "Breakfast", "Main Course", "Snack", "Dessert/Drink"), `isVegetarian` (boolean), `ingredients` (array of strings), `culturalNote` (string).
3. THE Food_Dataset SHALL be immutable at runtime — no operation performed by the App SHALL modify the original Food_Dataset array or any of its objects.
4. FOR ALL dish objects in the Food_Dataset, the `id` field SHALL be unique across the entire dataset.
5. FOR ALL dish objects in the Food_Dataset, the `isVegetarian` field SHALL be `false` for Chettinad Chicken and Kothu Parotta (when made with meat) and `true` for all remaining dishes in the default dataset.

---

### Requirement 2: Application Shell and Navigation

**User Story:** As a visitor, I want a clear and responsive navigation bar, so that I can orient myself on the page and access key sections easily from any device.

#### Acceptance Criteria

1. THE Navigation SHALL display the site title "Flavours of Tamil Nadu" as a logo/brand link.
2. THE Navigation SHALL display a "Favourites" link showing the current count of saved favourite dishes.
3. WHEN the viewport width is 768px or greater, THE Navigation SHALL display navigation links in a horizontal row.
4. WHEN the viewport width is less than 768px, THE Navigation SHALL display a hamburger menu icon in place of the horizontal link row.
5. WHEN the user activates the hamburger menu icon, THE Navigation SHALL expand to show the navigation links in a vertical dropdown.
6. WHEN the user activates the hamburger menu icon while the menu is open, THE Navigation SHALL collapse the dropdown.
7. THE Navigation SHALL remain visible at the top of the page as the user scrolls.
8. WHEN focus moves to a Navigation link via keyboard, THE Navigation SHALL display a visible focus indicator on that link.

---

### Requirement 3: Hero Section

**User Story:** As a visitor, I want an attractive hero section when I first land on the page, so that I immediately understand the purpose of the site and feel invited to explore.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the heading "Flavours of Tamil Nadu".
2. THE Hero_Section SHALL display a short introductory paragraph describing the culinary heritage of Tamil Nadu.
3. THE Hero_Section SHALL display a call-to-action button labelled "Explore Foods".
4. WHEN the user activates the "Explore Foods" button, THE App SHALL smoothly scroll the viewport to the food discovery section.
5. THE Hero_Section SHALL use a visually polished design incorporating Tamil Nadu food-themed imagery or decorative elements.
6. THE Hero_Section SHALL be fully responsive and render correctly at viewport widths of 320px, 768px, and 1280px.

---

### Requirement 4: Food Discovery Section

**User Story:** As a visitor, I want to browse all Tamil Nadu dishes in a grid layout, so that I can quickly scan and discover foods that interest me.

#### Acceptance Criteria

1. THE App SHALL render the food discovery section below the Hero_Section on the main page.
2. THE App SHALL display all Food_Dataset dishes as Food_Cards in a responsive grid.
3. WHEN the viewport width is 1280px or greater, THE App SHALL display Food_Cards in a grid with at least three columns.
4. WHEN the viewport width is between 768px and 1279px, THE App SHALL display Food_Cards in a grid with two columns.
5. WHEN the viewport width is less than 768px, THE App SHALL display Food_Cards in a single-column layout.
6. THE Food_Card SHALL display the dish name, image, short description, region, category, vegetarian/non-vegetarian classification badge, and a favourite toggle button.
7. WHEN the Food_Dataset contains no dishes matching the active search and filter combination, THE App SHALL display an Empty_State message.

---

### Requirement 5: Search

**User Story:** As a visitor, I want to search for dishes by name, so that I can quickly find a specific food I am looking for.

#### Acceptance Criteria

1. THE Search_Bar SHALL accept text input and filter the displayed Food_Cards in real time as the user types.
2. WHEN the user types in the Search_Bar, THE App SHALL display only Food_Cards whose dish name contains the entered text (case-insensitive).
3. WHEN the Search_Bar is cleared, THE App SHALL display all Food_Cards that match the active filter selection.
4. IF no dishes match the search text, THEN THE App SHALL display the Empty_State message instead of Food_Cards.
5. THE Search_Bar SHALL have an accessible label and placeholder text.
6. WHEN the Search_Bar receives keyboard focus, THE App SHALL display a visible focus indicator on the Search_Bar.

---

### Requirement 6: Filtering

**User Story:** As a visitor, I want to filter dishes by dietary type and meal category, so that I can find foods that match my preferences.

#### Acceptance Criteria

1. THE Filter_Bar SHALL display the following filter options: All, Vegetarian, Non-Vegetarian, Breakfast, Main Course, Snack, Dessert/Drink.
2. WHEN the user selects a filter option, THE App SHALL display only Food_Cards whose dishes match the selected filter criterion.
3. WHEN the "All" filter is selected, THE App SHALL display all Food_Cards that match the active search text.
4. WHEN the "Vegetarian" filter is selected, THE App SHALL display only Food_Cards for dishes where `isVegetarian` is `true`.
5. WHEN the "Non-Vegetarian" filter is selected, THE App SHALL display only Food_Cards for dishes where `isVegetarian` is `false`.
6. WHEN a Category filter (Breakfast, Main Course, Snack, Dessert/Drink) is selected, THE App SHALL display only Food_Cards whose dish `category` matches the selected option.
7. WHEN both a search text and a filter option are active, THE App SHALL display only Food_Cards that satisfy both conditions simultaneously.
8. IF no dishes match the combined search and filter criteria, THEN THE App SHALL display the Empty_State message.
9. THE Filter_Bar SHALL visually indicate the currently active filter option.
10. WHEN a Filter_Bar button receives keyboard focus, THE App SHALL display a visible focus indicator on that button.

---

### Requirement 7: Food Detail Modal

**User Story:** As a visitor, I want to view full details of a dish in a modal overlay, so that I can learn more about a food's ingredients and cultural significance without leaving the page.

#### Acceptance Criteria

1. WHEN the user activates a Food_Card, THE App SHALL open the Food_Detail_Modal for the corresponding dish.
2. THE Food_Detail_Modal SHALL display: dish name, large image, full description, ingredients list, region, category, vegetarian/non-vegetarian classification, and cultural note.
3. THE Food_Detail_Modal SHALL display a clearly labelled close button.
4. WHEN the user activates the close button, THE App SHALL close the Food_Detail_Modal.
5. WHEN the Food_Detail_Modal is open and the user presses the Escape key, THE App SHALL close the Food_Detail_Modal.
6. WHEN the Food_Detail_Modal is open and the user clicks outside the modal content area, THE App SHALL close the Food_Detail_Modal.
7. WHEN the Food_Detail_Modal opens, THE App SHALL trap keyboard focus within the modal until it is closed.
8. WHEN the Food_Detail_Modal closes, THE App SHALL return keyboard focus to the Food_Card that triggered the modal.
9. THE Food_Detail_Modal SHALL have the ARIA role `dialog` and an `aria-labelledby` attribute referencing the modal's heading.

---

### Requirement 8: Favourites

**User Story:** As a visitor, I want to save and remove favourite dishes, so that I can keep a personal list of foods I want to remember.

#### Acceptance Criteria

1. THE Food_Card SHALL display a favourite toggle button (heart icon or equivalent) for each dish.
2. WHEN the user activates the favourite toggle button on a Food_Card for a dish not currently in favourites, THE Favorites_Store SHALL add that dish's `id` to the saved favourites.
3. WHEN the user activates the favourite toggle button on a Food_Card for a dish currently in favourites, THE Favorites_Store SHALL remove that dish's `id` from the saved favourites.
4. THE Food_Card favourite toggle button SHALL visually reflect whether the dish is currently a favourite (active vs. inactive state).
5. THE App SHALL persist favourites in localStorage under a consistent key so that favourites survive page refresh.
6. WHEN the App initialises, THE Favorites_Store SHALL read and restore saved favourites from localStorage.
7. IF localStorage is unavailable or contains malformed data, THEN THE Favorites_Store SHALL initialise with an empty favourites list without throwing an error.
8. THE Navigation "Favourites" link SHALL display the current count of saved favourite dishes and update in real time as favourites are added or removed.
9. WHEN the favourite toggle button receives keyboard focus, THE App SHALL display a visible focus indicator on that button.

---

### Requirement 9: Footer

**User Story:** As a visitor, I want a polished footer, so that the page feels complete and well-designed.

#### Acceptance Criteria

1. THE Footer SHALL be displayed at the bottom of every page.
2. THE Footer SHALL include the site name "Flavours of Tamil Nadu" and a tagline or attribution line referencing Kiro University 2026.
3. THE Footer SHALL use a visual design consistent with the Tamil Nadu theme of the App.
4. THE Footer SHALL be fully responsive and render correctly at viewport widths of 320px, 768px, and 1280px.

---

### Requirement 10: Accessibility

**User Story:** As a user with a disability, I want the application to be accessible, so that I can use all features with assistive technologies and keyboard navigation.

#### Acceptance Criteria

1. THE App SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) to convey page structure.
2. THE App SHALL provide descriptive `alt` text for all meaningful images.
3. WHEN an image is purely decorative, THE App SHALL set its `alt` attribute to an empty string (`alt=""`).
4. THE App SHALL ensure all interactive controls (buttons, links, inputs) are reachable and operable via keyboard Tab and Enter/Space keys.
5. THE App SHALL provide visible focus indicators on all interactive elements that meet WCAG 2.1 Level AA contrast requirements.
6. THE App SHALL ensure all text content meets WCAG 2.1 Level AA colour contrast ratios (4.5:1 for normal text, 3:1 for large text).
7. THE Food_Detail_Modal SHALL implement a focus trap preventing keyboard focus from leaving the modal while it is open.
8. THE App SHALL include appropriate ARIA labels on icon-only buttons (favourite toggle, hamburger menu, close button) so their purpose is communicated to screen readers.
9. THE Filter_Bar SHALL use `role="group"` or equivalent ARIA grouping so screen readers convey the filter options as a related set.

---

### Requirement 11: Responsiveness

**User Story:** As a visitor using any device, I want the application to display correctly on desktop, tablet, and mobile screens, so that I have a good experience regardless of device.

#### Acceptance Criteria

1. THE App SHALL render without horizontal scroll at viewport widths of 320px, 768px, and 1280px.
2. THE App SHALL use flexible layouts (CSS Grid or Flexbox) so that all sections reflow correctly at any viewport width between 320px and 1920px.
3. THE Navigation SHALL switch between desktop and mobile layouts at the 768px breakpoint as specified in Requirement 2.
4. THE Food_Card grid SHALL adapt column count at breakpoints as specified in Requirement 4.
5. THE Food_Detail_Modal SHALL be scrollable on small viewports if its content exceeds the visible screen height.
6. Touch targets (buttons, links) SHALL have a minimum hit area of 44×44 CSS pixels on mobile viewports.

---

### Requirement 12: UX Polish and Animation

**User Story:** As a visitor, I want smooth interactions and clear feedback states, so that the application feels modern and enjoyable to use.

#### Acceptance Criteria

1. THE Food_Card SHALL display a hover state (e.g., subtle shadow lift or scale) WHEN the pointer enters the card.
2. THE App SHALL apply smooth CSS transitions (200ms–400ms duration) to Food_Card hover effects.
3. WHEN the Food_Detail_Modal opens, THE App SHALL animate the modal entrance (e.g., fade-in or scale-up).
4. WHEN the Food_Detail_Modal closes, THE App SHALL animate the modal exit.
5. THE App SHALL apply smooth CSS transitions to Filter_Bar button active state changes.
6. THE favourite toggle button SHALL animate (e.g., pulse or scale) WHEN its state changes.
7. WHEN the user activates the "Explore Foods" CTA, THE App SHALL scroll smoothly to the food discovery section.

---

### Requirement 13: Testing — Food Data Structure

**User Story:** As a developer, I want unit tests for the Food_Dataset structure, so that I can verify data integrity before the UI layer consumes it.

#### Acceptance Criteria

1. THE test suite SHALL verify that the Food_Dataset contains exactly twelve dish objects.
2. THE test suite SHALL verify that each dish object contains all required fields: `id`, `name`, `image`, `description`, `region`, `category`, `isVegetarian`, `ingredients`, `culturalNote`.
3. THE test suite SHALL verify that all `id` values in the Food_Dataset are unique.
4. THE test suite SHALL verify that `isVegetarian` is a boolean for every dish object.
5. THE test suite SHALL verify that `ingredients` is a non-empty array for every dish object.
6. THE test suite SHALL verify that `category` is one of the allowed values ("Breakfast", "Main Course", "Snack", "Dessert/Drink") for every dish object.

---

### Requirement 14: Testing — Search Logic

**User Story:** As a developer, I want unit and property-based tests for the search function, so that I can guarantee correct filtering behaviour across arbitrary inputs.

#### Acceptance Criteria

1. THE test suite SHALL verify that searching with an empty string returns all dishes.
2. THE test suite SHALL verify that searching with a string matching one dish name returns only that dish.
3. THE test suite SHALL verify that searching is case-insensitive (e.g., "dosa", "DOSA", "DoSa" all return the same result).
4. THE test suite SHALL verify that searching with a string matching no dish name returns an empty array.
5. THE test suite SHALL include a property-based test asserting that FOR ALL search strings, the count of results is less than or equal to the total number of dishes.
6. THE test suite SHALL include a property-based test asserting that FOR ALL search strings, every result's `name` field contains the search string (case-insensitive).

---

### Requirement 15: Testing — Filtering Logic

**User Story:** As a developer, I want unit tests for the filter function, so that I can confirm each filter option returns the correct subset of dishes.

#### Acceptance Criteria

1. THE test suite SHALL verify that the "All" filter returns all dishes.
2. THE test suite SHALL verify that the "Vegetarian" filter returns only dishes where `isVegetarian` is `true`.
3. THE test suite SHALL verify that the "Non-Vegetarian" filter returns only dishes where `isVegetarian` is `false`.
4. THE test suite SHALL verify that each Category filter (Breakfast, Main Course, Snack, Dessert/Drink) returns only dishes whose `category` matches.
5. THE test suite SHALL include a property-based test asserting that FOR ALL valid filter values, every result satisfies the filter predicate.
6. THE test suite SHALL verify that applying the "Vegetarian" filter followed by the "Non-Vegetarian" filter produces disjoint result sets.

---

### Requirement 16: Testing — Combined Search and Filter

**User Story:** As a developer, I want tests for the combined search + filter logic, so that I can verify the intersection behaviour works correctly.

#### Acceptance Criteria

1. THE test suite SHALL verify that applying both a search string and a filter returns only dishes that satisfy both conditions simultaneously.
2. THE test suite SHALL verify that a search + filter combination that matches no dishes returns an empty array.
3. THE test suite SHALL include a property-based test asserting that FOR ALL combinations of search string and filter value, each result satisfies both the search predicate AND the filter predicate.
4. THE test suite SHALL include a property-based test asserting that the combined result set is always a subset of the search-only result set.
5. THE test suite SHALL include a property-based test asserting that the combined result set is always a subset of the filter-only result set.

---

### Requirement 17: Testing — Favourites Logic

**User Story:** As a developer, I want unit tests for the favourites state management, so that I can verify add, remove, and persistence behaviour.

#### Acceptance Criteria

1. THE test suite SHALL verify that adding a dish `id` to an empty favourites list results in a list containing exactly that `id`.
2. THE test suite SHALL verify that adding the same dish `id` twice results in a favourites list containing that `id` exactly once (idempotent add).
3. THE test suite SHALL verify that removing a dish `id` from a favourites list that contains it results in a list that does not contain that `id`.
4. THE test suite SHALL verify that removing a dish `id` from a favourites list that does not contain it leaves the list unchanged.
5. THE test suite SHALL include a property-based test asserting that FOR ALL sequences of add/remove operations, the favourites list never contains duplicate `id` values.
6. THE test suite SHALL verify that favourites saved to localStorage can be read back and parsed to produce an equivalent favourites list (round-trip property).

---

### Requirement 18: Testing — Dataset Immutability

**User Story:** As a developer, I want a property-based test asserting that search, filter, and favourites operations do not mutate the original Food_Dataset, so that all features always operate on consistent source data.

#### Acceptance Criteria

1. THE test suite SHALL verify that after executing a search operation, the Food_Dataset array length is unchanged.
2. THE test suite SHALL verify that after executing a filter operation, each object in the Food_Dataset is reference-equal to the corresponding object before the operation.
3. THE test suite SHALL include a property-based test asserting that FOR ALL search strings and filter values, applying search and filter does not modify any field of any object in the Food_Dataset.
4. THE test suite SHALL verify that adding a dish to favourites does not alter any field of the corresponding dish object in the Food_Dataset.

---

## Non-Functional Requirements

### Performance

1. THE App SHALL achieve an initial page load (Largest Contentful Paint) of under 3 seconds on a simulated mid-tier mobile connection (3G Fast).
2. THE Search_Bar filter response SHALL complete and re-render within 100ms of a keystroke.

### Maintainability

1. THE App SHALL organise React components into a `src/components` directory with one component per file.
2. THE Food_Dataset SHALL be defined in a single dedicated data file (e.g., `src/data/foods.js`) separate from component files.
3. THE App SHALL use consistent naming conventions (PascalCase for components, camelCase for utilities and data fields).

### Browser Compatibility

1. THE App SHALL function correctly in the latest stable releases of Chrome, Firefox, Safari, and Edge.

### Technology Stack

1. THE App SHALL be scaffolded with Vite and use React with JavaScript (not TypeScript).
2. THE App SHALL not require a backend server — all data SHALL be served from local static files.
3. THE App SHALL use Vitest as the test runner for unit and property-based tests.
```
