# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taskify is a project and task management application built with Next.js 16, Prisma ORM, and Better Auth. **This codebase contains intentional security vulnerabilities for educational purposes** - see `vulnerabilities.md` for exploitation details.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: SQLite with Prisma ORM v7
- **Authentication**: Better Auth (email/password)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Language**: TypeScript

## Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint

# Database
npm run db:init          # Initialize database with migrations
npm run db:migrate       # Run Prisma migrations
npm run db:generate      # Generate Prisma Client
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database with demo data
npm run db:reset         # Reset database to clean state
npm run db:reset-seed    # Reset and seed in one command

# Auth
npm run better-auth:secret   # Generate BETTER_AUTH_SECRET
npm run better-auth:migrate  # Better Auth migrations
```

## Initial Setup

```bash
npm install
npm run better-auth:secret   # Copy output to .env as BETTER_AUTH_SECRET
npm run db:init
npm run db:seed              # Optional: creates demo users
npm run dev
```

**Demo credentials** (after seeding):
- john.doe@taskify.com / password123
- jane.doe@taskify.com / password123

## Architecture

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `app/actions.ts` - Server actions for all mutations (create/update/delete)
- `lib/services.ts` - Business logic and database operations
- `lib/auth.ts` - Better Auth configuration
- `lib/db.ts` - Prisma client setup
- `components/` - React components (feature components + `ui/` for shadcn primitives)
- `prisma/schema.prisma` - Database models

### Data Flow
1. UI components call server actions from `app/actions.ts`
2. Server actions call service functions from `lib/services.ts`
3. Services use Prisma client to interact with SQLite database

### Database Models
- **User** - Authentication user with email, name, sessions
- **Project** - User-owned projects with title/description
- **Task** - Tasks belonging to projects with status
- **TaskStatus** - Predefined statuses (To Do, In Progress, Done)

## Intentional Security Vulnerabilities

**For educational purposes only** - see `vulnerabilities.md` for full exploitation steps.

1. **SQL Injection** (`lib/services.ts:searchProjects`) - Raw SQL concatenation with user input via `$queryRawUnsafe`

2. **XSS** (`app/projects/[id]/page.tsx`) - Project descriptions rendered with `dangerouslySetInnerHTML` without sanitization

3. **IDOR** (`lib/services.ts:getProjectById`) - No ownership verification; any user can access any project by ID

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="<run npm run better-auth:secret>"
```
