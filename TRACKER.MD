# TraDiva Project Tracker

This file tracks the status of all granular tasks in the TraDiva project. Mark items as completed (`[x]`) and specify the commit hash/description as each is done.

---

## Current Status
- **Overall Progress**: 0%
- **Current Milestone**: Milestone 1: Core Infrastructure Setup

---

## Roadmap

### Core Setup & Document Initialization
- [x] Create `context.md` in root directory
- [x] Initialize `TRACKER.MD` in root directory (This task)
- [x] Create custom agent onboarding skill at `.agents/skills/tradiva-onboarding/SKILL.md`

### Milestone 1: Core Infrastructure Setup

#### Milestone 1.1: Next.js & TypeScript Base Initialization
- [ ] Inspect `npx create-next-app@latest --help` options
- [ ] Initialize Next.js 15 in `./` using non-interactive flags (TypeScript, ESLint, App Router, src directory, no Tailwind v3)
- [ ] Configure strict TypeScript rules in `tsconfig.json`
- [ ] Verify clean compilation via `npm run build`
- [ ] Git Commit: `chore: initialize Next.js 15 project with TypeScript`

#### Milestone 1.2: Tailwind CSS v4 Integration
- [ ] Install Tailwind CSS v4 and PostCSS packages (`@tailwindcss/postcss`, `postcss`)
- [ ] Update `globals.css` with color palette, typography, and shape tokens matching `DESIGN.md`
- [ ] Verify Tailwind v4 compilation by running `npm run build`
- [ ] Git Commit: `feat: install and configure Tailwind CSS v4 with Miro design tokens`

#### Milestone 1.3: Drizzle ORM & Neon Client Setup (PG 18)
- [ ] Install `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`, and `pg`
- [ ] Create `db/index.ts` with connection pooling
- [ ] Create `db/schema.ts` (empty schemas, preparing for auth)
- [ ] Create `drizzle.config.ts`
- [ ] Generate initial migration files
- [ ] Run migration using `drizzle-kit push` or `migrate`
- [ ] Git Commit: `feat: configure Neon database connection and Drizzle ORM`

#### Milestone 1.4: Better Auth Configuration (Email, Google, Phone)
- [ ] Install `better-auth`
- [ ] Define Better Auth tables in `db/schema.ts` (user, session, account, verification)
- [ ] Setup `lib/auth.ts` with Email/Password, Google OAuth, and Phone Auth (using a mock SMS logger)
- [ ] Add route handler `app/api/auth/[...better-auth]/route.ts`
- [ ] Verify API endpoints compile and respond
- [ ] Git Commit: `feat: integrate Better Auth with Email, Google, and Phone providers`

#### Milestone 1.5: PostHog Analytics Setup
- [ ] Install `posthog-js`
- [ ] Set up client-side `PostHogProvider`
- [ ] Set up server-side PostHog tracker client in `services/posthog.ts`
- [ ] Inject `PostHogProvider` into root layout
- [ ] Git Commit: `feat: configure PostHog analytics provider`

#### Milestone 1.6: Base Layout & Header/Footer (Miro Design)
- [ ] Create Miro-style navbar (`Top Navigation`) with yellow wordmark logo, navigation links, and login CTA
- [ ] Create dense multi-column footer (`footer-region`)
- [ ] Setup global layouts with providers, loading boundaries, and error boundaries
- [ ] Visually verify elements in browser DevTools
- [ ] Git Commit: `feat: build base layout, navbar, and footer with Miro design language`
