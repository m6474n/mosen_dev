# mosen. — Personal Portfolio & Product Engineering Showcase

> **One person. Three disciplines. Zero handoffs.**

A high-performance, offline-first personal portfolio website for **Muhammad Mohsin** — a product engineer, visual designer, and workflow automation builder. Built with React 19, Vite, TailwindCSS v4, and Firebase/Firestore as the backend, this site acts as both a living portfolio and a content management system managed entirely by a single operator.

---

## ✦ Project Overview

This is not a template. It is a purpose-built product — designed from a custom brand system and coded to match exactly what was designed, with zero compromise between Figma and the browser.

The stack prioritizes:

- **Speed** — Hash-based SPA routing with zero server round-trips for navigation
- **Motion** — GSAP + Motion (Framer Motion) for purposeful, non-gratuitous animations
- **Precision** — Swiss Modernist design system with strict typographic hierarchy
- **Authority** — Content managed from a private Admin Dashboard backed by Firestore
- **Smoothness** — Lenis smooth scroll for a premium scrolling experience across all views

---

## ✦ Features

| Area | Details |
| :--- | :--- |
| **Hash-based SPA routing** | Instant, offline-first navigation with no full page reloads |
| **Animated page transitions** | Per-route `AnimatePresence` fade + slide transitions via Motion |
| **Initial preloader** | Branded intro animation shown once on first load |
| **Custom cursor** | Fine-pointer-aware custom indicator dot — hidden on touch devices |
| **Dynamic `<title>` updates** | `MetaTitleUpdater` component updates the browser tab title per route |
| **Smooth scroll** | `Lenis` (via `ReactLenis`) with configurable `lerp` and `duration` |
| **Admin Dashboard** | Private CMS to manage all content collections (CRUD) from the browser |
| **Contact & Booking forms** | Inquiry and project booking forms that write to Firestore `/messages` |
| **Case Studies** | Detailed write-ups with challenge, solution, tech stack, and result metrics |
| **Blog** | Technical essays with tag filtering and individual post pages |
| **Resources / Open Vault** | Copyable scripts, templates, and developer tooling files |
| **Interactive Globe** | `cobe`-powered WebGL world map showing client geographies |
| **Screenshot mockup** | Interactive device mockup component for showcasing project UIs |
| **Gemini AI integration** | `@google/genai` SDK connected for any AI-powered features |

---

## ✦ Pages & Routes

| Hash Route | View |
| :--- | :--- |
| `#/` or `#/home` | Home — hero, stats, selected work, and service overview |
| `#/about` | About — bio, philosophy, timeline, and stack |
| `#/services` | Services — detailed offering cards with outcomes |
| `#/case-studies` | Case Study index |
| `#/case-study/:id` | Individual case study detail page |
| `#/resources` | Open Vault — copyable scripts and templates |
| `#/blog` | Blog index — essays and technical writeups |
| `#/blog/:slug` | Individual blog post |
| `#/contact` | Contact & discovery consultation booking |
| `#/admin` | Admin Dashboard (private) — full CMS for all collections |

---

## ✦ Tech Stack

### Core
| Package | Role |
| :--- | :--- |
| `react` `^19.0.1` | UI framework |
| `react-dom` `^19.0.1` | DOM renderer |
| `vite` `^6.2.3` | Build tool & dev server |
| `typescript` `~5.8.2` | Type safety |

### Styling
| Package | Role |
| :--- | :--- |
| `tailwindcss` `^4.1.14` | Utility-first CSS (v4 via `@tailwindcss/vite`) |
| `autoprefixer` | Vendor prefix automation |

### Animation & Motion
| Package | Role |
| :--- | :--- |
| `motion` `^12.23.24` | Page transitions, `AnimatePresence`, scroll-linked animations |
| `gsap` `^3.15.0` | Timeline-based and scroll-trigger animations |
| `lenis` `^1.3.23` | Smooth scroll (used via `ReactLenis`) |

### Backend & Data
| Package | Role |
| :--- | :--- |
| `firebase` `^12.14.0` | Firestore database, Auth (if enabled) |
| `express` `^4.21.2` | Optional server-side layer |
| `dotenv` `^17.2.3` | Environment variable loading |

### AI & Visuals
| Package | Role |
| :--- | :--- |
| `@google/genai` `^2.4.0` | Gemini AI SDK |
| `cobe` `^2.0.1` | WebGL interactive globe |
| `lucide-react` `^0.546.0` | Icon library |

---

## ✦ Project Structure

```
website/
├── src/
│   ├── App.tsx                        # Root app — routing, layout, preloader, transitions
│   ├── main.tsx                       # React DOM entry point
│   ├── index.css                      # Global styles & CSS custom properties
│   ├── data.ts                        # Static seed data (fallback / initial content)
│   ├── types.ts                       # Shared TypeScript interfaces
│   ├── context/
│   │   └── DataContext.tsx            # Global data provider — Firestore reads + writes
│   └── components/
│       ├── HomeView.tsx               # Hero, stats, selected work, CTA
│       ├── AboutView.tsx              # Bio, philosophy, stack timeline
│       ├── ServicesView.tsx           # Service offering cards
│       ├── CaseStudyDetailView.tsx    # Case study detail page
│       ├── BlogView.tsx               # Blog index + individual post renderer
│       ├── ResourcesView.tsx          # Open Vault resources
│       ├── ContactView.tsx            # Contact & booking forms
│       ├── AdminDashboardView.tsx     # Private CMS dashboard
│       ├── Header.tsx                 # Persistent site navigation
│       ├── Footer.tsx                 # Site footer
│       ├── InitialPreloader.tsx       # First-load branded intro animation
│       ├── CustomPointer.tsx          # Fine-pointer custom cursor indicator
│       ├── InteractiveWorldMap.tsx    # WebGL globe (cobe)
│       ├── InteractiveScreenshotMockup.tsx  # Device mockup showcase
│       ├── RevealHeading.tsx          # Animated heading reveal component
│       ├── Button.tsx                 # Reusable button component
│       ├── ReusableCard.tsx           # Reusable content card
│       ├── DefaultPageLayout.tsx      # Standard page wrapper
│       ├── DynamicPageHeader.tsx      # Per-page header block
│       └── Navbar.tsx                 # Navigation bar primitives
├── index.html                         # HTML shell — global/fetch safety patches
├── vite.config.ts                     # Vite config — React plugin, Tailwind v4, path aliases
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies and scripts
├── firebase-blueprint.json            # Firestore schema & collection definitions
├── firebase-applet-config.json        # Firebase project config (non-secret keys)
├── firestore.rules                    # Firestore security rules
├── BRAND_KIT.md                       # Complete brand identity, typography & voice guide
├── security_spec.md                   # Security considerations and Firestore rule notes
└── .env                               # Local environment variables (not committed)
```

---

## ✦ Firestore Collections

| Collection | Schema | Purpose |
| :--- | :--- | :--- |
| `/posts` | `Post` | Admin workspace posts or system parameters |
| `/case_studies` | `CaseStudy` | Portfolio case studies with tech stack and results |
| `/projects` | `Project` | General project index and metadata |
| `/services` | `Service` | Client-facing service catalogue configurations |
| `/resources` | `Resource` | Open Vault templates, scripts, and tooling files |
| `/blogs` | `Blog` | Technical essays and editorial posts |
| `/messages` | `Message` | Lead inquiries and booking proposals from clients |

All collections support `Draft` / `Published` status flags, allowing content to be staged from the Admin Dashboard before going live.

---

## ✦ Getting Started

### Prerequisites

- **Node.js** `>=18.x`
- A **Firebase project** with Firestore enabled
- A **Gemini API key** (from [Google AI Studio](https://aistudio.google.com/))

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env` and fill in your credentials:

```bash
cp .env .env.local
```

Open `.env.local` and set:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## ✦ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server on port `3000` |
| `npm run build` | Compile and bundle for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` and `server.js` build artifacts |

---

## ✦ Design System

This project follows a documented brand system defined in [`BRAND_KIT.md`](./BRAND_KIT.md). Key highlights:

- **Aesthetic**: Swiss Modernism / High-Contrast Minimalist Industrialism
- **Palette**: Strictly monochrome — `#111111` text on `#FFFFFF` background, `#E5E5E5` borders
- **Typography**: `Inter Tight` for display headings, `Inter` for body and UI copy
- **Motion**: Purposeful only — fade-in entries (`0.3s cubic-bezier(0.16, 1, 0.3, 1)`), 300ms hover transitions, staggered list reveals
- **Layout**: Swiss editorial bento grids, 1px border separators (no drop shadows), generous section padding

---

## ✦ Admin Dashboard

The Admin Dashboard is accessible at `/#/admin` and provides a browser-based CMS for managing all Firestore content collections. From the dashboard you can:

- Create, edit, and delete **Case Studies**, **Blog Posts**, **Services**, **Resources**, and **Projects**
- Toggle **Draft / Published** status on any content item
- View and manage incoming **Messages** and **Booking requests** from the Contact form
- See real-time read/unread status for client inquiries

> **Note:** The dashboard is intentionally not behind an authentication wall in the current Firestore rules. It is recommended to add Firebase Auth rules before deploying publicly.

---

## ✦ Deployment

This is a static SPA and can be deployed to any static host:

```bash
npm run build
# Deploy the `dist/` directory to your host
```

**Recommended hosts:** Vercel, Netlify, Firebase Hosting, Cloudflare Pages.

For Firebase Hosting:

```bash
firebase deploy --only hosting
```

---

## ✦ License

This codebase is the personal work product of **Muhammad Mohsin (mosen.)**. It is not licensed for reuse or redistribution. The design system, brand assets, and copy are proprietary.

---

<div align="center">
  <sub>Built with precision by <strong>mosen.</strong> — One person. Three disciplines. Zero handoffs.</sub>
</div>
