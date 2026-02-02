# OX Group Backend Test Task

## Setup
1. Clone the repo: `git clone <your-github-url>`
2. Install dependencies: `npm install`
3. Set up `.env` (see .env example above).
4. Run migrations: `npx prisma migrate dev`
5. Start server: `npm run start:dev`

## Endpoints
- POST /auth/login { email }
- POST /auth/verify { email, otp }
- POST /register-company { token, subdomain } (JWT required)
- DELETE /company/:id (Admin only)
- GET /products?page=1&size=10 (Manager only)

Uses Prisma with SQLite (switch to PostgreSQL in .env for prod).