# Quick-Reference: Common Edit Targets

## When someone asks to edit HomeView
- File: `d:\Mosen\website\src\components\HomeView.tsx` (23 KB)
- Read strategy: grep for section name or JSX ID, then view ±50 lines
- Key sections: hero, stats grid, selected work, services overview, CTA

## When someone asks to edit AdminDashboardView
- File: `d:\Mosen\website\src\components\AdminDashboardView.tsx` (68 KB)
- Read strategy: grep for tab name or function, read 150-line chunks max
- Key sections: sidebar tabs, CRUD forms, message inbox, collection tables

## When someone asks to update types
- File: `d:\Mosen\website\src\types.ts` (2 KB — safe to read in full)
- Rule: never inline types — always define in this file

## When someone asks to update seed data
- File: `d:\Mosen\website\src\data.ts` (37 KB)
- Read strategy: grep the exported array name, read 80-line chunk
- Arrays: CASE_STUDIES, SERVICES, RESOURCES, BLOG_POSTS, TESTIMONIALS, SKILLSET

## When someone asks to add a new route
1. Create `src/app/[route]/page.tsx`
2. Import the relevant `*View.tsx` component
3. Export `generateMetadata` using `src/lib/seo.ts` patterns
4. Add to `src/app/sitemap.ts`

## When someone asks to update Firebase data
1. Use `saveItem(type, { ...data, lastModified: new Date().toISOString() })`
2. Verify field names against `firebase-blueprint.json`
3. Check `src/context/DataContext.tsx` for collection name mapping

## When someone asks to add a new animation
- Component-level: import `motion` from `'motion/react'`
- Scroll-trigger: use `gsap.registerPlugin(ScrollTrigger)` in a `useEffect`
- Easing: always `cubic-bezier(0.16, 1, 0.3, 1)` (the brand easing)
- Duration: entry `0.3–0.5s` · hover `0.3s` · stagger `0.07s` per item
