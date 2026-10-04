---
inclusion: manual
---

# Add a New Tamil Nadu Food Entry

Follow this workflow to add a new dish to `foods-of-tamil-nadu/src/data/foods.js`.

---

## Step 1 — Decide the dish identity

Before writing any code, confirm:

- **Name**: Use the most widely recognised English transliteration of the Tamil name.
- **ID**: Convert the name to `kebab-case` (lowercase, hyphens, no spaces or special characters).
  - `"Kuzhi Paniyaram"` → `"kuzhi-paniyaram"`
  - `"Chettinad Chicken"` → `"chettinad-chicken"`
- **Region**: Pick the most specific real Tamil Nadu region. Use `"Statewide"` only if the dish is genuinely prepared across all of Tamil Nadu.
  - Accepted values: `Statewide`, `Chettinad`, `Madurai`, `Kongu Nadu`, `Chennai`, `Tirunelveli`, `Thanjavur`, `Coimbatore`, `Salem`, `Kanyakumari`, `Vellore`, `Trichy`

---

## Step 2 — Choose category and dietary classification

**Category** — pick exactly one:

| Value | When to use |
|-------|-------------|
| `"Breakfast"` | Traditionally eaten in the morning |
| `"Main Course"` | A rice, curry, flatbread, or substantial dish served as a meal |
| `"Snack"` | A light bite, street food, or between-meal item |
| `"Dessert/Drink"` | Sweet dish or beverage |

**isVegetarian** — must be a `boolean`:

- `false` — dish contains meat, poultry, or seafood as a primary ingredient
- `true` — all other dishes, including those with eggs (Tamil culinary convention treats eggs as vegetarian in street-food contexts)
- Check the ingredients list: if no meat/poultry/seafood appears, set `true`

---

## Step 3 — Gather ingredients

List ingredients as an array of plain strings, in the order they appear in the recipe:

```js
ingredients: ['Toor dal', 'Tamarind', 'Tomato', 'Pearl onions', 'Sambar powder', 'Mustard seeds', 'Oil', 'Salt']
```

- Use common English names with Tamil name in parentheses where helpful: `'Kalpasi (stone flower)'`
- Do not include quantities — names only
- Array must be non-empty

---

## Step 4 — Find an image

Use an Unsplash URL in this format:

```
https://images.unsplash.com/photo-<PHOTO_ID>?w=600&q=80
```

- Choose a photo that clearly shows the dish
- Use `w=600&q=80` query params for consistent sizing

---

## Step 5 — Write the description

See `content-guidelines.md` for full rules. Quick checklist:

- [ ] 1–3 sentences
- [ ] Under 200 characters
- [ ] Describes what the dish is, how it looks or tastes
- [ ] Evocative but not hyperbolic
- [ ] Ends with a period

---

## Step 6 — Write the cultural note

See `content-guidelines.md` for full rules. Quick checklist:

- [ ] At least 2 complete sentences
- [ ] Includes historical, regional, or cultural context
- [ ] Does not merely restate the description
- [ ] Factually accurate
- [ ] Respectful and culturally sensitive

---

## Step 7 — Add the entry to foods.js

Open `src/data/foods.js` and add the new object to `rawFoods` **before** the closing `]`:

```js
{
  id: 'your-dish-id',
  name: 'Your Dish Name',
  image: 'https://images.unsplash.com/photo-XXXX?w=600&q=80',
  description: 'Your 1–3 sentence description.',
  region: 'Region Name',
  category: 'Breakfast', // or Main Course / Snack / Dessert/Drink
  isVegetarian: true,    // or false
  ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
  culturalNote: 'Your cultural note. At least two sentences providing genuine historical or cultural context.',
},
```

> The array is exported as `Object.freeze(rawFoods.map(dish => Object.freeze(dish)))`.
> Never modify `FOODS` at runtime — treat it as read-only.

---

## Step 8 — Validate

After adding the entry:

1. Run the Food Curator agent to audit the new entry against all 7 quality criteria.
2. Run `npm test -- --run` to verify all property tests still pass (the dataset count test will catch schema violations).
3. Run `npm run build` to confirm no build errors.
