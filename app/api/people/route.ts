import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { personSchema } from "@/lib/validators";
import type { ZodError } from "zod";

function zodErrorToMessage(e: unknown) {
  if (typeof e === "object" && e && "issues" in e) {
    const ze = e as ZodError;
    return ze.issues.map((i) => i.message).join(", ");
  }
  if (e instanceof Error) return e.message;
  return "Bad Request";
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
    const body = (await req.json()) as unknown;
    const parsed = personSchema.parse(body);
    const created = await prisma.person.create({
      data: {
        ...parsed,
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        firstMetAt: parsed.firstMetAt ? new Date(parsed.firstMetAt) : undefined,
        nextApptAt: parsed.nextApptAt ? new Date(parsed.nextApptAt) : undefined,
      },
      select: { id: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = zodErrorToMessage(e);
    console.error("[POST /api/people] error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
