import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL

export const prisma = databaseUrl && databaseUrl !== '' 
  ? (globalForPrisma.prisma ?? new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    }))
  : null

if (process.env.NODE_ENV !== 'production' && databaseUrl && databaseUrl !== '') {
  globalForPrisma.prisma = prisma
}
