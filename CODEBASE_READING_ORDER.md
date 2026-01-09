# Recommended Reading Order for Taskify

## 1. Configuration & Setup (Start Here)
```
1. package.json          → Dependencies, scripts, project overview
2. prisma/schema.prisma  → Database models (User, Project, Task, TaskStatus)
3. .env                  → Environment variables (if exists)
```

## 2. Core Infrastructure
```
4. lib/db.ts             → Prisma client setup
5. lib/auth.ts           → Better Auth configuration
6. lib/auth-client.ts    → Client-side auth helper
7. lib/utils.ts          → Utility functions
```

## 3. Data Layer (Business Logic)
```
8. lib/services.ts       → All database operations (CRUD for projects/tasks)
```

## 4. Server Actions (API Layer)
```
9. app/actions.ts        → Server actions that call services
```

## 5. Authentication Flow
```
10. proxy.ts              → Auth middleware/proxy
11. app/sign-up/page.tsx  → User registration
12. app/sign-in/page.tsx  → User login
```

## 6. Main Application Pages
```
13. app/layout.tsx            → Root layout
14. app/page.tsx              → Home page (project list)
15. app/projects/[id]/page.tsx → Project detail page
```

## 7. Components (UI Layer)
```
16. components/header.tsx           → Navigation header
17. components/project-card.tsx     → Project display card
18. components/project-search.tsx   → Search functionality
19. components/create-project-dialog.tsx → Create project form
20. components/edit-project-dialog.tsx   → Edit project form
21. components/task-list.tsx        → Task display
22. components/task-filter.tsx      → Task filtering
23. components/create-task-dialog.tsx → Create task form
24. components/edit-task-dialog.tsx   → Edit task form
25. components/ui/*                 → shadcn/ui primitives
```

---

## Visual Flow

```
User Request
     ↓
[Pages] app/page.tsx, app/projects/[id]/page.tsx
     ↓
[Server Actions] app/actions.ts
     ↓
[Services] lib/services.ts
     ↓
[Database] Prisma → SQLite
```

```
Authentication Flow:
sign-up/sign-in → lib/auth.ts → proxy.ts → protected pages
```
