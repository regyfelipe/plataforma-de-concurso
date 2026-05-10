import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
})

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL não encontrada no ambiente.")
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}