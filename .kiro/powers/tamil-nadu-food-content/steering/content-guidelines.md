---
inclusion: manual
---

# Content Guidelines — Descriptions and Cultural Notes

Standards for writing the `description` and `culturalNote` fields in `src/data/foods.js`.

---

## Description field

The description is the first thing a visitor reads on the food card. It must be informative, evocative, and concise.

### Rules

| Rule | Detail |
|------|--------|
| Length | 1–3 sentences. Under 200 characters total. |
| Content | Describe what the dish **is** — its primary ingredients, texture, appearance, or taste. |
| Tone | Warm and inviting. Like a knowledgeable friend recommending the dish. |
| Avoid | Marketing language ("world-famous", "best ever"), vague filler ("very tasty"), claims about popularity that can't be verified. |
| End | Always end with a period. |

### Good examples

```
Pillowy steamed rice cakes fermented overnight, served with sambar and coconut chutney. A cornerstone of Tamil breakfast culture.

A bold, fiery curry from the Chettinad region, built on a complex spice blend including kalpasi (stone flower), marathi mokku and freshly ground pepper.

Madurai's legendary chilled drink — layers of almond milk, nannari syrup, milk ice cream and basil seeds in a tall glass.
```

### Bad examples

```
❌ This is the most popular dish in Tamil Nadu! Everyone loves it.
❌ A very tasty rice dish.
❌ The world's best dosa.
```

---

## culturalNote field

The cultural note is shown only in the detail modal. It provides depth — the story behind the dish.

### Rules

| Rule | Detail |
|------|--------|
| Length | Minimum 2 complete sentences. No upper limit, but stay focused. |
| Content | At least one of: historical origin, regional significance, festival/ritual connection, trade/migration influence, linguistic origin of the name, culinary technique significance. |
| Accuracy | Factual claims must be plausible and consistent with known Tamil culinary history. Do not invent origin stories. Phrases like "Legend attributes…" or "References suggest…" are acceptable for unverified claims. |
| Sensitivity | No stereotypes about Tamil people, culture, or cuisine. No exaggerated claims ("only dish of its kind"). Treat the culture with the same respect you would any other. |
| Avoid | Simply restating the description. Vague filler ("This dish is popular in Tamil Nadu and loved by many."). |

### Good examples

```
Pongal is the centrepiece of the Tamil harvest festival Pongal (Thai Pongal), celebrated in January. The name literally means "to boil over" — symbolising abundance and prosperity. It is first offered to the Sun God before the family partakes.

Kothu Parotta originated in Madurai and is synonymous with Tamil Nadu's vibrant night food culture. The distinctive metallic clang of the iron scrapers working on the griddle has become as iconic as the dish itself — you can hear a Kothu Parotta stall before you see it.
```

### Bad examples

```
❌ Idli is a popular South Indian dish. People in Tamil Nadu eat it every day for breakfast.
❌ This ancient recipe has been passed down for thousands of years. (Too vague, unverifiable)
❌ Tamil people always eat this at every festival. (Overgeneralisation)
```

---

## General tone principles

- Write in British English (the project uses "favourite", "colour", "flavour").
- Use an em dash (—) for parenthetical remarks, not a hyphen (-).
- Food names and Tamil terms may be italicised in cultural notes if helpful for clarity, but this is not required.
- When using a Tamil word, include a brief translation in parentheses on first use: `kuzhi (hole or pit in Tamil)`.
- Avoid transliterations that may be offensive or inaccurate — use the most widely accepted English spelling.
