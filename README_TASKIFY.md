# Taskify - Project Tracking Application

A modern project tracking application built with Next.js, Prisma, SQLite, and shadcn/ui components.

## Features

- **Project Management**: Create, view, and manage multiple projects
- **Task Tracking**: Add, edit, and delete tasks within projects
- **Status Indicators**: Visual status indicators for tasks (In Progress - Blue, Incomplete - Yellow, Done - Green)
- **Filtering & Sorting**: Filter tasks by status with intelligent default sorting
- **Authentication**: Built-in authentication using better-auth
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: SQLite with Prisma ORM
- **Authentication**: better-auth
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tek_innov8ers
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev --name init
```

4. Seed the database with demo data:
```bash
npx tsx scripts/seed.ts
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tek_innov8ers/
├── app/
│   ├── actions.ts              # Server actions for CRUD operations
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (project list)
│   ├── globals.css             # Global styles
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts    # Auth API routes
│   └── projects/
│       └── [id]/
│           └── page.tsx        # Project details page
├── components/
│   ├── create-project-dialog.tsx   # Dialog for creating new projects
│   ├── create-task-dialog.tsx      # Dialog for creating new tasks
│   ├── edit-task-dialog.tsx        # Dialog for editing tasks
│   ├── project-card.tsx            # Project card component
│   ├── task-list.tsx               # Task list component
│   ├── task-filter.tsx             # Task filter component
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── auth.ts                 # Auth server configuration
│   ├── auth-client.ts          # Auth client configuration
│   ├── db.ts                   # Prisma client instance
│   ├── services.ts             # Database operations using $queryRaw
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── dev.db                  # SQLite database
│   └── migrations/             # Database migrations
└── scripts/
    └── seed.ts                 # Database seeding script
```

## Database Schema

### User
- `id` (String, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Project
- `id` (String, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `userId` (String, Foreign Key)
- `tasks` (Task[], One-to-Many)

### Task
- `id` (String, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `status` (String: "Incomplete", "In Progress", "Done")
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `projectId` (String, Foreign Key)

## Key Features Explained

### Task Status Sorting
Tasks are automatically sorted with the following priority:
1. **In Progress** (Blue badge)
2. **Incomplete** (Yellow badge)
3. **Done** (Green badge)

### Database Operations
All database operations use Prisma's `$queryRaw` API for direct SQL execution as requested. This provides:
- Fine-grained control over SQL queries
- Custom sorting and filtering logic
- Efficient database operations

### Authentication
The application uses better-auth with email/password authentication. The demo uses a hardcoded user ID (`demo-user-id`) for development purposes.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx tsx scripts/seed.ts` - Seed database with demo data

## Development Notes

- The application uses Next.js 16 with Turbopack for fast development
- All database queries use raw SQL via Prisma's `$queryRaw` API
- shadcn/ui components are used throughout for consistent UI
- The project follows a server-first architecture with server actions

## Future Enhancements

Potential improvements for the application:
- User authentication and registration flow
- Project sharing and collaboration
- Task assignments and due dates
- Task comments and attachments
- Activity timeline
- Email notifications
- Dark mode toggle
- Export projects to JSON/CSV

## License

MIT
