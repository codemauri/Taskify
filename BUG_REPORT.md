# Bug Report - Taskify

This document catalogs known bugs and improvement opportunities identified in the Taskify codebase.

---

## Table of Contents

1. [Summary](#summary)
2. [Fixed Bugs](#fixed-bugs)
   - [BUG-001: XSS Vulnerability in Project Card Component](#fixed-bug-001-xss-vulnerability-in-project-card-component)
   - [BUG-002: Missing Cascade Delete on Project→Task Relationship](#fixed-bug-002-missing-cascade-delete-on-projecttask-relationship)
   - [BUG-003: Incorrect Task Count in Search Results](#fixed-bug-003-incorrect-task-count-in-search-results)
   - [BUG-004: Misleading Empty State Message When Filtering](#fixed-bug-004-misleading-empty-state-message-when-filtering)
   - [BUG-005: Callback URL Not Used After Sign-In](#fixed-bug-005-callback-url-not-used-after-sign-in)
3. [Open Items - Defensive Coding](#open-items---defensive-coding)
4. [Open Items - Future Compatibility](#open-items---future-compatibility)
5. [Open Items - Improvements](#open-items---improvements)
   - [Error Handling & User Feedback](#error-handling--user-feedback)
   - [UX Improvements](#ux-improvements)
   - [Performance & Scalability](#performance--scalability)
   - [Accessibility](#accessibility)
   - [Validation & Security](#validation--security)
   - [Code Quality](#code-quality)
   - [Responsive Design & SEO](#responsive-design--seo)
6. [Changelog](#changelog)

---

## Summary
[↑ Back to TOC](#table-of-contents)

| Category              | Count  | Fixed | Open   |
|-----------------------|--------|-------|--------|
| Bugs (UI-triggerable) | 5      | 5     | 0      |
| Defensive Coding      | 4      | 0     | 4      |
| Future Compatibility  | 1      | 0     | 1      |
| Improvements          | 31     | 0     | 31     |
| **Total**             | **41** | **5** | **36** |

---

## Fixed Bugs
[↑ Back to TOC](#table-of-contents)

### [FIXED] BUG-001: XSS Vulnerability in Project Card Component
[↑ Back to TOC](#table-of-contents)

| Field        | Value                         |
|--------------|-------------------------------|
| **Category** | Bug (UI-triggerable)          |
| **Severity** | Critical                      |
| **Status**   | Fixed                         |
| **File**     | `components/project-card.tsx` |

**Description:** Missing HTML sanitization when rendering project description allowed stored XSS attacks.

**Fix Applied:** Added `DOMPurify.sanitize()` to sanitize HTML before rendering.

---

### [FIXED] BUG-002: Missing Cascade Delete on Project→Task Relationship
[↑ Back to TOC](#table-of-contents)

| Field        | Value                  |
|--------------|------------------------|
| **Category** | Bug (UI-triggerable)   |
| **Severity** | Critical               |
| **Status**   | Fixed                  |
| **File**     | `prisma/schema.prisma` |

**Description:** Deleting a project with tasks failed with foreign key constraint error.

**Fix Applied:** Added `onDelete: Cascade` to the Task→Project relation.

---

### [FIXED] BUG-003: Incorrect Task Count in Search Results
[↑ Back to TOC](#table-of-contents)

| Field        | Value                                              |
|--------------|----------------------------------------------------|
| **Category** | Bug (UI-triggerable)                               |
| **Severity** | Medium                                             |
| **Status**   | Fixed                                              |
| **Files**    | `lib/services.ts`, `components/project-search.tsx` |

**Description:** Search results always displayed "0 tasks" for every project regardless of actual task count.

**Root Cause:** `searchProjects` returned `Project[]` without `_count`, and the component hardcoded `_count: { tasks: 0 }`.

**Fix Applied:** Updated `searchProjects` to return `ProjectWithTaskCount[]` with actual task counts.

---

### [FIXED] BUG-004: Misleading Empty State Message When Filtering
[↑ Back to TOC](#table-of-contents)

| Field        | Value                      |
|--------------|----------------------------|
| **Category** | Bug (UI-triggerable)       |
| **Severity** | Low                        |
| **Status**   | Fixed                      |
| **File**     | `components/task-list.tsx` |

**Description:** When filtering tasks by status with no matches, message said "No tasks yet. Add your first task to get started!" even though tasks existed in other statuses.

**Fix Applied:** Changed message to neutral "No tasks to display."

---

### [FIXED] BUG-005: Callback URL Not Used After Sign-In
[↑ Back to TOC](#table-of-contents)

| Field        | Value                  |
|--------------|------------------------|
| **Category** | Bug (UI-triggerable)   |
| **Severity** | Medium                 |
| **Status**   | Fixed                  |
| **File**     | `app/sign-in/page.tsx` |

**Description:** When redirected to sign-in from a protected page, users landed on home page after signing in instead of their intended destination.

**Root Cause:** `callbackUrl` search parameter was set by proxy but never read by sign-in page.

**Fix Applied:** Sign-in page now reads `callbackUrl` from search params and redirects there after successful authentication.

---

## Open Items - Defensive Coding
[↑ Back to TOC](#table-of-contents)

*These protect against API manipulation but cannot be triggered through normal UI usage.*

---

### DEF-001: Missing Status ID Validation
[↑ Back to TOC](#table-of-contents)

| Field     | Value            |
|-----------|------------------|
| **File**  | `app/actions.ts` |
| **Lines** | 91-93            |

**Description:** When creating a task, statusId is not validated against database records before use.

**Why Not UI-Triggerable:** UI dropdown only shows valid statuses from the database.

**Impact:** Only exploitable via direct API manipulation.

---

### DEF-002: Silent Constraint Violation on Task Update
[↑ Back to TOC](#table-of-contents)

| Field     | Value             |
|-----------|-------------------|
| **File**  | `lib/services.ts` |
| **Lines** | 195-224           |

**Description:** Invalid statusId on task update causes unclear error message.

**Why Not UI-Triggerable:** Same as DEF-001 - UI only provides valid options.

---

### DEF-003: Unsafe Type Casting for Errors
[↑ Back to TOC](#table-of-contents)

| Field     | Value                                        |
|-----------|----------------------------------------------|
| **Files** | `sign-in/page.tsx:50`, `sign-up/page.tsx:47` |

**Description:** Type assertion without proper type guard for error objects.

**Why Not UI-Triggerable:** Auth library errors have consistent structure in practice.

---

### DEF-004: Unhandled Promise Rejection in useEffect
[↑ Back to TOC](#table-of-contents)

| Field     | Value                             |
|-----------|-----------------------------------|
| **File**  | `components/edit-task-dialog.tsx` |
| **Lines** | 37-39                             |

**Description:** Task status fetch has no error handling.

**Why Not UI-Triggerable:** Only fails if server is completely down when opening dialog.

---

## Open Items - Future Compatibility
[↑ Back to TOC](#table-of-contents)

### FUT-001: Deprecated Event Handler
[↑ Back to TOC](#table-of-contents)

| Field    | Value                           |
|----------|---------------------------------|
| **File** | `components/project-search.tsx` |
| **Line** | 51                              |

**Description:** Using deprecated `onKeyPress` event handler.

**Impact:** Works today, will break in future React versions.

**Fix:** Replace `onKeyPress` with `onKeyDown`.

---

## Open Items - Improvements
[↑ Back to TOC](#table-of-contents)

*These are enhancements that would improve UX, performance, or code quality but are not bugs.*

### Error Handling & User Feedback
[↑ Back to TOC](#table-of-contents)

| ID      | Description                                   | File(s)                              |
|---------|-----------------------------------------------|--------------------------------------|
| IMP-001 | Missing error boundary components             | Application-wide                     |
| IMP-002 | No error feedback in Create Project dialog    | `create-project-dialog.tsx`          |
| IMP-003 | No error feedback in Create Task dialog       | `create-task-dialog.tsx`             |
| IMP-004 | No error feedback in Edit Project dialog      | `edit-project-dialog.tsx`            |
| IMP-005 | No error feedback in Edit Task dialog         | `edit-task-dialog.tsx`               |
| IMP-006 | Silent null return on missing session (pages) | `page.tsx`, `projects/[id]/page.tsx` |
| IMP-007 | Generic error message in search               | `project-search.tsx`                 |

### UX Improvements
[↑ Back to TOC](#table-of-contents)

| ID      | Description                              | File(s)                                           |
|---------|------------------------------------------|---------------------------------------------------|
| IMP-008 | Form data not cleared after submission   | Dialog components                                 |
| IMP-009 | Native confirm() for destructive actions | `edit-project-dialog.tsx`, `edit-task-dialog.tsx` |
| IMP-010 | No loading state for task statuses       | `edit-task-dialog.tsx`                            |
| IMP-011 | No custom 404 page                       | Missing `app/not-found.tsx`                       |
| IMP-012 | No unsaved changes warning               | Dialog components                                 |
| IMP-013 | No optimistic UI updates                 | All mutations                                     |
| IMP-014 | Dialog state issues on page navigation   | Dialog components                                 |

### Performance & Scalability
[↑ Back to TOC](#table-of-contents)

| ID      | Description                             | File(s)                           |
|---------|-----------------------------------------|-----------------------------------|
| IMP-015 | Race condition in project search        | `project-search.tsx`              |
| IMP-016 | Race condition in concurrent delete     | `lib/services.ts`                 |
| IMP-017 | Missing database indexes                | `prisma/schema.prisma`            |
| IMP-018 | No pagination for tasks                 | `lib/services.ts`                 |
| IMP-019 | Missing environment variable validation | `lib/auth-client.ts`, `lib/db.ts` |

### Accessibility
[↑ Back to TOC](#table-of-contents)

| ID      | Description                     | File(s)                                           |
|---------|---------------------------------|---------------------------------------------------|
| IMP-020 | Missing ARIA labels             | `header.tsx`, `task-list.tsx`, `project-card.tsx` |
| IMP-021 | Missing focus indicators        | `header.tsx`                                      |
| IMP-022 | Missing form label associations | Dialog components                                 |

### Validation & Security
[↑ Back to TOC](#table-of-contents)

| ID      | Description                       | File(s)            |
|---------|-----------------------------------|--------------------|
| IMP-023 | No password complexity validation | `sign-up/page.tsx` |
| IMP-024 | Missing input length validation   | Dialog components  |
| IMP-025 | Hardcoded demo credentials        | `prisma/seed.ts`   |

### Code Quality
[↑ Back to TOC](#table-of-contents)

| ID      | Description                         | File(s)                                |
|---------|-------------------------------------|----------------------------------------|
| IMP-026 | Inefficient date handling           | `lib/services.ts`                      |
| IMP-027 | Empty className attributes          | `sign-in/page.tsx`, `sign-up/page.tsx` |
| IMP-028 | Inconsistent error handling pattern | Auth pages                             |

### Responsive Design & SEO
[↑ Back to TOC](#table-of-contents)

| ID      | Description                | File(s)              |
|---------|----------------------------|----------------------|
| IMP-029 | Fixed width not responsive | `project-search.tsx` |
| IMP-030 | Missing meta tags for SEO  | `app/layout.tsx`     |

---

## Changelog
[↑ Back to TOC](#table-of-contents)

| Date       | ID      | Action | Notes                                     |
|------------|---------|--------|-------------------------------------------|
| 2026-01-08 | BUG-005 | Fixed  | Sign-in now uses callbackUrl for redirect |
| 2026-01-08 | BUG-004 | Fixed  | Changed empty state to neutral message    |
| 2026-01-08 | BUG-003 | Fixed  | Search now returns actual task counts     |
| 2026-01-08 | BUG-002 | Fixed  | Added onDelete: Cascade to Task→Project   |
| 2026-01-05 | BUG-001 | Fixed  | Added DOMPurify sanitization              |
