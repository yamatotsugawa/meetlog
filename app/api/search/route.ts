import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ results: [] });

  // スペース区切りAND検索
  const terms = q.split(/\s+/).map((t) => t.replace(/['"]/g, ""));
  const match = terms.join(" AND ");

  // search_index（FTS5）から person_id を集計
  const rows: { person_id: string }[] = await prisma.$queryRawUnsafe(
    `
    SELECT person_id
    FROM search_index
    WHERE search_index MATCH ?
    GROUP BY person_id
    ORDER BY COUNT(*) DESC
    LIMIT 50;
  `,
    match
  );

  if (rows.length === 0) return NextResponse.json({ results: [] });

  const ids = rows.map((r) => r.person_id);
  const people = await prisma.person.findMany({
    where: { id: { in: ids } },
    include: {
      interactions: { take: 1, orderBy: { occurredAt: "desc" } },
    },
  });
  const map = new Map(people.map((p) => [p.id, p]));
  const ordered = ids.map((id) => map.get(id)).filter(Boolean);
  return NextResponse.json({ results: ordered });
}
