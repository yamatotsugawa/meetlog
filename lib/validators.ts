import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const personSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  company: z.preprocess(emptyToUndefined, z.string().optional()),
  email: z
    .preprocess(emptyToUndefined, z.string().email("メール形式が不正です").optional()),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  mainContactTool: z
    .enum(["LINE", "EMAIL", "MESSENGER", "DM", "OTHER"])
    .optional(),
  facebookUrl: z
    .preprocess(emptyToUndefined, z.string().url("URLが不正です").optional()),
  firstMetAt: z.preprocess(
    emptyToUndefined,
    z.string().datetime().optional()
  ),
  firstMetHow: z.preprocess(emptyToUndefined, z.string().optional()),
  leadType: z.enum(["SUPPLIER", "PROSPECT", "FRIEND", "PARTNER", "OTHER"]).optional(),
  appearance: z.preprocess(emptyToUndefined, z.string().optional()),
  personality: z.preprocess(emptyToUndefined, z.string().optional()),
  impression: z.preprocess(emptyToUndefined, z.string().optional()),
  followupPlan: z.preprocess(emptyToUndefined, z.string().optional()),
  nextApptAt: z.preprocess(emptyToUndefined, z.string().datetime().optional()),
  nextApptNote: z.preprocess(emptyToUndefined, z.string().optional()),
  // JSON の配列として受ける（未指定なら []）
  tags: z.preprocess((v) => (v == null ? [] : v), z.array(z.string())).optional(),
});

export const interactionSchema = z.object({
  personId: z.string().min(1),
  occurredAt: z.string().datetime(),
  place: z.preprocess(emptyToUndefined, z.string().optional()),
  context: z.enum(["MEAL","DRINKS","LUNCH","MEETING","ONLINE","EVENT","OTHER"]).optional(),
  talkedAbout: z.preprocess(emptyToUndefined, z.string().optional()),
  nextAction: z.preprocess(emptyToUndefined, z.string().optional()),
  nextApptAt: z.preprocess(emptyToUndefined, z.string().datetime().optional()),
  nextApptNote: z.preprocess(emptyToUndefined, z.string().optional()),
  memo: z.preprocess(emptyToUndefined, z.string().optional()),
});
