import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { personSchema } from "@/lib/validators";

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
        // tags は Json として保存（配列想定）
        tags: parsed.tags ?? [],
      } as any,
      select: { id: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 });
  }
}
