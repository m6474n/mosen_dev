---
name: component-coder
description: >
  Activates the mosen.dev component coding standard when creating or modifying
  React components, views, UI sections, or any TSX file in the mosen portfolio.
  Trigger when: building a new view, editing an existing component, creating
  reusable UI, adding animations, or implementing new page sections.
  Enforces Swiss Modernist design, strict TypeScript, and motion patterns.
---

# Component Coder — Mosen Design System Implementation Guide

## Component File Template

```tsx
'use client'; // only if client-side hooks needed

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconName } from 'lucide-react';
// Internal imports
import { useData } from '@/context/DataContext';
import type { YourType } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ComponentNameProps {
  // define all props explicitly — no `any`
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ComponentName({ prop }: ComponentNameProps) {
  return (
    <section className="py-24 md:py-32 bg-white">
      {/* content */}
    </section>
  );
}
```

---

## Palette Classes (TailwindCSS v4)

| Intent | Class |
|---|---|
| Primary text | `text-neutral-900` or `text-[#111111]` |
| Muted text | `text-neutral-500` |
| Caption / label | `text-neutral-400` |
| Background | `bg-white` |
| Card / section bg | `bg-neutral-50` |
| Hover background | `hover:bg-neutral-100` |
| Border | `border-neutral-200` |
| Hover border | `hover:border-neutral-900` |
| Transition | `transition-all duration-300` |

---

## Typography Classes

| Style | Classes |
|---|---|
| Hero heading | `font-[family-name:var(--font-inter-tight)] text-4xl md:text-6xl font-light tracking-tight uppercase` |
| Section heading | `font-[family-name:var(--font-inter-tight)] text-2xl md:text-3xl font-light tracking-tight uppercase` |
| Card title | `font-[family-name:var(--font-inter)] text-lg font-medium tracking-tight text-neutral-900` |
| Lead paragraph | `font-[family-name:var(--font-inter)] text-base md:text-lg font-light text-neutral-600 leading-relaxed` |
| Body text | `font-[family-name:var(--font-inter)] text-sm font-light text-neutral-500 leading-relaxed` |
| Data stat | `font-[family-name:var(--font-inter)] font-extrabold text-neutral-900 tracking-tight` |
| Sub-label | `text-[10px] font-semibold uppercase tracking-widest text-neutral-400` |

---

## Layout Patterns

### Standard Section Container
```tsx
<section className="py-24 md:py-32">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    {/* content */}
  </div>
</section>
```

### Swiss Bento Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-neutral-200">
  <div className="md:col-span-2 border-b border-r border-neutral-200 p-8 md:p-12">
    {/* main content */}
  </div>
  <div className="border-b border-r border-neutral-200 p-8">
    {/* sidebar content */}
  </div>
</div>
```

### Card with Hover
```tsx
<div className="border border-neutral-200 p-8 transition-all duration-300 hover:bg-neutral-100 hover:border-neutral-900 cursor-pointer">
  {/* card content */}
</div>
```

---

## Motion Patterns

### Page Entry (fade-in)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>
```

### Staggered List
```tsx
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* item */}
    </motion.li>
  ))}
</motion.ul>
```

### Exit Animation
```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="unique-key"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
```

---

## Firestore Data Pattern

```tsx
import { useData } from '@/context/DataContext';

export default function MyView() {
  const { caseStudies, isLoading } = useData();

  if (isLoading) return <div className="py-32 text-center text-neutral-400 text-sm">Loading…</div>;

  return (/* render */);
}
```

---

## Admin Component Pattern

Admin views skip Header/Footer/CustomPointer/Lenis automatically (handled in layout.tsx).
Admin components should use:
```tsx
<div className="min-h-screen bg-neutral-50 p-6 md:p-8">
  <div className="max-w-6xl mx-auto">
    {/* dashboard content */}
  </div>
</div>
```

---

## Checklist Before Submitting a Component

- [ ] All props are typed (no `any`)
- [ ] Uses `--font-inter` or `--font-inter-tight` variables
- [ ] Colors match the monochrome palette
- [ ] Borders are 1px `border-neutral-200` (no box shadows)
- [ ] Hover states use `transition-all duration-300`
- [ ] Animations use `cubic-bezier(0.16, 1, 0.3, 1)`
- [ ] `lucide-react` used for icons
- [ ] `lastModified` included on any Firestore write
- [ ] No `console.log` left in production code
