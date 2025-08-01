import { PrismaClient } from "@prisma/client";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function resolveSqliteUrl() {
  const url = process.env.DATABASE_URL;
  // すでに file:/ から始まる絶対URLならそのまま
  if (url && /^file:\/\//.test(url)) return url;

  // ./prisma/dev.db のような相対指定 or 未指定 → 絶対パスにする
  const abs = path.resolve(process.cwd(), "prisma", "dev.db");
  return `file:${abs}`;
}

const prismaClient =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {
      db: { url: resolveSqliteUrl() },
    },
    log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;

export const prisma = prismaClient;
