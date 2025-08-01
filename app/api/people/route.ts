import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { personSchema } from "@/lib/validators";

function zodErrorToMessage(e: any) {
  if (e?.issues?.length) {
    // 1件目の分かりやすいメッセージを返す
    return e.issues.map((i: any) => i.message).join(", ");
  }
  return e?.message || "Bad Request";
}

export async function GET() {
  const people = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ people });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = personSchema.parse(body);
    const created = await prisma.person.create({
      data: {
        ...parsed,
        // Prisma(Json) に配列を保存（未指定なら []）
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        // 日付文字列は Prisma が自動で Date 化できるが、明示してもOK
        firstMetAt: parsed.firstMetAt ? new Date(parsed.firstMetAt) : undefined,
        nextApptAt: parsed.nextApptAt ? new Date(parsed.nextApptAt) : undefined,
      } as any,
      select: { id: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    const msg = zodErrorToMessage(e);
    // 開発中はサーバ側ログにも出す
    console.error("[POST /api/people] error:", msg, e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
