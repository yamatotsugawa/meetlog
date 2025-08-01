import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { interactionSchema } from "@/lib/validators";
import type { ZodError } from "zod";

function zodErrorToMessage(e: unknown) {
  if (typeof e === "object" && e && "issues" in e) {
    const ze = e as ZodError;
    return ze.issues.map((i) => i.message).join(", ");
  }
  if (e instanceof Error) return e.message;
  return "Bad Request";
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = interactionSchema.parse(body);
    const created = await prisma.interaction.create({
      data: {
        personId: parsed.personId,
        occurredAt: new Date(parsed.occurredAt),
        place: parsed.place ?? undefined,
        context: parsed.context ?? undefined,
        talkedAbout: parsed.talkedAbout ?? undefined,
        nextAction: parsed.nextAction ?? undefined,
        nextApptAt: parsed.nextApptAt ? new Date(parsed.nextApptAt) : undefined,
        nextApptNote: parsed.nextApptNote ?? undefined,
        memo: parsed.memo ?? undefined,
      },
      select: { id: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = zodErrorToMessage(e);
    console.error("[POST /api/interactions] error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
