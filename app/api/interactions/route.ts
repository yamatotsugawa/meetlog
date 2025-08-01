import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { interactionSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = interactionSchema.parse(body);
    const created = await prisma.interaction.create({
      data: {
        ...parsed,
        // ISO文字列をDateに任せる
        occurredAt: new Date(parsed.occurredAt),
        nextApptAt: parsed.nextApptAt ? new Date(parsed.nextApptAt) : undefined,
      } as any,
      select: { id: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Bad Request" }, { status: 400 });
  }
}
