# replit.md

## Overview

EventBadge is a full-stack web application for managing event badges with QR codes. It allows event administrators to create badges for attendees, generate QR codes that link to a public schedule view, manage event schedules, and track badge scan statistics. The app has two main interfaces: a public-facing page where scanned QR codes display the event schedule and badge holder info, and an admin panel for managing badges, schedules, and admin users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state (caching, mutations, refetching)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support), custom fonts (Outfit for display, DM Sans for body)
- **Forms**: React Hook Form with Zod resolvers for validation
- **Animations**: Framer Motion for page transitions
- **QR Codes**: `next-qrcode` package for generating QR code canvases
- **Charts**: Recharts for scan statistics visualization
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript, executed via `tsx`
- **API Design**: RESTful JSON API under `/api/` prefix. Route definitions are centralized in `shared/routes.ts` with Zod schemas for input validation and response typing, shared between client and server.
- **Authentication**: Replit Auth via OpenID Connect (OIDC). Sessions stored in PostgreSQL via `connect-pg-simple`. Passport.js handles the auth strategy. Admin access is gated by email whitelist in the `admins` table, with auto-bootstrapping of the first admin.
- **Development**: Vite dev server runs as middleware on the Express server with HMR
- **Production**: Client is built with Vite to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Shared Code (`shared/`)
- **Schema**: `shared/schema.ts` defines all database tables and Zod validation schemas using Drizzle ORM
- **Routes**: `shared/routes.ts` defines API route contracts (paths, methods, input/output schemas) used by both client and server
- **Auth Models**: `shared/models/auth.ts` defines user and session tables required by Replit Auth

### Database
- **Database**: PostgreSQL (required, accessed via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod conversion
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Tables**:
  - `users` - Replit Auth user profiles (id, email, name, profile image)
  - `sessions` - Express session storage for Replit Auth
  - `admins` - Admin email whitelist with passwords
  - `badges` - QR code badges with name, unique qrCodeId, scan count, timestamps
  - `schedule` - Event schedule items with time, activity, and sort order

### Key Design Patterns
- **Typed API contracts**: Route definitions in `shared/routes.ts` are consumed by both frontend hooks and backend handlers, ensuring type safety across the stack
- **Storage abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations, with `DatabaseStorage` as the implementation
- **Auth middleware**: `requireAdmin` middleware checks Replit Auth + admin whitelist before allowing access to admin endpoints
- **Auto-admin bootstrap**: First authenticated user is automatically made an admin if the admins table is empty

### Build Process
- `npm run dev` - Starts development server with Vite HMR
- `npm run build` - Builds client (Vite) and server (esbuild) to `dist/`
- `npm start` - Runs production build
- `npm run db:push` - Pushes schema changes to database

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Used for all data storage and session management.
- **Replit Auth (OpenID Connect)**: Authentication provider. Requires `ISSUER_URL` (defaults to `https://replit.com/oidc`), `REPL_ID`, and `SESSION_SECRET` environment variables.
- **Google Fonts**: Loads Outfit, DM Sans, Fira Code, Geist Mono, and Architects Daughter fonts from Google Fonts CDN.
- **UI Avatars API**: Fallback avatar generation via `https://ui-avatars.com/api/` when user has no profile image.
- **Replit Vite Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` for development experience on Replit.