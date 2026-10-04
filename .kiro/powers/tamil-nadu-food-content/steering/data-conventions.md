---
inclusion: manual
---

# Data Conventions — Food Dataset Structure

Technical reference for the `FOODS` array in `src/data/foods.js`.

---

## Dish object shape

Every dish must be a plain JavaScript object with exactly these 9 fields:

```js
{
  id:           string,   // kebab-case, unique across the dataset
  name:         string,   // display name, Title Case
  image:        string,   // Unsplash URL: https://images.unsplash.com/photo-<ID>?w=600&q=80
  description:  string,   // 1–3 sentences, under 200 chars
  region:       string,   // real Tamil Nadu geographic area
  category:     string,   // "Breakfast" | "Main Course" | "Snack" | "Dessert/Drink"
  isVegetarian: boolean,  // true or false — never a string
  ingredients:  string[], // non-empty array of ingredient name strings
  culturalNote: string,   // min 2 sentences of genuine cultural context
}
```

---

## Field rules

### id
- Format: `kebab-case` — lowercase letters, digits, hyphens only
- Must be globally unique across all entries
- Derived from the dish name: `"Kuzhi Paniyaram"` → `"kuzhi-paniyaram"`

### name
- Title Case display name
- Use the most widely recognised English transliteration
- No trailing punctuation

### image
- Always an Unsplash URL with `?w=600&q=80` query parameters
- Fallback to placeholder handled by `FoodCard` component's `onError` handler — do not leave image blank

### category
Exactly one of these four string values — no other values are permitted:

```
"Breakfast"
"Main Course"
"Snack"
"Dessert/Drink"
```

### isVegetarian
- Must be a JavaScript `boolean` — **not** the string `"true"` or `"false"`
- `false` only for dishes where meat, poultry, or seafood is a primary ingredient
- `true` for all other dishes

### ingredients
- Non-empty array of plain strings
- Each string is an ingredient name (optionally with Tamil name in parentheses)
- No quantities, no measurements

### culturalNote
- String, minimum 2 complete sentences
- Shown only in `FoodDetailModal` — safe to be longer than `description`

---

## File structure

```js
// src/data/foods.js

const rawFoods = [
  { /* dish 1 */ },
  { /* dish 2 */ },
  // ...
]

export const FOODS = Object.freeze(rawFoods.map(dish => Object.freeze(dish)))
```

**Key rules:**
- `rawFoods` is the mutable source array used only during module initialisation
- `FOODS` is deep-frozen — every dish object is also frozen
- Never import `rawFoods` directly — always import `FOODS`
- Never reassign, push to, or mutate `FOODS` at runtime
- Adding a new dish = adding a new object to `rawFoods` inside the file

---

## Allowed region values

Real Tamil Nadu geographic areas only. Accepted values include:

```
Statewide       (dish prepared across all of Tamil Nadu)
Chettinad       (Sivaganga district)
Madurai
Kongu Nadu      (Coimbatore / Erode / Salem belt)
Chennai
Tirunelveli
Thanjavur
Coimbatore
Salem
Kanyakumari
Vellore
Trichy
```

Do not use: `"South India"`, `"India"`, `"Tamil Nadu"` (use `"Statewide"` instead), or non-Tamil Nadu regions.

---

## Validation

After any edit to `foods.js`:

```bash
# Run the Vitest test suite — catches schema violations and data integrity issues
npm test -- --run

# Run the Food Curator agent in Kiro for a full quality audit
# (reads the file and checks all 7 criteria per dish)
```

The test suite (`src/__tests__/foods.test.js`) enforces:
- Exactly 12 dishes (update this test if the count changes)
- All required fields present
- Unique IDs
- `isVegetarian` is boolean
- `ingredients` is non-empty array
- `category` is one of the 4 allowed values
- Dataset immutability under search/filter operations
