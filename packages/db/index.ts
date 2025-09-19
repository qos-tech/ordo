import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['error'],
})

export * from '@prisma/client'