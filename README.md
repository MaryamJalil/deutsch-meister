pnpm add -D prisma
pnpm add @prisma/client
pnpm prisma generate

# core deps
pnpm add @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs

# GraphQL (if you use GraphQL)
pnpm add @nestjs/graphql @nestjs/apollo apollo-server-express graphql

# auth + validation
pnpm add passport passport-jwt @nestjs/jwt @nestjs/passport bcrypt class-validator class-transformer

# prisma client
pnpm add @prisma/client

# dev tooling
pnpm add -D prisma typescript ts-node-dev @types/node

