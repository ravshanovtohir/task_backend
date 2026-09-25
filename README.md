# Role Management

## Tech stack

| Technology | Version / requirement |
| ---------- | --------------------- |
| Node.js    | 20 or newer           |
| TypeScript | 5.7+                  |
| NestJS     | 11                    |
| Prisma     | 7.10                  |
| PostgreSQL | 16+                   |
| Redis      | 7+                    |
| pnpm       | 9 or newer            |

## Installation

Make sure Node.js, PostgreSQL, and Redis are installed and running. Install pnpm using the
[official instructions](https://pnpm.io/installation), or use:

```bash
npm install -g pnpm
```

Install the project dependencies:

```bash
pnpm install
```

Prisma and NestJS CLIs are already project dependencies, so global installation is optional. Use `pnpm exec prisma` and
the scripts in `package.json` to run the local versions.

## Environment variables

Create a `.env` file in the project root and set the values for your environment:

```dotenv
# Application
APP_PORT=3000

# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/insurance?schema=public"

# JWT
JWT_ACCESS_SECRET="replace-with-a-long-random-access-secret"
JWT_REFRESH_SECRET="replace-with-a-long-random-refresh-secret"
JWT_ACCESS_EXPIRE_TIME="86400"
JWT_REFRESH_EXPIRE_TIME="864000"

# Roles metadata
ROLES_DECORATOR_KEY="roles"

# Initial administrator
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@123"

# Redis
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PASSWORD="your-redis-password"
```

| Variable                  | Description                                                                                                | Example                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------- |
| `APP_PORT`                | Backend HTTP port                                                                                          | `3000`                    |
| `DATABASE_URL`            | PostgreSQL connection URL                                                                                  | `postgresql://...`        |
| `JWT_ACCESS_SECRET`       | Secret used to sign access tokens                                                                          | Long random string        |
| `JWT_REFRESH_SECRET`      | Required by the current environment config; refresh tokens are currently opaque and do not use this secret | Long random string        |
| `JWT_ACCESS_EXPIRE_TIME`  | Access-token lifetime in seconds                                                                           | `86400`                   |
| `JWT_REFRESH_EXPIRE_TIME` | Refresh-token lifetime in seconds                                                                          | `864000`                  |
| `ROLES_DECORATOR_KEY`     | Role metadata key                                                                                          | `roles`                   |
| `ADMIN_EMAIL`             | Email used by the initial admin seeder                                                                     | `admin@example.com`       |
| `ADMIN_PASSWORD`          | Password used by the initial admin seeder                                                                  | `Admin@123`               |
| `REDIS_HOST`              | Redis hostname                                                                                             | `127.0.0.1`               |
| `REDIS_PORT`              | Redis port                                                                                                 | `6379`                    |
| `REDIS_PASSWORD`          | Redis password                                                                                             | Configured Redis password |

Do not commit real secrets to Git. The database specified in `DATABASE_URL` must already exist.

## Database setup and startup

Run these commands in order:

```bash
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm exec prisma db seed
pnpm run start:dev
```

The UUID migration enables `pgcrypto` with `CREATE EXTENSION IF NOT EXISTS`. PostgreSQL 16+ also provides
`gen_random_uuid()` as a built-in function.

The API runs on `http://localhost:3000` when `APP_PORT=3000`.

## Commands

| Command                                      | Description                                         |
| -------------------------------------------- | --------------------------------------------------- |
| `pnpm fmt`                                   | Lint and format project source code                 |
| `pnpm exec prisma migrate dev --name <name>` | Create and apply a new migration during development |
| `pnpm exec prisma migrate deploy`            | Apply existing migrations                           |
| `pnpm exec prisma generate`                  | Generate Prisma Client                              |
| `pnpm exec prisma db seed`                   | Run the seeders                                     |
| `pnpm build`                                 | Build the project                                   |
| `pnpm start`                                 | Run the project                                     |
| `pnpm run start:dev`                         | Run the project in watch mode                       |
| `pnpm run start:prod`                        | Run the compiled project                            |

Run `pnpm exec prisma generate` again after changing `prisma/schema.prisma`. `migrate deploy` applies migrations; it
does not create them.

## Swagger documentation

After starting the backend, open `http://localhost:3000/docs` (replace `3000` if `APP_PORT` is different).

The current local Swagger Basic Auth credentials are:

```text
Username: 1
Password: 1
```

Change these credentials before using the application in production.

## Localization

The backend supports Uzbek and Russian API messages. Pass the requested language in each request:

```http
Accept-Language: uz
```

or:

```http
Accept-Language: ru
```

If the header is not supplied, Uzbek is used as the fallback language. Translation files are located in
`src/i18n/uz/main.json` and `src/i18n/ru/main.json`.

## Response format

Successful response:

```json
{
  "success": true,
  "message": "",
  "code": 200,
  "data": {}
}
```

Paginated response:

```json
{
  "success": true,
  "message": "",
  "code": 200,
  "data": [],
  "meta": {
    "totalPage": 10,
    "totalSize": 10,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "totalItems": 100
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Session cleanup

Expired PostgreSQL sessions are removed automatically by a scheduled NestJS task every day at `03:00` (`Asia/Tashkent`).
Redis session keys expire independently through their configured TTL.

## Project structure

```text
src/
├── common/
│   ├── constants/
│   ├── decorators/
│   ├── enums/
│   ├── exceptions/
│   ├── guards/
│   ├── helpers/
│   ├── interceptors/
│   ├── interfaces/
│   ├── pipes/
│   └── strategy/
├── config/
├── i18n/
│   ├── ru/
│   └── uz/
├── modules/
│   ├── auth/
│   ├── cron/
│   ├── payment/
│   ├── prisma/
│   ├── redis/
│   ├── role/
│   └── staff/
├── app.module.ts
└── main.ts

prisma/
├── migrations/
└── schema.prisma
```
