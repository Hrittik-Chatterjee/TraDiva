# TraDiva Project Tracker

This file tracks the status of all granular tasks in the TraDiva project. Mark items as completed (`[x]`) and specify the commit hash/description as each is done.

---

## Current Status
- **Overall Progress**: 50% (Milestones 1 to 5 Complete, Milestones 6 to 10 Pending)
- **Current Milestone**: Milestone 6: Cloudflare R2 Media Storage Integration

---

## Roadmap

### Core Setup & Document Initialization
- [x] Create `context.md` in root directory
- [x] Initialize `TRACKER.MD` in root directory (This task)
- [x] Create custom agent onboarding skill at `.agents/skills/tradiva-onboarding/SKILL.md`

### Milestone 1: Core Infrastructure Setup

#### Milestone 1.1: Next.js & TypeScript Base Initialization
- [x] Inspect `npx create-next-app@latest --help` options
- [x] Initialize Next.js 15 in `./` using non-interactive flags (TypeScript, ESLint, App Router, src directory, no Tailwind v3)
- [x] Configure strict TypeScript rules in `tsconfig.json`
- [x] Verify clean compilation via `npm run build`
- [x] Git Commit: `chore: initialize Next.js 15 project with TypeScript`

#### Milestone 1.2: Tailwind CSS v4 Integration
- [x] Install Tailwind CSS v4 and PostCSS packages (`@tailwindcss/postcss`, `postcss`)
- [x] Update `globals.css` with color palette, typography, and shape tokens matching `DESIGN.md`
- [x] Verify Tailwind v4 compilation by running `npm run build`
- [x] Git Commit: `feat: install and configure Tailwind CSS v4 with Miro design tokens`

#### Milestone 1.3: Drizzle ORM & Neon Client Setup (PG 18)
- [x] Install `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit`, and `pg`
- [x] Create `db/index.ts` with connection pooling
- [x] Create `db/schema.ts` (empty schemas, preparing for auth)
- [x] Create `drizzle.config.ts`
- [x] Generate initial migration files
- [x] Run migration using `drizzle-kit push` or `migrate` (Pushed to Neon PG 18)
- [x] Git Commit: `feat: configure Neon database connection and Drizzle ORM`

#### Milestone 1.4: Better Auth Configuration (Email, Google, Phone)
- [x] Install `better-auth`
- [x] Define Better Auth tables in `db/schema.ts` (user, session, account, verification)
- [x] Setup `lib/auth.ts` with Email/Password, Google OAuth, and Phone Auth (using a mock SMS logger)
- [x] Add route handler `app/api/auth/[...better-auth]/route.ts`
- [x] Verify API endpoints compile and respond
- [x] Git Commit: `feat: integrate Better Auth with Email, Google, and Phone providers`

#### Milestone 1.5: PostHog Analytics Setup
- [x] Install `posthog-js`
- [x] Set up client-side `PostHogProvider`
- [x] Set up server-side PostHog tracker client in `services/posthog.ts`
- [x] Inject `PostHogProvider` into root layout
- [x] Git Commit: `feat: configure PostHog analytics provider`

#### Milestone 1.6: Base Layout & Header/Footer (Miro Design)
- [x] Create Miro-style navbar (`Top Navigation`) with yellow wordmark logo, navigation links, and login CTA
- [x] Create dense multi-column footer (`footer-region`)
- [x] Setup global layouts with providers, loading boundaries, and error boundaries
- [x] Visually verify elements in browser DevTools
- [x] Git Commit: `feat: build base layout, navbar, and footer with Miro design language`

#### Milestone 1.7: Manipuri Culture & OKLCH Theme Integration
- [x] Update `DESIGN.md` colors and illustration plan
- [x] Update `context.md` with new project goals & styles
- [x] Configure OKLCH colors and float/wave/blink keyframes in `globals.css`
- [x] Create inline SVG placeholders with traditional Manipuri patterns (e.g. Moirang Phee borders)
- [x] Apply new theme to `layout.tsx` and `page.tsx`
- [x] Git Commit: `feat: integrate Manipuri culture branding and OKLCH color theme`

### Milestone 2: Catalog Management & Admin Marketing Analytics

#### Milestone 2.1: DB Schema & Migrations for Catalog
- [x] Create database tables for `categories`, `brands`, `products`, and `inventory` in `db/schema.ts`
- [x] Generate PostgreSQL 18 migration using `drizzle-kit generate`
- [x] Push schema changes to Neon PG 18 using `drizzle-kit push`
- [x] Git Commit: `feat: create database schema for catalog (products, categories, brands, inventory)`

#### Milestone 2.2: Mock Image Upload API Route
- [x] Create `app/api/upload/route.ts` to support local file uploads to `/public/uploads/`
- [x] Verify image upload API returns public URLs
- [x] Git Commit: `feat: build local mock image upload API route`

#### Milestone 2.3: Zod Validation & Database Services
- [x] Define Zod validation schemas for products, categories, and brands in `src/lib/validation/catalog.ts`
- [x] Create database query and mutation services in `src/services/catalog.ts`
- [x] Git Commit: `feat: build validation schemas and database services for catalog CRUD`

#### Milestone 2.4: Admin Layout & Categories/Brands CRUD UI
- [x] Create admin layouts and navigation sidebar in `src/app/(admin)/admin/layout.tsx`
- [x] Create Category list & creation form at `src/app/(admin)/admin/categories/page.tsx`
- [x] Create Brand list & creation form at `src/app/(admin)/admin/brands/page.tsx`
- [x] Git Commit: `feat: build admin sidebar layout and categories/brands management UI`

#### Milestone 2.5: Admin Products CRUD UI
- [x] Create Product list and inventory status page at `src/app/(admin)/admin/products/page.tsx`
- [x] Create Product creation form at `src/app/(admin)/admin/products/new/page.tsx` (with image selector and inventory fields)
- [x] Create Product edit page
- [x] Git Commit: `feat: build admin products and inventory management UI`

#### Milestone 2.6: Analytics Tracking & Build Verification
- [x] Track admin catalog actions (create product, update inventory) in PostHog
- [x] Run typescript typechecks and Next.js production build verification
- [x] Git Commit: `feat: add admin catalog analytics tracking and verify build`

### Milestone 3: Customer Storefront (Browsing, Search, Filters)

#### Milestone 3.1: Storefront Catalog Listing (Products & Categories/Brands)
- [x] Create the storefront `/catalog` page layout
- [x] Render active products in a responsive grid card view
- [x] Git Commit: `feat: create customer storefront catalog page layout`

#### Milestone 3.2: Storefront Search & Sorting
- [x] Implement search bar utilizing URL query parameters (`?q=xxx`)
- [x] Implement sort selector (Price low-high, high-low, newest) using URL sort parameters
- [x] Git Commit: `feat: implement catalog search and sorting parameters`

#### Milestone 3.3: Storefront Filters (Categories, Brands, Availability)
- [x] Create sidebar category and brand checkbox selectors that sync with URL parameters
- [x] Implement database-level SQL filtering in `getStorefrontProducts` service for search, category, brand, and price queries
- [x] Git Commit: `feat: build catalog sidebar filters and SQL-level filter queries`

#### Milestone 3.4: Product Detail Page & SEO Metadata
- [x] Create dynamic route `/products/[slug]` detail page
- [x] Build interactive image gallery client component `ProductGallery`
- [x] Ingest Dynamic SEO Document titles and JSON-LD Product Schema markup
- [x] Git Commit: `feat: build product details page with interactive gallery and SEO schema`

#### Milestone 3.5: PostHog Storefront Analytics & Build Checks
- [x] Track storefront actions (search, filter changes, product views) in PostHog
- [x] Run typescript checks and Next.js production build verification
- [x] Git Commit: `feat: add customer storefront analytics tracking and verify build`

### Milestone 4: Shopping Cart & Session Storage

#### Milestone 4.1: Cart State Management & Persistence
- [x] Create `CartItem` and `CartContext` types
- [x] Build client-side context provider `CartProvider` in `src/components/providers/cart-provider.tsx` with asynchronous `localStorage` loading and stock boundaries
- [x] Wrap root layout in `CartProvider` in `src/app/layout.tsx`
- [x] Git Commit: `feat: build cart state context and provider with local storage sync`

#### Milestone 4.2: Add to Cart Button & Quantity Selector
- [x] Build client-side `<AddToCartButton>` component with quantity controls in `src/components/storefront/AddToCartButton.tsx`
- [x] Replace static button on product detail pages in `src/app/products/[slug]/page.tsx`
- [x] Git Commit: `feat: implement interactive AddToCartButton component on details page`

#### Milestone 4.3: Slide-over Cart Drawer & Full Review Page
- [x] Build drawer slide-over panel `<CartSheet>` in `src/components/storefront/CartSheet.tsx` with scrollable items list, subtotals, and traditional Manipuri empty state illustration
- [x] Mount `CartSheet` globally in the root layout
- [x] Create a full-page checkout review path at `src/app/cart/page.tsx`
- [x] Git Commit: `feat: design slide-over cart drawer and full-screen review page`

#### Milestone 4.4: Quality Assurance, Type Safety Cleanup & Build Verification
- [x] Track all cart mutations and views in PostHog analytics
- [x] Clean up all unused variables, imports, and forbidden `any` typecasts across catalog action files and filter layouts
- [x] Run typescript check and verify production build compilation succeeds cleanly
- [x] Git Commit: `feat: clean up ts/lint warnings, implement analytics, and verify production build`

### Milestone 5: Checkout, Mock Payments & Order Confirmation

#### Milestone 5.1: Database Schema & Migrations for Orders
- [x] Create `orders` and `order_items` tables in `db/schema.ts` (Completed)
- [x] Generate PostgreSQL 18 migration using `drizzle-kit generate` (Completed)
- [x] Push/apply schema changes to the database (Completed)
- [x] Git Commit: `feat: add orders and order_items tables to database schema`

#### Milestone 5.2: Checkout Validation & Server Actions
- [x] Create `checkoutSchema` in `src/lib/validation/checkout.ts` (Completed)
- [x] Create `createOrderAction` in `src/app/actions/order.ts` to process inventory updates and save the order (Completed)
- [x] Git Commit: `feat: build checkout validation and createOrder server action`

#### Milestone 5.3: Checkout Shipping Form & Order Review UI
- [x] Create `/checkout` shipping details form and order summary panel (Completed)
- [x] Support guest checkout by letting non-logged-in users enter their email (Completed)
- [x] Pre-populate address for active logged-in users (Completed)
- [x] Git Commit: `feat: design storefront checkout shipping and order review page`

#### Milestone 5.4: Mock Payments Processing (Stripe Emulation)
- [x] Create simulated mock credit card form on `/checkout` (Completed)
- [x] Handle mock transaction responses and update database order status to `paid` (Completed)
- [x] Git Commit: `feat: implement mock credit card processing and order payment status updates`

#### Milestone 5.5: Order Confirmation Page & Order History
- [x] Create `/orders/[id]/confirmation` page with traditional illustrations and order summaries (Completed)
- [x] Create customer orders listing page `/orders` for viewing transaction history (Completed)
- [x] Git Commit: `feat: build order confirmation page and orders history UI`

#### Milestone 5.6: Order PostHog Analytics & Build Verification
- [x] Track `checkout_initiated`, `payment_processed`, and `order_placed` events in PostHog (Completed)
- [x] Run types checks and verify production build compilation succeeds cleanly (Completed)
- [x] Git Commit: `feat: add order checkout analytics and verify production build`

### Milestone 6: Cloudflare R2 Media Storage Integration
- [ ] Set up R2 configuration variables in `.env`
- [ ] Initialize `@aws-sdk/client-s3` client in `src/lib/r2.ts`
- [ ] Replace mock upload route `api/upload/route.ts` with direct R2 uploads
- [ ] Update admin Category/Product forms to point to new R2 endpoints
- [ ] Delete mock `/public/uploads/` contents and verify build
- [ ] Git Commit: `feat: integrate Cloudflare R2 media storage uploads`

### Milestone 7: Admin Order Fulfillment Dashboard
- [ ] Create `/admin/orders` dashboard orders list page
- [ ] Create detailed order view at `/admin/orders/[id]`
- [ ] Create server actions for fulfillment: `shipOrderAction`, `deliverOrderAction`, `cancelOrderAction`
- [ ] Hook up PostHog tracking events for status updates and verify build
- [ ] Git Commit: `feat: build admin order fulfillment dashboard`

### Milestone 8: Production bKash Mobile Payment Integration
- [ ] Set up bKash environment credentials in `.env`
- [ ] Build token grant and authorization service
- [ ] Build `/api/bkash/create` payment creation route
- [ ] Build `/api/bkash/callback` query and execute route
- [ ] Integrate bKash redirection/modal checkout UI in `/checkout`
- [ ] Store bKash transaction details in `paymentIntentId` and verify build
- [ ] Git Commit: `feat: integrate production bKash payment gateway`

### Milestone 9: Customer Accounts Order History & Profile Management
- [ ] Build customer `/orders` order history listing
- [ ] Build customer `/profile` personal details page
- [ ] Verify guest order account merging on signup/registration and check build
- [ ] Git Commit: `feat: build customer order history and profile settings`

### Milestone 10: Production Deployment & Performance Tuning
- [ ] Run Lighthouse performance audit and optimize bundle sizes
- [ ] Setup dynamic sitemaps and configure robots.txt
- [ ] Deploy to production hosting environment and verify build
- [ ] Git Commit: `feat: deploy production build and tune sitemaps`

