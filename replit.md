# RK Institute Management System

A full-stack institute management system built with Next.js 14, Prisma ORM, and PostgreSQL.

## Architecture

- **Framework**: Next.js 14 (App Router, full-stack)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT-based authentication with bcryptjs
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

- `app/` - Next.js App Router pages and API routes
  - `app/api/` - API route handlers
  - `app/admin/` - Admin dashboard pages
  - `app/parent/` - Parent portal pages
  - `app/student/` - Student portal pages
  - `app/teacher/` - Teacher portal pages
- `components/` - Shared React components
- `lib/` - Shared utilities and helpers
- `prisma/` - Database schema and migrations

## Environment

- Port: 5000
- Host: 0.0.0.0
- DB: PostgreSQL (Replit managed, DATABASE_URL env var)
- Config: `.env.local`

## Key Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (managed by Replit)
- `JWT_SECRET` - JWT signing key
- `JWT_EXPIRY` - Token expiry (default: 4h)

## Development

```bash
PORT=5000 npx next dev -p 5000 -H 0.0.0.0
```

## Database

Run migrations: `npx prisma migrate deploy`
Seed data: `npx tsx prisma/seed.ts`

## Default Login Credentials (after seeding)

- Admin: `admin@rkinstitute.com` / `admin123`
- Teacher 1: `teacher1@rkinstitute.com` / `admin123`
- Teacher 2: `teacher2@rkinstitute.com` / `admin123`

## Features

- Student management
- Family/parent portal
- Fee and payment management
- Course management
- Academic logs and assignments
- Reports and analytics
- User roles: ADMIN, TEACHER, PARENT, STUDENT
