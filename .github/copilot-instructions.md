# Copilot Instructions for deutsch-meister

## Project Overview
- **Architecture:** Monorepo with NestJS backend (`src/`), Prisma ORM (`prisma/`, `generated/prisma/`), and GraphQL API (`src/schema.gql`).
- **Major Components:**
  - `src/`: Main NestJS app, organized by domain (e.g., `auth/`, `lesson/`, `quiz/`, `user/`).
  - `prisma/`: Database schema and migrations.
  - `generated/prisma/`: Generated Prisma client and runtime files.
- **Data Flow:**
  - GraphQL resolvers (e.g., `quiz.resolver.ts`) call service classes (e.g., `quiz.service.ts`) which interact with Prisma for DB access.
  - Auth handled via JWT and Passport strategies in `src/auth/`.

## Developer Workflows
- **Install dependencies:** `pnpm install`
- **Run app:** `pnpm start` or `pnpm run start:dev` (uses ts-node-dev)
- **Run tests:** `pnpm test` (unit) or `pnpm run test:e2e` (integration)
- **Prisma workflows:**
  - Edit schema in `prisma/schema.prisma`
  - Run migrations: `pnpm prisma migrate dev -n <name>`
  - Generate client: `pnpm prisma generate`
- **GraphQL:**
  - Schema file: `src/schema.gql` (auto-generated or manually maintained)
  - Resolvers in `src/*/*.resolver.ts`

## Project-Specific Patterns
- **Service/Resolver Pattern:** Each domain (e.g., quiz, lesson) has a module, service, and resolver. Services encapsulate business logic and DB access.
- **DTOs/Models:** Types defined in `src/models/` and used for type safety in resolvers/services.
- **Config:** Centralized config in `src/config/`.
- **Shared Types/Constants:** Use `src/shared/types/` and `src/shared/constants/` for cross-domain values.
- **Testing:** E2E tests in `test/` use NestJS testing utilities.

## Integration Points
- **Prisma:** DB access via generated client in `generated/prisma/`.
- **GraphQL:** API layer, schema in `src/schema.gql`, resolvers per domain.
- **Auth:** JWT/Passport, strategies in `src/auth/`.

## Conventions
- **File Naming:**
  - `*.module.ts` for NestJS modules
  - `*.service.ts` for business logic
  - `*.resolver.ts` for GraphQL resolvers
  - `*.model.ts` for type definitions
- **Imports:** Prefer absolute imports from `src/` root.
- **Environment:** Use config service for env vars, do not hardcode secrets.

## Examples
- To add a new domain (e.g., `course`):
  1. Create `src/course/course.module.ts`, `course.service.ts`, `course.resolver.ts`, and update `app.module.ts`.
  2. Add models in `src/models/course.model.ts`.
  3. Update GraphQL schema if needed.
- To update DB schema:
  1. Edit `prisma/schema.prisma`
  2. Run `pnpm prisma migrate dev -n <desc>`
  3. Run `pnpm prisma generate`

---
If any section is unclear or missing, please provide feedback to improve these instructions.