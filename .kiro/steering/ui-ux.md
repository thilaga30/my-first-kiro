# UI / UX Rules

## Visual Direction
Premium modern food-discovery site. Warm earthy tones, elegant typography, strong imagery, clean spacing.
Must look like a polished portfolio/demo — not a tutorial or CRUD app.

## Colour Palette (CSS custom properties)
```css
--color-primary:    #c0392b;  /* deep Tamil red */
--color-secondary:  #e67e22;  /* turmeric orange */
--color-accent:     #f39c12;  /* saffron gold */
--color-bg:         #fdf6ec;  /* warm cream */
--color-surface:    #ffffff;
--color-text:       #2c1810;  /* dark espresso */
--color-text-muted: #7a5c4f;
--color-border:     #e8d5c4;
```

## Typography
- Headings: system serif stack or Google Font (Playfair Display)
- Body: system sans-serif stack
- Contrast: WCAG 2.1 AA — 4.5:1 normal text, 3:1 large text

## Breakpoints
| Breakpoint | Layout |
|---|---|
| < 768px (mobile) | 1-col grid, hamburger nav |
| 768px–1279px (tablet) | 2-col grid, horizontal nav |
| ≥ 1280px (desktop) | 3-col grid, horizontal nav |

## Animations
- Card hover: subtle translateY(-4px) + box-shadow, 250ms ease
- Modal: fade-in + scale 0.95→1, 200ms ease
- Favourite toggle: scale pulse 1→1.25→1, 200ms
- Filter active: background transition 150ms ease
- Smooth scroll on CTA

## Accessibility
- Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`
- All interactive elements keyboard-reachable (Tab, Enter, Space)
- Visible focus ring on every interactive element
- `alt` text on all meaningful images; `alt=""` on decorative
- ARIA labels on icon-only buttons (hamburger, favourite heart, modal close)
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap
- FilterBar: `role="group"`, `aria-label="Filter dishes"`
- Touch targets: min 44×44px on mobile

## Empty States
Show a friendly Tamil-themed illustration/message when search or filter returns no results.
