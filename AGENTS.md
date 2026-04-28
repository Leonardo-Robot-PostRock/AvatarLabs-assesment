# AGENTS.md

## Context
This is a **Next.js + Supabase Content Approval Engine** deployed in the frontend folder.

## 🚀 Quick Start

1. **Setup Supabase**:
   ```bash
   # Run SQL from supabase/setup.sql in your Supabase SQL Editor
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env.local
   # Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Run Development**:
   ```bash
   npm run dev
   ```

## 🧱 Architecture

- `/app` - Next.js App Router pages
- `/components` - UI components (shadcn/ui-style)
- `/lib` - Supabase client and utilities
- `/features/content` - Domain types and services
- `/tests` - Unit tests (Vitest)

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run unit tests |
| `npm run lint` | ESLint check |

## 🎨 UI/UX

- Dark mode default (via Tailwind CSS)
- 5-star branding theme (purple/blue/yellow accents)
- shadcn/ui-style components (no actual shadcn CLI needed)

## Key Files
- `app/page.tsx` — Dashboard with content list
- `app/review/[token]/page.tsx` — Client approval page
- `features/content/service.ts` — DB operations
- `supabase/setup.sql` — Database schema