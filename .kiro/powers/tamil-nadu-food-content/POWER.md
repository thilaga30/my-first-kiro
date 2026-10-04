# Tamil Nadu Food Content Power

A reusable Kiro Power that guides contributors through creating, validating, and maintaining food entries in the *Flavours of Tamil Nadu* project (`src/data/foods.js`).

## What this Power does

Provides structured workflow guidance for:

1. **Creating a new food entry** — the exact object shape required, with worked examples
2. **Validating required metadata** — all 9 mandatory fields and their types
3. **Assigning category and dietary classification** — rules for `category` enum and `isVegetarian` boolean
4. **Writing concise descriptions** — length, tone, and content rules
5. **Writing respectful cultural notes** — depth, accuracy, and sensitivity guidelines
6. **Maintaining project conventions** — naming, immutability, data file structure

## Who should use it

Any developer or contributor adding or editing a dish entry in `src/data/foods.js`.

## Structure

```
.kiro/powers/tamil-nadu-food-content/
  POWER.md          ← this file (Power documentation)
  steering/
    add-food-entry.md     ← step-by-step workflow for adding a dish
    content-guidelines.md ← description + cultural note writing standards
    data-conventions.md   ← field rules, types, and project structure
```

## Usage

When working with the food dataset, reference these steering guides:

- **Adding a new dish?** → follow `add-food-entry.md`
- **Writing or editing text content?** → follow `content-guidelines.md`
- **Checking data shape or types?** → follow `data-conventions.md`

The Power works alongside the **Food Curator** agent (`.kiro/agents/food-curator.md`), which can audit any entry you create using this Power's guidelines.
