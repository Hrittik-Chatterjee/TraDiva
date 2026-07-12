# Project Context: TraDiva

This document serves as a persistent history and decision log for the TraDiva ecommerce platform. It provides critical context for any AI coding agent working on this repository, allowing seamless transitions when switching agents.

---

## 1. Project Overview & Philosophy
* **Goal**: Build a scalable, production-ready, SEO-first ecommerce platform from scratch for **TraDiva** (traditional Manipuri attire, clothing, and cultural products).
* **Culture & Heritage**: The platform design reflects Manipuri culture and heritage through custom vector illustrations, traditional textile borders (e.g. Moirang Phee triangular patterns), and subtle lightweight CSS animations of cartoon characters.
* **Process**: Incremental development, feature-by-feature completion. Write clean, production-grade code without placeholder implementations unless requested.
* **Development Flow**: After completing each granular task, make a Git commit. Keep code minimal and adhere to the Ponytail senior dev philosophy.

---

## 2. Tech Stack & Infrastructure
* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui.
* **Database**: Neon serverless PostgreSQL, version **PostgreSQL 18** (latest stable).
* **ORM**: Drizzle ORM.
* **Authentication**: Better Auth.
* **Storage**: Mock local uploads first, migrate to Cloudflare R2 later.
* **Payments**: Mock transactions first, migrate to Stripe later.
* **Analytics**: PostHog integrated into all client-side and server-side actions.

---

## 3. Key Design Decisions

### Better Auth vs Neon Auth
* **Better Auth Chosen**: Stored in Drizzle tables (`user`, `session`, `account`, `verification`) within our own PostgreSQL 18 database.
* **Rationale**: Essential for the requirement where guest orders must automatically link to a customer account if they later register using the same email address. This database-level merge is performed via a simple, safe transaction.

### Design System (Manipuri Style + OKLCH Colors)
* Follow [DESIGN.md](file:///c:/projects/TraDiva/DESIGN.md) strictly for layout, color, and typography hierarchy:
  - **White (Primary Background)**: `oklch(97.7% 0.011 31.1)`
  - **Black (Text, Buttons, Key UI)**: `oklch(24.5% 0.008 17.7)`
  - **Pink (Accent Color - second most dominant)**: 
    * Dark Pink (active/dominant accent): `oklch(81.9% 0.101 24.7)`
    * Light Pink (borders/highlights): `oklch(85.1% 0.081 26.4)`
    * Lightest Pink (soft tags/backgrounds): `oklch(89.8% 0.057 44.1)`
  - **Yellow & Blue (Preserved Supporting Accents)**: Yellow (`#ffd02f`) and Blue (`#4262ff`) used where appropriate.
  - **Illustrations**: Animated Manipuri cartoon characters (especially girls wearing traditional Manipuri attire) in headers, footers, empty states, and promotional segments.
  - **Animations**: Subtle, hardware-accelerated CSS animations (`gentle-float`, `gentle-wave`, `soft-blink`) applied to SVGs.
  - **Patterns**: Traditional Manipuri textile motifs (serrated/triangular *Moirang Phee* borders) utilized on dividers and UI cards.
  - Strict typography rules (Roobert PRO or geometric sans font stack fallback) and negative letter-spacing for large text.

### Shopping Cart & Persistence
* **State Management**: Developed `CartProvider` using React Context for global availability.
* **Persistence**: Synchronizes state with client-side `localStorage`. Solved React hydration alerts by deferring the state initialization using `setTimeout` on mount.
* **Displacement Bug**: Replaced absolute viewport classes with explicit fixed-pixel inline CSS configurations on the cart sheet drawer container to prevent rendering shifts.

---

## 4. Instructions for Incoming Agents
1. **Read Core Files First**: Before writing any code, always read `AGENTS.md`, `DESIGN.md`, `context.md`, and `TRACKER.MD`.
2. **Follow Ponytail Philosophy**:
   - Apply YAGNI (You Aren't Gonna Need It).
   - Use standard library/native features instead of pulling new dependencies.
   - Build the absolute minimum that works cleanly. No unnecessary abstractions.
   - If you make a deliberate simplification to cut a corner, label it with a comment: `// ponytail: [ceiling and upgrade path]`.
3. **Commit Checkpoints**: Make a clean, focused Git commit after every completed task listed in `TRACKER.MD`.
4. **Update Logs**: Keep `TRACKER.MD` and `context.md` updated as you make progress or change architectural directions.
