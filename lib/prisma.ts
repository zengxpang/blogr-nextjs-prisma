import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

// 以前全局对象不统一，写代码要判断环境，很麻烦：
// 浏览器 → window
// Node.js → global
// Web Worker → self
// 现在 ES2020 统一了：
// 全部环境都用 globalThis ✅

// globalThis 全局对象,把 Prisma 实例挂在全局，避免开发模式重复生成
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
