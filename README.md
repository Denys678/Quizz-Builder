
# Quiz Builder

A full-stack application for creating and managing custom quizzes.

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS

**Backend:** Node.js, Express.js, TypeScript, Prisma, PostgreSQL, Zod

**Tools:** Docker, ESLint, Prettier

## Features

- Create quizzes with multiple questions
- Supported question types: Boolean, Input, Checkbox
- Dynamically add and remove questions and answer options
- View all quizzes with question counts
- View individual quizzes in read-only mode
- Delete quizzes
- Form validation and responsive design

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- Docker Desktop

### 1. Clone the repository

```bash
git clone <repository-url>
cd Quizz-Builder
```

### 2. Start Backend and Database

```bash
cd backend
docker compose up -d --build
```

Docker Compose starts PostgreSQL and Express, applies Prisma migrations, and exposes the API at:

http://localhost:5001

Verify the server at:
http://localhost:5001/api/health

### 3. Start Frontend

Open another terminal:

```bash
cd frontend
npm ci
```

Create `.env.local` using `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Start the application:

```bash
npm run dev
```

Open http://localhost:3000

## Environment Configuration

Backend variables are provided through Docker Compose.

For local backend development, create `backend/.env` based on `.env.example`, then run:

```bash
cd backend
docker compose up -d db
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Do not run the Dockerized backend and local Express simultaneously on port 5001.

## API Endpoints

| Method |   Endpoint   |    Description   |
|--------|--------------|------------------|
|  POST  | /quizzes     |   Create a quiz  |
|  GET   | /quizzes     | List all quizzes |
|  GET   | /quizzes/:id | Get quiz details |
| DELETE | /quizzes/:id |   Delete a quiz  |

## Creating a Sample Quiz

1. Open http://localhost:3000/create
2. Enter a quiz title, e.g. "JavaScript Basics"
3. Add questions using Boolean, Input or Checkbox types
4. Specify correct answers and click "Create Quiz"
5. View the created quiz and return to `/quizzes` to manage it

## Code Quality

Run these commands in the frontend or backend directory:

```bash
npm run lint
npx tsc --noEmit
npx prettier --check .
```

## Notes

- Environment files are excluded from Git.
- Database migrations are managed through Prisma.
- Quiz details are read-only; quiz solving is not implemented.
