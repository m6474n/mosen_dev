---
name: mosen-context
description: >
  Loads complete project context for the mosen.dev portfolio codebase.
  Trigger this skill whenever working on the Mosen website, portfolio components,
  Firebase collections, admin dashboard, blog, case studies, services, or any
  part of the mosen.dev product. Provides architecture, design system, stack,
  and file map so the agent never wastes tokens re-exploring the project.
---

# Mosen Portfolio — Full Project Context

## Project Summary
**mosen.** is a purpose-built personal portfolio and CMS for Muhammad Mohsin (m6474n).
Tagline: *"One person. Three disciplines. Zero handoffs."*
Live at: https://mosen.dev | GitHub: https://github.com/m6474n

## Stack at a Glance
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI | React 19 + TypeScript 5.8 |
| Styling | TailwindCSS v4 |
| Animation | Motion (Framer) + GSAP + Lenis |
| Backend | Firebase Firestore |
| AI | @google/genai (Gemini SDK) |
| Icons | lucide-react |
| Globe | cobe (WebGL) |
| Analytics | Vercel Analytics + Google Analytics |

## Directory Map
```
d:\Mosen\website\
├── src/
│   ├── app/                     # Next.js App Router routes
│   │   ├── layout.tsx           # Root layout (fonts, providers, preloader)
│   │   ├── page.tsx             # Home entry
│   │   ├── about/               # /about route
│   │   ├── services/            # /services route
│   │   ├── case-studies/        # /case-studies route
│   │   ├── blog/                # /blog route
│   │   ├── resources/           # /resources route
│   │   ├── contact/             # /contact route
│   │   ├── admin/               # /admin route (private CMS)
│   │   ├── login/               # /login route
│   │   ├── robots.ts            # robots.txt generator
│   │   └── sitemap.ts           # Dynamic sitemap
│   ├── components/              # All view components
│   │   ├── HomeView.tsx         # Hero, stats, selected work (23KB)
│   │   ├── AboutView.tsx        # Bio, stack, timeline (16KB)
│   │   ├── ServicesView.tsx     # Service cards (14KB)
│   │   ├── CaseStudiesIndexView.tsx
│   │   ├── CaseStudyDetailView.tsx (12KB)
│   │   ├── BlogIndexView.tsx
│   │   ├── BlogPostView.tsx
│   │   ├── ResourcesView.tsx    # Open Vault (9KB)
│   │   ├── ContactView.tsx      # Forms (17KB)
│   │   ├── AdminDashboardView.tsx # Private CMS (68KB — read in chunks)
│   │   ├── Header.tsx           # Nav (5KB)
│   │   ├── Footer.tsx           # Footer (5KB)
│   │   ├── InitialPreloader.tsx # Branded intro animation
│   │   ├── CustomPointer.tsx    # Fine-pointer cursor
│   │   ├── InteractiveWorldMap.tsx # WebGL globe (31KB)
│   │   ├── InteractiveScreenshotMockup.tsx (42KB)
│   │   ├── RevealHeading.tsx    # Animated heading reveal
│   │   ├── Button.tsx           # Reusable button
│   │   ├── ReusableCard.tsx     # Reusable card
│   │   ├── DefaultPageLayout.tsx
│   │   ├── DynamicPageHeader.tsx
│   │   ├── LoginView.tsx
│   │   └── Navbar.tsx
│   ├── context/
│   │   ├── DataContext.tsx      # Firestore reads/writes + global state
│   │   └── AuthContext.tsx      # Firebase Auth provider
│   ├── lib/
│   │   └── seo.ts               # SEO utilities
│   ├── data.ts                  # Static seed data (37KB — read targeted sections)
│   ├── types.ts                 # All shared TypeScript interfaces
│   └── index.css                # Global styles
├── public/                      # Static assets
├── firebase-blueprint.json      # Firestore schema definitions
├── firestore.rules              # Firestore security rules
├── BRAND_KIT.md                 # Full brand identity guide
├── security_spec.md
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Firestore Collections
| Collection | Schema Type | Purpose |
|---|---|---|
| `/posts` | Post | Admin workspace posts |
| `/case_studies` | CaseStudy | Portfolio case studies |
| `/projects` | Project | General project index |
| `/services` | Service | Service catalogue cards |
| `/resources` | Resource | Open Vault scripts & templates |
| `/blogs` | Blog | Technical essays |
| `/messages` | Message | Contact/booking inquiries |

All documents support `status: "Draft" | "Published"` and `lastModified: string`.

## Design System Quick Reference
- **Primary text**: `#111111` (`text-[#111111]` / `text-neutral-900`)
- **Background**: `#FFFFFF`
- **Muted text**: `#666666` (`text-neutral-500`)
- **Borders**: `#E5E5E5` (`border-neutral-200`) — 1px only, no shadows
- **Hover bg**: `#F5F5F5` (`hover:bg-neutral-100`)
- **Selection**: `background #111111; color #ffffff`
- **Heading font**: `Inter Tight` via `font-[family-name:var(--font-inter-tight)]`
- **Body font**: `Inter` via `font-[family-name:var(--font-inter)]`

## TypeScript Interfaces (src/types.ts)
- `CaseStudy`, `CaseStudyScreenshot`
- `Service`
- `Resource`
- `BlogPost`
- `ContactSubmission`
- `SkillCategory`, `Milestone`, `EstimatorFeature`, `FaqItem`
- `ProcessStep`, `Testimonial`, `MetricPoint`, `BarPoint`, `ActivityGridDay`

## Key Patterns
- Admin route guard: `pathname.startsWith('/admin') || pathname.startsWith('/login')`
- Lenis smooth scroll wraps all non-admin routes: `<ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>`
- Page transitions via `<AnimatePresence mode="wait">` in layout
- Preloader shown once on first load; removed via `setIsLoading(false)` callback
