import { PrismaClient } from '@prisma/client'

// Create a global instance to avoid re-creating on HMR update.
if (!globalThis.__prismaClient) {
  globalThis.__prismaClient = new PrismaClient()
}

export const prisma = globalThis.__prismaClient
