# AGENTS.md

## Context
Next.js + Supabase Content Approval Engine.

## Scripts
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run test` - Run tests

## Structure
- `/app` - Pages (dashboard, review)
- `/components` - UI components
- `/features/content` - Domain logic
- `/lib` - Supabase client
- `/supabase/` - SQL schemas

## Key Files
- app/page.tsx - Dashboard
- app/review/[token]/page.tsx - Client page
- features/content/service.ts - DB operations
- supabase/setup.sql - Database schema