# Mosen Portfolio — Project-Scoped Agent Rules

## 1. Project Identity
- **Project**: `mosen.` — Personal portfolio & CMS for Muhammad Mohsin.
- **URL**: https://mosen.dev
- **Stack**: Next.js · React 19 · TypeScript 5.8 · TailwindCSS v4 · Firebase/Firestore · GSAP · Motion · Lenis
- **Dev command**: `npm run dev` (port 3000)
- **Root**: `d:\Mosen\website`
- **GitHub**: https://github.com/m6474n

## 2. Architecture Rules
- All views live in `src/components/` as `*View.tsx` files.
- Route segments live in `src/app/` as Next.js App Router pages.
- Shared types ONLY in `src/types.ts` — never duplicate interfaces inline.
- Global state via `src/context/DataContext.tsx` (Firestore) and `src/context/AuthContext.tsx`.
- Firebase collections: `posts`, `case_studies`, `projects`, `services`, `resources`, `blogs`, `messages`.
- Static/seed fallback data lives in `src/data.ts`.
- Path alias `@/` maps to `src/`.

## 3. Mandatory Design System (never deviate)
- **Palette**: `#111111` text · `#FFFFFF` bg · `#E5E5E5` borders · `#666666` muted · `#F5F5F5` hover
- **Fonts**: `Inter Tight` (display/headings, weights 200/300/400) · `Inter` (body, weights 300-800)
- **CSS variables**: `--font-inter` · `--font-inter-tight`
- **Border rule**: 1px `border-neutral-200` separators — NO drop shadows
- **Motion**: `fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)` entry · hover `duration-300`
- **Admin routes** (`/admin`, `/login`): skip Header, Footer, CustomPointer, Lenis
- **No dark mode** unless explicitly requested
- **No placeholder copy** — use real brand-aligned content only
- **Icons**: `lucide-react` only

## 4. Token Efficiency Rules (Critical)
- **Read targeted sections**: Use `StartLine`/`EndLine` on large files. Never read the whole file.
- **Avoid re-reading**: Cache file context. Re-read only after you have made edits.
- **Skip heavy directories**: Never list or search inside `node_modules/`, `.next/`, `.git/`.
- **grep first**: Use `grep_search` with `Includes: ["*.tsx","*.ts"]` to locate symbols before opening files.
- **Surgical edits**: Prefer `multi_replace_file_content` over full file overwrites.
- **Batch independent calls**: Always group non-dependent tool calls in the same block.
- **No redundant summaries**: Do not restate file contents after reading; proceed to task.

## 5. Code Quality Rules
- **TypeScript strict**: All props must be typed; no `any`.
- **Imports order**: React → third-party → internal (`@/`) → types → styles.
- **Firestore mutations**: Always add `lastModified: new Date().toISOString()`.
- **Env vars**: Client-side vars use `NEXT_PUBLIC_` prefix. Never log or expose secrets.
- **Animation libraries**: `motion` for component-level transitions; `gsap` for scroll-trigger timelines.

## 6. File Size Awareness
| File | Size | Strategy |
|---|---|---|
| `src/data.ts` | 37 KB | Read only the specific array you need |
| `src/components/AdminDashboardView.tsx` | 68 KB | Read in chunks (200 lines max); edit surgically |
| `src/components/InteractiveScreenshotMockup.tsx` | 42 KB | Read by section |
| `src/components/InteractiveWorldMap.tsx` | 31 KB | Avoid full rewrites |
| `src/components/HomeView.tsx` | 23 KB | Read by section |
| `src/components/ContactView.tsx` | 17 KB | Read by section |

## 7. Verification Checklist
- After any component change: confirm dev server compiles (`npm run dev`)
- For Firestore writes: verify against `firebase-blueprint.json` schema
- For SEO: every page needs `<title>`, `<meta name="description">`, semantic `<h1>`
- For new components: ensure they respect the monochrome palette and Inter/Inter Tight fonts
