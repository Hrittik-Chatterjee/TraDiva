# AGENT.md

## Purpose

You are the coding agent for this project.

Your job is to build and maintain a production-ready ecommerce platform.

Always prioritize maintainability, scalability, readability, security, and performance over writing code quickly.

---

# General Rules

- Build production-ready code only.
- Never generate demo-quality code.
- Never use placeholder implementations unless explicitly requested.
- Never over-engineer.
- Keep solutions simple.
- Prefer clean architecture.
- Build only what is requested.
- Do not implement future roadmap features unless explicitly instructed.

---

# Tech Stack

Always use:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neon PostgreSQL
- Drizzle ORM
- Better Auth
- Cloudflare R2
- PostHog

Do not replace any technology unless explicitly requested.

---

# Code Quality

Always:

- Use TypeScript strict mode.
- Never use `any`.
- Keep functions small.
- Keep files reasonably sized.
- Write reusable components.
- Write reusable utilities.
- Use meaningful names.
- Remove dead code.
- Prefer composition over duplication.

Never:

- Disable TypeScript errors.
- Ignore ESLint errors.
- Ignore build errors.
- Duplicate business logic.
- Create unnecessary abstractions.

---

# Project Structure

Keep business logic separate from UI.

Separate:

- UI
- Database
- Validation
- API
- Services
- Utilities
- Types

Do not mix responsibilities.

---

# Database

Use Drizzle ORM only.

Never write raw SQL unless absolutely necessary.

Always:

- Create migrations
- Validate data before writing
- Use transactions for critical operations

Never trust frontend data.

---

# Authentication

Use Better Auth.

Support:

- Guest Checkout
- Customer Accounts
- Admin Accounts

Customers must never be forced to create an account before checkout.

Guest orders must automatically link to a customer account if they later register using the same email address.

---

# Validation

Validate everything.

Always validate:

- Request body
- Query parameters
- Route parameters

Never trust user input.

---

# Security

Always:

- Sanitize input
- Validate data
- Protect sensitive routes
- Use secure cookies
- Hash passwords
- Prevent SQL Injection
- Prevent XSS
- Prevent CSRF where applicable

Never expose secrets to the client.

---

# UI Rules

Build:
- Alwasy follow DESIGN.md rules
- Mobile first
- Responsive
- Accessible
- Fast

Every page should support:

- Loading state
- Error state
- Empty state

---

# Performance

Prefer:

- Server Components
- Static rendering where possible
- Lazy loading
- Code splitting
- Image optimization

Minimize client-side JavaScript.

---

# Analytics

Use PostHog.

Analytics are part of the feature.

Never postpone analytics implementation.

Track relevant user actions while building each feature.

---

# SEO

Every public page must include:

- Title
- Meta Description
- Canonical URL
- Open Graph
- Structured Data where applicable

Generate:

- sitemap.xml
- robots.txt

Product pages must include Product Schema.

---

# Development Workflow

Every feature must follow this order:

1. Design
2. Database
3. Migration
4. Validation
5. Backend
6. API / Server Action
7. UI
8. Analytics
9. Testing

Do not skip steps.

---

# Dependencies

Before installing a new package:

- Check whether the current stack already solves the problem.
- Prefer fewer dependencies.
- Avoid unnecessary libraries.

---

# Error Handling

Never swallow errors.

Always:

- Return meaningful error messages
- Log unexpected errors
- Handle edge cases
- Handle empty states

---

# Reusability

Before creating:

- Component
- Hook
- Utility
- Service

Check whether one already exists.

Avoid duplicate code.

---

# Agent Behavior

When requirements are unclear:

Ask for clarification.

Do not make assumptions.

Explain architectural trade-offs before making major changes.

Keep changes focused on the current task.

Preserve backward compatibility whenever possible.

---

# Definition of Done

A feature is complete only when:

- Database updated
- Migration created
- Backend implemented
- Validation added
- UI completed
- Mobile responsive
- Accessible
- Error handling added
- Analytics implemented
- TypeScript passes
- ESLint passes
- Build succeeds

Never consider a feature complete if any of these are missing.