# Testing Conventions

## Tooling
- **Runner**: Vitest (`environment: "jsdom"`, `globals: true`)
- **PBT**: fast-check (`fc`)
- **Component**: @testing-library/react (optional, for UI smoke tests)

## File Location
Tests live alongside source or in `src/__tests__/`. Filename convention: `*.test.js`.

## Property Tag Format
Every property-based test must include this comment:
```js
// Feature: foods-of-tamil-nadu, Property N: <property name>
```

## Properties to Test (fast-check, min 100 runs each)
| # | Property | Arbitrary |
|---|---|---|
| 1 | Dish Schema Invariant | deterministic loop over FOODS |
| 2 | Search Result Correctness | `fc.string()` |
| 3 | Filter Result Correctness | `fc.constantFrom(...allowedFilters)` |
| 4 | Veg/Non-Veg Disjoint | deterministic |
| 5 | Combined Subset Invariants | `fc.tuple(fc.string(), fc.constantFrom(...allowedFilters))` |
| 6 | Favourites No Duplicates | `fc.array(fc.constantFrom(...ids))` |
| 7 | localStorage Round-Trip | `fc.array(fc.constantFrom(...ids))` |
| 8 | Dataset Immutability | `fc.tuple(fc.string(), fc.constantFrom(...allowedFilters))` |

## Unit Tests (concrete assertions)
- FOODS has exactly 12 dishes
- All IDs unique
- isVegetarian correct for Chettinad Chicken and Kothu Parotta
- searchFoods("") → all 12
- searchFoods("Dosa") → exactly Dosa
- searchFoods("zzz") → []
- filterFoods("All") → all 12
- each category filter → correct subset
- applyDiscovery intersection correctness
- Favourites: add, idempotent add, remove, remove-missing, malformed localStorage

## Run
```
npm test -- --run
```
