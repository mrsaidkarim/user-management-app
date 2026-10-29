# User Management App

A full-stack user management application built with Next.js, TypeScript, PostgreSQL, Prisma, and Zod.

## Features

- List, create, edit, and delete users.
- Search users by name with debouncing.
- Filter users by role.
- Paginate results with selectable page sizes (10, 20, and 50).
- Validate form and API inputs using Zod.
- Display statistics for filtered users, including count, total salary, average salary, and average seniority.
- Use decimal arithmetic for salary calculations.
- Reuse pagination on the Users and Projects pages.
- Run the application and PostgreSQL using Docker Compose.

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers and service layer
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Decimal calculations:** decimal.js
- **Testing:** Node.js test runner and tsx
- **Containerization:** Docker and Docker Compose

## Requirements

For local development, install:

- Node.js
- npm
- Docker and Docker Compose (recommended for running PostgreSQL)

## Getting Started

### Option 1: Run with Docker Compose

Start the application and database:

```bash
docker compose up --build
```

The application container waits for PostgreSQL to become healthy, applies Prisma migrations, runs the seed script, and starts Next.js.

Open:

- Application: http://localhost:3000
- Users: http://localhost:3000/users
- Projects: http://localhost:3000/projects

The seed script creates five sample users. It uses upserts, so rerunning it does not duplicate users with the same email addresses.

To stop the services:

```bash
docker compose down
```

To stop the services and delete the database volume, use:

```bash
docker compose down -v
```

**Warning:** The second command deletes the persisted PostgreSQL data.

### Option 2: Local Development

Install dependencies:

```bash
npm ci
```

Create your environment file:

```bash
cp .env.example .env
```

Start PostgreSQL and make sure the database URL in `.env` points to your local database.

Generate the Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Seed sample users:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List users with pagination, search, and role filtering |
| POST | `/api/users` | Create a user |
| GET | `/api/users/:id` | Retrieve a user |
| PATCH | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

The API validates incoming data and returns appropriate status codes for invalid input, missing users, and duplicate emails.

Example list request:

```text
GET /api/users?page=1&size=10&role=admin&search=alice
```

## Testing

Run the TypeScript check:

```bash
npx tsc --noEmit
```

Run pagination and statistics unit tests:

```bash
npx tsx --test tests/pagination.test.ts tests/stats.test.ts
```

Run API tests:

```bash
npx tsx --test tests/api-users.test.ts tests/api-user-by-id.test.ts
```

Build the production application:

```bash
npm run build
```

The API tests require a reachable PostgreSQL database and a valid `DATABASE_URL`.

## Architecture Notes

- **Server Components** read URL parameters and fetch data on the server.
- **Client Components** handle interactive forms, debounced search, and pagination navigation.
- **Service layer:** user-related database operations are kept in `lib/services/users.ts`.
- **Validation:** shared Zod schemas validate user input.
- **Pagination:** `lib/pagination.ts` contains reusable pagination logic.
- **Statistics:** `lib/stats.ts` contains pure calculation logic, separate from database access.
- **Database:** Prisma manages the PostgreSQL schema, migrations, and seed data.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |

Use `.env.example` as a template for local development. Do not commit `.env` or production secrets.

## Project Structure

```text
app/                 Pages and API routes
components/           Reusable UI components
lib/services/         User service and database operations
lib/validators/       Zod schemas
lib/pagination.ts     Pagination utilities
lib/stats.ts          Statistics calculations
prisma/               Schema, migrations, and seed script
tests/                Unit and API tests
Dockerfile            Application image
docker-compose.yml    Application and database services
```
