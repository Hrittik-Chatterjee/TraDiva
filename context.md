# Project Context: TraDiva

This document serves as a persistent history and decision log for the TraDiva ecommerce platform. It provides critical context for any AI coding agent working on this repository, allowing seamless transitions when switching agents.

---

## 1. Project Overview & Philosophy
* **Goal**: Build a scalable, production-ready, SEO-first ecommerce platform from scratch (not a clone or tutorial project).
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

### Design System (Miro Inspiration)
* Follow [DESIGN.md](file:///c:/projects/TraDiva/DESIGN.md) strictly for the layout:
  - Canary yellow (`#ffd02f`) accent tags and logos, but **never** for primary buttons.
  - Black pill-shaped buttons (`#1c1c1e`, `rounded-full`) as the dominant CTA.
  - Pastel feature card backgrounds (rose, teal, coral, yellow) mirroring Miro sticky notes.
  - Strict typography rules (Roobert PRO or geometric sans font stack fallback) and negative letter-spacing for large text.

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
