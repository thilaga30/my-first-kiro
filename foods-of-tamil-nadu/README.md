# Flavours of Tamil Nadu

A premium food-discovery SPA built for **Kiro University 2026**, showcasing 12 traditional Tamil Nadu dishes.  
Built with React + Vite + JavaScript. No backend — all data is local.

---

## Getting started

```bash
npm install --registry https://registry.npmmirror.com
npm run dev        # dev server at http://localhost:5173
npm run build      # production build
npm test -- --run  # run all tests once
```

---

## Project structure

```
src/
  data/foods.js          # 12 frozen dish objects — the single source of truth
  hooks/                 # useFavourites (localStorage), useDiscovery (search + filter)
  utils/filterFoods.js   # pure searchFoods / filterFoods / applyDiscovery functions
  components/            # Navbar, Hero, DiscoverySection, FoodCard, FoodDetailModal, …
  __tests__/             # Vitest unit + fast-check property tests (35 tests, 8 properties)
mcp-server/
  food-dataset-server.js # Local MCP server (see below)
```

---

## Kiro tooling

### Food Curator agent

The **Food Curator** (`./kiro/agents/food-curator.md`) is a Kiro custom agent that audits dish entries in `src/data/foods.js` against seven quality criteria:

| # | Criterion | What it checks |
|---|-----------|----------------|
| C1 | Required fields | All 9 fields present and non-empty |
| C2 | Category enum | Must be one of: Breakfast, Main Course, Snack, Dessert/Drink |
| C3 | isVegetarian accuracy | Boolean type; consistent with ingredients list |
| C4 | Region validity | Must be a real Tamil Nadu geographic area |
| C5 | Description quality | 1–3 sentences, informative, under 200 characters |
| C6 | culturalNote depth | At least 2 substantive sentences of historical/cultural context |
| C7 | Cultural sensitivity | No stereotypes, respectful and accurate language |

**When to use it:** Run the Food Curator whenever you add a new dish or edit an existing entry. It reads the file, evaluates every dish, and produces a structured pass/fail report with actionable fix suggestions. It does not edit files — it only reports.

### Food Dataset MCP server

The **food-dataset MCP server** (`mcp-server/food-dataset-server.js`) runs locally and exposes the food dataset as four tools that Kiro can call directly during a session:

| Tool | What it does |
|------|-------------|
| `list_foods` | Returns all 12 dishes with ID, name, category, dietary type, and region |
| `get_food` | Returns full details for a specific dish by ID (e.g. `"pongal"`, `"jigarthanda"`) |
| `validate_dataset` | Runs structural validation across all dishes — same checks as the test suite |
| `filter_foods` | Filters dishes by dietary type or category (Vegetarian, Non-Vegetarian, Breakfast, etc.) |

No external services, API keys, or network calls are used. The server reads `src/data/foods.js` directly.

The MCP server is registered in `.kiro/settings/mcp.json` and is auto-approved for all four tools, so Kiro can call it without prompting during development and review sessions.

**How they work together:** The MCP server gives Kiro live, structured access to the dataset during any conversation. The Food Curator uses that same data to perform a quality audit and flag issues before they reach production. Together they keep the dataset accurate, consistent, and culturally respectful as the project grows.

---

## Testing

35 tests cover all 8 correctness properties defined in the spec:

| Property | Description | Tool |
|----------|-------------|------|
| P1 | Dish schema invariant | Deterministic loop |
| P2 | Search result correctness | `fc.string()` |
| P3 | Filter result correctness | `fc.constantFrom()` |
| P4 | Veg/non-veg sets disjoint | Deterministic |
| P5 | Combined search+filter subset invariants | `fc.tuple()` |
| P6 | Favourites never contain duplicates | `fc.array()` |
| P7 | localStorage round-trip fidelity | `fc.array()` |
| P8 | Dataset immutability under all operations | `fc.tuple()` |

Each property-based test runs 200 iterations using [fast-check](https://fast-check.dev/).

---

## Spec

Full specification lives in `.kiro/specs/foods-of-tamil-nadu/`:
- `requirements.md` — 18 requirements with EARS-format acceptance criteria
- `design.md` — architecture, component interfaces, data model, 8 correctness properties
- `tasks.md` — 16 ordered implementation tasks
